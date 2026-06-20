from rest_framework import viewsets, filters
from .models import Order
from .serializers import OrderSerializer
from users.permissions import IsSuperuserRole, IsStock


class OrderViewSet(viewsets.ModelViewSet):
  serializer_class = OrderSerializer
  permission_classes = [IsStock]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ['customer_name', 'customer_email']
  ordering_fields = ['created_at', 'status']
  ordering = ['-created_at']

  def get_queryset(self):
    queryset = Order.objects.prefetch_related('items__product').all()
    status = self.request.query_params.get('status')
    if status:
      queryset = queryset.filter(status=status)
    return queryset