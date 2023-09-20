from django.middleware.csrf import get_token
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def whoami(request):
    return Response({
        "isAuthenticated": True,
        "username": request.user.username,
    })


@api_view(['GET'])
def get_csrf(request):
    response = Response({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response
