from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=('email', 'password', 'first_name', 'last_name', 'groups', 'is_active')