from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer, UserCreateSerializer
from .permissions import IsSuperuserRole


class UserViewSet(viewsets.ModelViewSet):
  queryset = CustomUser.objects.all()
  permission_classes = [IsSuperuserRole]

  def get_serializer_class(self):
    if self.action == 'create':
      return UserCreateSerializer
    return UserSerializer


class MeView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)