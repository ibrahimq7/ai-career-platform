from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import requests
from rest_framework import status
from django.contrib.auth.models import User

class ResumeUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file_obj = request.FILES['resume']
        files = {'resume': (file_obj.name, file_obj.read(), file_obj.content_type)}
        parser_url = 'http://localhost:5000/parse'  # Update if your parser runs elsewhere
        resp = requests.post(parser_url, files=files)
        parsed_data = resp.json()
        return Response(parsed_data)
    

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
