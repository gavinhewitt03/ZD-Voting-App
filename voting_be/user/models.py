from django.db import models
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(max_length=254, unique=True, blank=False, null=False, verbose_name='email address')
    password = models.CharField(max_length=128, verbose_name="password")
    first_name = models.CharField(max_length=150, blank=False, null=False, verbose_name='first name')
    last_name = models.CharField(max_length=150, blank=False, null=False, verbose_name='last name')
    is_active = models.BooleanField(default=False, verbose_name='is active')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email