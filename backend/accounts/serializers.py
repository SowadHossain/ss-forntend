from rest_framework import serializers
from .models import CustomUser, SellerProfile
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ('email', 'name', 'phone', 'address', 'password', 'role')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', ''),
            role=validated_data.get('role', 'BUYER')
        )

        # ✅ Auto-create empty seller profile for SELLER role
        if user.role == 'SELLER':
            SellerProfile.objects.create(
                user=user,
                store_name=f"{user.name}'s Store",
                location=user.address or 'Not specified'
            )

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'name', 'phone', 'address', 'role', 'date_joined')


class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = [
            'store_name',
            'store_description',
            'location',
            'website',
            'logo',
        ]
