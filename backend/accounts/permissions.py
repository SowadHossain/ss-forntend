from rest_framework.permissions import BasePermission
from rest_framework import permissions


class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SELLER'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsBuyer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'BUYER'


class IsSuperAdmin(BasePermission):
    """
    Permission for super admins - users who are both ADMIN role and superuser
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.role == 'ADMIN' and 
                request.user.is_superuser)