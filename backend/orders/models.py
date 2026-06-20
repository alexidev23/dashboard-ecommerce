from django.db import models
from django.core.exceptions import ValidationError
from inventory.models import Product


class Order(models.Model):
  class Status(models.TextChoices):
    PENDING = 'pending', 'Pendiente'
    PROCESSING = 'processing', 'En proceso'
    SHIPPED = 'shipped', 'Enviado'
    DELIVERED = 'delivered', 'Entregado'
    CANCELLED = 'cancelled', 'Cancelado'

  customer_name = models.CharField(max_length=200)
  customer_email = models.EmailField()
  status = models.CharField(
    max_length=20,
    choices=Status.choices,
    default=Status.PENDING,
  )
  notes = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    verbose_name = 'Pedido'
    verbose_name_plural = 'Pedidos'
    ordering = ['-created_at']

  def __str__(self):
    return f'Pedido #{self.id} - {self.customer_name}'

  @property
  def total(self):
    return sum(item.subtotal for item in self.items.all())


class OrderItem(models.Model):
  order = models.ForeignKey(
    Order,
    on_delete=models.CASCADE,
    related_name='items'
  )
  product = models.ForeignKey(
    Product,
    on_delete=models.PROTECT,
    related_name='order_items'
  )
  quantity = models.PositiveIntegerField(default=1)
  unit_price = models.DecimalField(max_digits=10, decimal_places=2)

  class Meta:
    verbose_name = 'Línea de pedido'
    verbose_name_plural = 'Líneas de pedido'

  def __str__(self):
    return f'{self.quantity}x {self.product.name}'

  @property
  def subtotal(self):
    return self.quantity * self.unit_price