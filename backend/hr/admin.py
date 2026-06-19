from django.contrib import admin
from .models import Department, Position, Employee

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
  list_display = ('name', 'created_at')
  search_fields = ('name',)

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
  list_display = ('name', 'department', 'created_at')
  list_filter = ('department',)
  search_fields = ('name',)
  
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
  list_display = ('full_name', 'email', 'position', 'status', 'hire_date')
  list_filter = ('status', 'position__department')
  search_fields = ('first_name', 'last_name', 'email', 'document_number')