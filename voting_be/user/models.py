from django.db import models
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from datetime import date, datetime

def date_validator(value):
    print(value)
    if not value:
        raise ValidationError('Graduation Year is required.')

    if isinstance(value, str):
        try:
            value = datetime.strptime(value, '%Y-%m-%d').date()
        except ValueError:
            raise ValidationError('Graduation Year must be in the form YYYY-mm-dd.')

    if value <= date.today():
        raise ValidationError('Graduation Year cannot be a past date.')

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(max_length=254, unique=True, blank=True, verbose_name='email address')
    password = models.CharField(max_length=128, verbose_name="password")
    first_name = models.CharField(max_length=150, blank=True, verbose_name='first name')
    last_name = models.CharField(max_length=150, blank=True, verbose_name='last name')
    is_active = models.BooleanField(default=False, verbose_name='is active')
    grad_year = models.DateField(blank=False, null=False, verbose_name='grad year')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'grad_year']

    def __str__(self):
        return self.email
    
class LoggedInUsers(models.Model):
    full_name = models.CharField(max_length=150, unique=True, blank=False, null=False, verbose_name='full name')