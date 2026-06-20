from django.db import models
from django.utils import timezone

class Banner(models.Model):
  title = models.CharField(max_length=200)
  image = models.ImageField(upload_to='banners/')
  link_url = models.URLField(blank=True)
  order = models.PositiveIntegerField(default=0)
  is_active = models.BooleanField(default=True)
  start_date = models.DateField(null=True, blank=True)
  end_date = models.DateField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    verbose_name = 'Banner'
    verbose_name_plural = 'Banners'
    ordering = ['order', '-created_at']

  def __str__(self):
    return self.title

  @property
  def is_currently_active(self):
    if not self.is_active:
      return False
    today = timezone.now().date()
    if self.start_date and today < self.start_date:
      return False
    if self.end_date and today > self.end_date:
      return False
    return True


class Coupon(models.Model):
  class DiscountType(models.TextChoices):
    PERCENTAGE = 'percentage', 'Porcentaje'
    FIXED = 'fixed', 'Monto fijo'

  code = models.CharField(max_length=30, unique=True)
  description = models.CharField(max_length=200, blank=True)
  discount_type = models.CharField(
    max_length=20,
    choices=DiscountType.choices,
    default=DiscountType.PERCENTAGE,
  )
  discount_value = models.DecimalField(max_digits=10, decimal_places=2)
  max_uses = models.PositiveIntegerField(null=True, blank=True)
  times_used = models.PositiveIntegerField(default=0)
  is_active = models.BooleanField(default=True)
  start_date = models.DateField(null=True, blank=True)
  end_date = models.DateField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    verbose_name = 'Cupón'
    verbose_name_plural = 'Cupones'
    ordering = ['-created_at']

  def __str__(self):
    return self.code

  @property
  def is_currently_valid(self):
    if not self.is_active:
      return False
    today = timezone.now().date()
    if self.start_date and today < self.start_date:
      return False
    if self.end_date and today > self.end_date:
      return False
    if self.max_uses is not None and self.times_used >= self.max_uses:
      return False
    return True