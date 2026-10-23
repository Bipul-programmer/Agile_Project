from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ClaimViewSet, ItemViewSet

router = DefaultRouter()
router.register('items', ItemViewSet, basename='item')
router.register('claims', ClaimViewSet, basename='claim')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = router.urls
