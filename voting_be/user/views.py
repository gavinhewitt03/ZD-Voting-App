from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import CustomUser

class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
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
        
        return Response(data=data, status=status.HTTP_200_OK)
    
class LogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_users(request):
    users = CustomUser.objects.all()

    serializer = UserSerializer(data=users)

    return Response(serializer.data)

@api_view(['GET'])
def get_all_logged_in(request):
    pass

@api_view(['GET'])
def get_full_name(request):
    email = request.data['email']

    user = get_object_or_404(CustomUser, email=email)

    return Response({'full_name': user.get_full_name()})
