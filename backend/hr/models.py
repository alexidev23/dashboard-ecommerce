from django.db import models


class Department(models.Model):
  name = models.CharField(max_length=100)
  description = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    verbose_name = 'Departamento'
    verbose_name_plural = 'Departamentos'
    ordering = ['name']

  def __str__(self):
    return self.name


class Position(models.Model):
  name = models.CharField(max_length=100)
  department = models.ForeignKey(
    Department,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='positions'
  )
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    verbose_name = 'Puesto'
    verbose_name_plural = 'Puestos'
    ordering = ['name']

  def __str__(self):
    return self.name


class Employee(models.Model):
  class Status(models.TextChoices):
    ACTIVE = 'active', 'Activo'
    INACTIVE = 'inactive', 'Inactivo'
    ON_LEAVE = 'on_leave', 'De licencia'

  first_name = models.CharField(max_length=100)
  last_name = models.CharField(max_length=100)
  email = models.EmailField(unique=True)
  phone = models.CharField(max_length=20, blank=True)
  document_number = models.CharField(max_length=20, unique=True)
  position = models.ForeignKey(
    Position,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='employees'
  )
  hire_date = models.DateField()
  status = models.CharField(
    max_length=20,
    choices=Status.choices,
    default=Status.ACTIVE,
  )
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    verbose_name = 'Empleado'
    verbose_name_plural = 'Empleados'
    ordering = ['last_name', 'first_name']

  def __str__(self):
    return f'{self.last_name}, {self.first_name}'

  @property
  def full_name(self):
    return f'{self.first_name} {self.last_name}'