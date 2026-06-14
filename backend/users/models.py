from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):
  class Role(models.TextChoices):
    SUPERUSER = 'superuser', 'Superuser'
    HR = 'hr', 'Recursos Humanos'
    STOCK = 'stock', 'Stock'
    MARKETING = 'marketing', 'Marketing'
    EMPLOYEE = 'employee', 'Empleado'

  role = models.CharField(
    max_length=20,
    choices=Role.choices,
    default=Role.EMPLOYEE,
  )

  def __str__(self):
    return self.username