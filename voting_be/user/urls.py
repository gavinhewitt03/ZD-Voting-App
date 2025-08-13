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
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('get_user/', UserInfoAPIView.as_view(), name='get_user'),
    path('update_is_active/', update_is_active, name='update_is_active'),
    path('force/', force_logout, name='force_logout'),
    path('clear/', clear_logged_in, name='clear_logged_in'),
    path('change_password/', change_password, name='change_password')
]