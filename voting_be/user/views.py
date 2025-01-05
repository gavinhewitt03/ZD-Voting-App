from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from .models import User

# Create your views here.

@api_view(['POST'])
def login(request):
    username = request.data['username']
    password = request.data['password']

    # authenticate user
    user = get_object_or_404(User, username=username)
    if not user.check_password(password):
        return Response("Invalid password.", status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.is_active:
        return Response("Account is inactive. Please ask exec or tech chair to activate your account.", status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = UserSerializer(instance=user)
    token, created = Token.objects.get_or_create(user=user)

    if token:
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
    
    return Response("Failed to create authentication token.", status=status.HTTP_500_INTERNAL_SERVER_ERROR) # should never happen

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password']) # ensure password is set to real password and not hashed one
        user.save()

        # TODO: delete creating token ?? and set active to false so user cannot login & vote until administrator approves them. keeping for now for testing purposes
        token = Token.objects.create(user=user)
        if token:
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)
        
        return Response("Failed to create authentication token.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)