from rest_framework import viewsets, filters
from .models import Department, Position, Employee
from .serializers import DepartmentSerializer, PositionSerializer, EmployeeSerializer
from users.permissions import IsHR

class DepartmentViewSet(viewsets.ModelViewSet):
  queryset = Department.objects.all()
  serializer_class = DepartmentSerializer
  permission_classes = [IsHR]
  filter_backends = [filters.SearchFilter]
  search_fields = ['name']


class PositionViewSet(viewsets.ModelViewSet):
  queryset = Position.objects.select_related('department').all()
  serializer_class = PositionSerializer
  permission_classes = [IsHR]
  filter_backends = [filters.SearchFilter]
  search_fields = ['name', 'department__name']


class EmployeeViewSet(viewsets.ModelViewSet):
  serializer_class = EmployeeSerializer
  permission_classes = [IsHR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ['first_name', 'last_name', 'email', 'document_number']
  ordering_fields = ['last_name', 'hire_date', 'status']
  ordering = ['last_name']

  def get_queryset(self):
    queryset = Employee.objects.select_related(
      'position',
      'position__department'
    ).all()

    status = self.request.query_params.get('status')
    department = self.request.query_params.get('department')

    if status:
      queryset = queryset.filter(status=status)
    if department:
      queryset = queryset.filter(position__department__id=department)

    return queryset