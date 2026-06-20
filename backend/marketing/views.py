from rest_framework import viewsets, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Banner, Coupon
from .serializers import BannerSerializer, CouponSerializer
from users.permissions import IsSuperuserRole

class BannerViewSet(viewsets.ModelViewSet):
  queryset = Banner.objects.all()
  serializer_class = BannerSerializer
  permission_classes = [IsSuperuserRole]
  parser_classes = [MultiPartParser, FormParser, JSONParser]
  filter_backends = [filters.SearchFilter]
  search_fields = ['title']


class CouponViewSet(viewsets.ModelViewSet):
  queryset = Coupon.objects.all()
  serializer_class = CouponSerializer
  permission_classes = [IsSuperuserRole]
  filter_backends = [filters.SearchFilter]
  search_fields = ['code']


class PublicActiveBannersView(APIView):
  """Endpoint público, sin autenticación, para que el futuro ecommerce
  consuma los banners vigentes."""
  permission_classes = [AllowAny]

  def get(self, request):
    banners = Banner.objects.filter(is_active=True).order_by('order')
    active_banners = [b for b in banners if b.is_currently_active]
    serializer = BannerSerializer(active_banners, many=True)
    return Response(serializer.data)