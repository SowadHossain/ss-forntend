from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser, SellerProfile
from .serializers import RegisterSerializer, UserProfileSerializer, SellerProfileSerializer
from .permissions import IsSeller
from rest_framework.permissions import IsAuthenticated


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SellerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsSeller]

    def get(self, request):
        profile, _ = SellerProfile.objects.get_or_create(user=request.user)
        serializer = SellerProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = SellerProfile.objects.get_or_create(user=request.user)
        serializer = SellerProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
