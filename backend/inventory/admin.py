from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategroyAdmin(admin.ModelAdmin):
  list_display = ('name', 'created_at')
  search_fields = ('name',)
  
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
  list_display = ('name', 'category', 'price', 'stock', 'is_active', 'is_low_stock')
  list_filter = ('category', 'is_active')
  search_fields = ('name', 'description')