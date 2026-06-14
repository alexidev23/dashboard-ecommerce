from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MeView

router = DefaultRouter()
router.register('users', UserViewSet)

urlpatterns = router.urls + [
  path('me/', MeView.as_view(), name='me'),
]