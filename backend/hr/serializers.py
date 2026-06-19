from rest_framework import serializers
from .models import Department, Position, Employee


class DepartmentSerializer(serializers.ModelSerializer):
  class Meta:
    model = Department
    fields = ['id', 'name', 'description', 'created_at']
    read_only_fields = ['created_at']


class PositionSerializer(serializers.ModelSerializer):
  department_name = serializers.CharField(
    source='department.name',
    read_only=True
  )

  class Meta:
    model = Position
    fields = ['id', 'name', 'department', 'department_name', 'created_at']
    read_only_fields = ['created_at']


class EmployeeSerializer(serializers.ModelSerializer):
  position_name = serializers.CharField(
    source='position.name',
    read_only=True
  )
  department_name = serializers.CharField(
    source='position.department.name',
    read_only=True
  )
  full_name = serializers.CharField(read_only=True)

  class Meta:
    model = Employee
    fields = [
      'id', 'first_name', 'last_name', 'full_name',
      'email', 'phone', 'document_number',
      'position', 'position_name', 'department_name',
      'hire_date', 'status', 'created_at', 'updated_at'
    ]
    read_only_fields = ['created_at', 'updated_at']