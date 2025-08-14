from rest_framework import serializers
from .models import CustomUser, LoggedInUsers
from django.contrib.auth import authenticate
from datetime import datetime

class CustomDateField(serializers.DateField):
    def to_internal_value(self, value):
        if value in (None, '', 'null'):
            raise serializers.ValidationError('Graduation Year is required.')

        if isinstance(value, list):
            value = value[0]
        
        parsed_date = datetime.strptime(value, "%Y-%m-%d")
        if parsed_date <= datetime.now():
            raise serializers.ValidationError('Graduation Year cannot be a past date.')
        
        return super().to_internal_value(value)

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    grad_year = CustomDateField()
    email = serializers.EmailField(max_length=254)
    
    class Meta:
        model=CustomUser
        fields=('email', 'password', 'first_name', 'last_name', 'groups', 'is_active', 'grad_year')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    grad_year = CustomDateField()

    class Meta:
        model=CustomUser
        fields=('first_name', 'last_name', 'email', 'password1', 'password2', 'grad_year')
        extra_kwargs = {'password': True}

    def validate(self, attrs):
        if not attrs['email']:
            raise serializers.ValidationError('Email is required.')
        if not attrs['first_name']:
            raise serializers.ValidationError('First Name is required.')
        if not attrs['last_name']:
            raise serializers.ValidationError('Last Name is required.')
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
    
class LoggedInUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoggedInUsers
        fields = ['full_name']
    