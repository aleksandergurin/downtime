from django.urls import path

from . import views

urlpatterns = [
    path('resources/', views.ResourcesView.as_view(), name='resources'),
    path('resources/<int:pk>', views.ResourceDetails.as_view(), name='resource-details'),
    path('resources/<int:pk>/timeline', views.ResourcesView.as_view(), name='resource-timeline'),
]
