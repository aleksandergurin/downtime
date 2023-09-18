from rest_framework import generics, mixins
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from . import models
from . import serializers


class ResourcesView(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ResourceSerializer

    def get_queryset(self):
        user = self.request.user
        return models.Resource.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ResourceDetails(
    generics.RetrieveAPIView,
    generics.DestroyAPIView,
    generics.GenericAPIView,
):
    queryset = models.Resource.objects.all()
    serializer_class = serializers.ResourceSerializer


class ResourceTimelineView(generics.ListCreateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.TimelineSerializer

    def get_queryset(self):
        user = self.request.user
        # return models.Timeline.objects.filter(resource__owner=user)
        return models.Timeline.objects.all()
