from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import BannerViewSet, CouponViewSet, PublicActiveBannersView

router = DefaultRouter()
router.register('banners', BannerViewSet)
router.register('coupons', CouponViewSet)

urlpatterns = router.urls + [
  path('public/banners/', PublicActiveBannersView.as_view(), name='public-banners'),
]