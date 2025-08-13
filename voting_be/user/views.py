from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from .serializers import *
from .models import CustomUser

class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()

        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {'refresh':str(token),
                          'access':str(token.access_token)}
        
        return Response(data=data, status=status.HTTP_201_CREATED)
    
class LoginAPIView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        serializer = UserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {'refresh':str(token),
                          'access':str(token.access_token)}
        
        # add user to list of logged in users
        IGNORE_USERS = [
            'sotheta@mailbox.sc.edu', 
            'thetatauzdregent@gmail.com', 
            'thetatauzdstandards@gmail.com', 
            'thetatauzdtechnology@gmail.com'
        ]
        if user.email in IGNORE_USERS:
            return Response(data=data, status=status.HTTP_200_OK)

        user_full_name = user.get_full_name()
        logged_in_serializer = LoggedInUserSerializer(data = {'full_name': user_full_name})

        if logged_in_serializer.is_valid():
            logged_in_serializer.save()
        else:
            print('failed to add user to logged in users')
        
        return Response(data=data, status=status.HTTP_200_OK)
    
class LogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            # remove user from logged in list
            full_name = request.data["full_name"]
            logged_in_user = get_object_or_404(LoggedInUsers, full_name=full_name)

            logged_in_user.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

@api_view(['GET'])
def get_all_users(request):
    User = get_user_model()

    users = User.objects.all()

    serializer = UserSerializer(users, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def update_is_active(request):
    email = request.data['email']
    user = CustomUser.objects.get(email=email)

    user.is_active = not user.is_active

    serializer = UserSerializer(user, data={'is_active': user.is_active}, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_logged_in(request):
    logged_in_users = LoggedInUsers.objects.all()

    serializer = LoggedInUserSerializer(logged_in_users, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_full_name(request):
    email = request.data['email']

    user = get_object_or_404(CustomUser, email=email)

    return Response({'full_name': user.get_full_name()})

@api_view(['DELETE'])
def force_logout(request):
    full_name = request.data['full_name']
     
    user = get_object_or_404(LoggedInUsers, full_name=full_name)
    user.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['DELETE'])
def clear_logged_in(request):
    LoggedInUsers.objects.all().delete()

    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def change_password(request):
    email = request.data['email']
    password = request.data['password']

    user = get_object_or_404(CustomUser, email=email)
    user.set_password(password)
    user.save()

    return Response(status=status.HTTP_200_OK)
