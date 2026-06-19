from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, PositionViewSet, EmployeeViewSet

router = DefaultRouter()
router.register('departments', DepartmentViewSet)
router.register('positions', PositionViewSet)
router.register('employees', EmployeeViewSet, basename='employee')

urlpatterns = router.urls