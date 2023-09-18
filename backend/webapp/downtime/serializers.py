from rest_framework import serializers

from . import models


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Resource
        fields = ('id', 'url', 'scheme', 'polling_interval', 'created')


class TimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Timeline
        fields = ('id', 'created', 'resource')
