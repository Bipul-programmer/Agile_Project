from datetime import date

from rest_framework import serializers

from .models import Category, Claim, Item

MAX_IMAGE_BYTES = 5 * 1024 * 1024


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ItemSerializer(serializers.ModelSerializer):
    reporter = serializers.CharField(source='reporter.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['id', 'kind', 'title', 'description', 'category', 'category_name', 'location',
                  'date_occurred', 'image', 'status', 'reporter', 'is_owner', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']

    def get_is_owner(self, obj) -> bool:
        request = self.context.get('request')
        return bool(request and request.user.is_authenticated and obj.reporter_id == request.user.id)

    def validate_date_occurred(self, value):
        if value > date.today():
            raise serializers.ValidationError('Date cannot be in the future.')
        return value

    def validate_image(self, value):
        if value and value.size > MAX_IMAGE_BYTES:
            raise serializers.ValidationError('Image must be 5 MB or smaller.')
        return value

    def validate(self, attrs):
        # kind can't change after creation (it would confuse existing claims)
        if self.instance and 'kind' in attrs and attrs['kind'] != self.instance.kind:
            raise serializers.ValidationError({'kind': 'Cannot be changed after creation.'})
        return attrs


class ClaimCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = ['message']


class ClaimSerializer(serializers.ModelSerializer):
    claimant = serializers.CharField(source='claimant.username', read_only=True)
    item_title = serializers.CharField(source='item.title', read_only=True)
    contact_email = serializers.SerializerMethodField()

    class Meta:
        model = Claim
        fields = ['id', 'item', 'item_title', 'claimant', 'message', 'status', 'contact_email', 'created_at']

    def get_contact_email(self, obj) -> str | None:
        """After approval, each side sees the other's email."""
        user = self.context['request'].user
        if obj.status != Claim.Status.APPROVED:
            return None
        if user.id == obj.claimant_id:
            return obj.item.reporter.email
        if user.id == obj.item.reporter_id:
            return obj.claimant.email
        return None
