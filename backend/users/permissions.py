from rest_framework import permissions

class IsSuperuserRole(permissions.BasePermission):
  """Solo usuarios con role='superuser' (o is_superuser de Django)."""

  def has_permission(self, request, view):
    return (
      request.user.is_authenticated and
      (request.user.role == 'superuser' or request.user.is_superuser)
    )


class IsHR(permissions.BasePermission):
  """Solo RRHH o superuser."""

  def has_permission(self, request, view):
    return (
      request.user.is_authenticated and
      request.user.role in ['hr', 'superuser']
  )


class IsStock(permissions.BasePermission):
  """Solo Stock o superuser."""

  def has_permission(self, request, view):
    return (
      request.user.is_authenticated and
      request.user.role in ['stock', 'superuser']
    )