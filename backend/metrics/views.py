from django.db.models import Count, F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from inventory.models import Product
from hr.models import Employee


class MetricsView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    total_products = Product.objects.filter(is_active=True).count()

    low_stock_count = Product.objects.filter(
      is_active=True,
      stock__lte=F('low_stock_threshold')
    ).count()

    total_employees = Employee.objects.filter(status='active').count()

    employees_by_status = dict(
      Employee.objects.values('status')
      .annotate(count=Count('id'))
      .values_list('status', 'count')
    )

    products_by_category = list(
      Product.objects.filter(is_active=True)
      .values('category__name')
      .annotate(count=Count('id'))
      .order_by('-count')
    )

    return Response({
      'products': {
        'total': total_products,
        'low_stock': low_stock_count,
      },
      'employees': {
        'total_active': total_employees,
        'by_status': employees_by_status,
      },
      'products_by_category': products_by_category,
    })