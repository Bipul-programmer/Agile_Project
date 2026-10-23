from django.db import transaction
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Category, Claim, Item
from .permissions import IsReporterOrReadOnly
from .serializers import CategorySerializer, ClaimCreateSerializer, ClaimSerializer, ItemSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.select_related('reporter', 'category')
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsReporterOrReadOnly]
    filterset_fields = ['kind', 'status', 'category']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'date_occurred']

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

    @action(detail=False, permission_classes=[IsAuthenticated])
    def mine(self, request):
        qs = self.filter_queryset(self.get_queryset().filter(reporter=request.user))
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(self.get_serializer(page, many=True).data)

    @extend_schema(request=None, responses=ItemSerializer)
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Reporter marks the item as resolved (returned / no longer needed)."""
        item = self.get_object()  # only the reporter passes the object permission for POST
        item.status = Item.Status.RESOLVED
        item.save(update_fields=['status', 'updated_at'])
        return Response(self.get_serializer(item).data)

    @extend_schema(request=ClaimCreateSerializer, responses={201: ClaimSerializer})
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def claim(self, request, pk=None):
        """Someone says 'this is mine' (found item) or 'I found it' (lost item)."""
        item = self.get_object()
        if item.reporter_id == request.user.id:
            raise ValidationError('You cannot claim your own item.')
        if item.status != Item.Status.OPEN:
            raise ValidationError('This item is no longer open.')
        if Claim.objects.filter(item=item, claimant=request.user).exists():
            raise ValidationError('You already submitted a claim for this item.')
        ser = ClaimCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        claim = ser.save(item=item, claimant=request.user)
        return Response(ClaimSerializer(claim, context={'request': request}).data, status=status.HTTP_201_CREATED)

    @extend_schema(responses=ClaimSerializer(many=True))
    @action(detail=True, permission_classes=[IsAuthenticated])
    def claims(self, request, pk=None):
        """Reporter lists claims on their item."""
        item = self.get_object()
        if item.reporter_id != request.user.id:
            raise PermissionDenied('Only the reporter can view claims.')
        data = ClaimSerializer(item.claims.select_related('claimant', 'item__reporter'), many=True,
                               context={'request': request}).data
        return Response(data)


class ClaimViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Claims I made, plus claims on items I reported."""
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['status', 'item']

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Claim.objects.none()
        u = self.request.user
        return (Claim.objects.filter(Q(claimant=u) | Q(item__reporter=u))
                .select_related('claimant', 'item__reporter'))

    def _decide(self, request, pk, approve):
        with transaction.atomic():
            claim = self.get_object()
            item = Item.objects.select_for_update().get(pk=claim.item_id)
            if item.reporter_id != request.user.id:
                raise PermissionDenied('Only the reporter can decide on claims.')
            if claim.status != Claim.Status.PENDING or item.status != Item.Status.OPEN:
                raise ValidationError('This claim can no longer be changed.')
            if approve:
                claim.status = Claim.Status.APPROVED
                item.status = Item.Status.CLAIMED
                item.save(update_fields=['status', 'updated_at'])
                item.claims.exclude(pk=claim.pk).filter(status=Claim.Status.PENDING).update(status=Claim.Status.REJECTED)
            else:
                claim.status = Claim.Status.REJECTED
            claim.save(update_fields=['status'])
        return Response(self.get_serializer(claim).data)

    @extend_schema(request=None, responses=ClaimSerializer)
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        return self._decide(request, pk, True)

    @extend_schema(request=None, responses=ClaimSerializer)
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        return self._decide(request, pk, False)
