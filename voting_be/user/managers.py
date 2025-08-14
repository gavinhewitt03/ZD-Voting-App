from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password, grad_year, **extra_fields):
        if not email:
            raise ValueError('Email is required.')
        if not grad_year:
            raise ValueError('Graduation Year is required.')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            password=password,
            grad_year=grad_year
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, email, first_name, last_name, password, grad_year, **extra_fields):
        if not email:
            raise ValueError('Email is required.')
        if not grad_year:
            raise ValueError('Graduation Year is required.')
        
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('A superuser must be a staff member.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('A superuser must be a superuser.')

        return self.create_user(email, first_name, last_name, password, grad_year, **extra_fields)