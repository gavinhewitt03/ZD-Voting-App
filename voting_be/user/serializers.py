from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=('email', 'password', 'first_name', 'last_name', 'groups', 'is_active')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model=CustomUser
        fields=('first_name', 'last_name', 'email', 'password1', 'password2')
        extra_kwargs = {'password': True}

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError('Passwords do not match.')
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')

        user = CustomUser(**validated_data)
        user.set_password(password)

        user.save()

        return user
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)

        if user and not user.is_active:
            raise serializers.ValidationError('Account is inactive. Please contact an exec member to activate your account.')
        
        if user:
            return user
        raise serializers.ValidationError("Incorrect email or password.")
    