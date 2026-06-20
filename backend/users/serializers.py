from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = CustomUser
    fields = ['id', 'username', 'email', 'role', 'is_active']


class UserCreateSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, min_length=8)

  class Meta:
    model = CustomUser
    fields = ['id', 'username', 'email', 'role', 'password']

  def create(self, validated_data):
    password = validated_data.pop('password')
    user = CustomUser(**validated_data)
    user.set_password(password)
    user.save()
    return user