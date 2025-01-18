from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('get_users/', get_all_users, name='get_users'),
    path('get_logged_in/', get_all_logged_in, name='get_logged_in'),
    path('get_full_name/', get_full_name, name='get_full_name'),
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('token/refresh', TokenRefreshView.as_view(), name='refresh_token')
]