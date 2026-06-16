from django.db import models
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from users.permissions import IsStock, IsSuperuserRole

class CategoryViewSet(viewsets.ModelViewSet):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer
  permission_classes = [IsStock]
  filter_backends = [filters.SearchFilter]
  search_fields = ['name']

class ProductViewSet(viewsets.ModelViewSet):
  serializer_class = ProductSerializer
  permission_classes = [IsStock]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ['name', 'category__name']
  ordering_fields = ['name', 'price', 'stock', 'created_at']
  ordering = ['name']

  def get_queryset(self):
    queryset = Product.objects.select_related('category').filter(is_active=True)
    category = self.request.query_params.get('category')
    if category:
      queryset = queryset.filter(category__id=category)
    return queryset

  @action(detail=False, methods=['get'])
  def low_stock(self, request):
    products = self.get_queryset().filter(
      stock__lte=models.F('low_stock_threshold')
    )
    serializer = self.get_serializer(products, many=True)
    return Response(serializer.data)