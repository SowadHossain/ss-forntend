from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied

class IpView(APIView):
    ALLOWED_WEBSITE = "https://portfolio-4-e5a.pages.dev"  # Change this to the allowed client website
    """Health endpoint that returns a running message and logs the client IP."""

    permission_classes = [AllowAny]

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # X-Forwarded-For may be a comma-separated list; first is original client
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')

    def get_client_website(self, request):
        return request.META.get('HTTP_ORIGIN') or request.META.get('HTTP_REFERER')

    def get(self, request, *args, **kwargs):
        ip = self.get_client_ip(request)
        client_website = self.get_client_website(request)
        if client_website != self.ALLOWED_WEBSITE:
            raise PermissionDenied("Access denied: client website not allowed.")
        return Response({
            'message': 'server is running',
            'ip': ip,
            'client_website': client_website
        }, status=status.HTTP_200_OK)
