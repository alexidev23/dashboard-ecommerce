from django.db import models

# Create your models here.
class Category(models.Model):
  name = models.CharField(max_length=100)
  description = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  
  class Meta:
    verbose_name = "Categoria"
    verbose_name_plural = "Categorias"
    ordering = ['name']
    
  def __str__(self):
    return self.name
  
class Product(models.Model):
  name = models.CharField(max_length=200)
  description = models.TextField(blank=True)
  price = models.DecimalField(max_digits=10, decimal_places=2)
  stock = models.PositiveIntegerField(default=0)
  low_stock_threshold = models.PositiveIntegerField(default=5)
  category = models.ForeignKey(
    Category, 
    on_delete=models.SET_NULL, 
    null=True, 
    blank=True, 
    related_name='products'
  )
  is_active = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  class Meta:
    verbose_name = "Producto"
    verbose_name_plural = "Productos"
    ordering = ['name']
    
  def __str__(self):
    return self.name
  
  @property
  def is_low_stock(self):
    return self.stock <= self.low_stock_threshold