"""
URL Configuration
"""
from django.contrib import admin
from django.urls import path, include

from . import views


urlpatterns = [
    path('api/downtime/', include('webapp.downtime.urls')),
    # api/login api/logout
    path('api/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/whoami/', views.whoami, name='whoami'),
    path('api/csrf/', views.get_csrf, name='csrf'),
    path('admin/', admin.site.urls),
]
