from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from inventory.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
  product_name = serializers.CharField(source='product.name', read_only=True)
  subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
  unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

  class Meta:
    model = OrderItem
    fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
  items = OrderItemSerializer(many=True)
  total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

  class Meta:
    model = Order
    fields = [
      'id', 'customer_name', 'customer_email', 'status', 'notes',
      'items', 'total', 'created_at', 'updated_at'
    ]
    read_only_fields = ['created_at', 'updated_at']

  def validate_items(self, items):
    if not items:
      raise serializers.ValidationError('El pedido debe tener al menos un producto.')
    return items

  @transaction.atomic
  def create(self, validated_data):
    items_data = validated_data.pop('items')
    order = Order.objects.create(**validated_data)

    for item_data in items_data:
      product = item_data['product']
      quantity = item_data['quantity']

      if product.stock < quantity:
        raise serializers.ValidationError(
          f'Stock insuficiente para "{product.name}". Disponible: {product.stock}'
        )

      OrderItem.objects.create(
        order=order,
        product=product,
        quantity=quantity,
        unit_price=item_data.get('unit_price', product.price),
      )

      product.stock -= quantity
      product.save()

    return order

  @transaction.atomic
  def update(self, instance, validated_data):
    items_data = validated_data.pop('items', None)

    instance.customer_name = validated_data.get('customer_name', instance.customer_name)
    instance.customer_email = validated_data.get('customer_email', instance.customer_email)
    instance.status = validated_data.get('status', instance.status)
    instance.notes = validated_data.get('notes', instance.notes)
    instance.save()

    if items_data is not None:
      instance.items.all().delete()
      for item_data in items_data:
        OrderItem.objects.create(order=instance, **item_data)

    return instance