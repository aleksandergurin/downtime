from datetime import datetime

from rest_framework import serializers

from . import models


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Resource
        fields = ('id', 'url', 'scheme', 'polling_interval', 'created')


class TimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Timeline
        fields = ('id', 'timestamp')

    timestamp = serializers.SerializerMethodField('format_timestamp')

    def format_timestamp(self, record):
        now = datetime.now()

        if record.created.year == now.year:
            if record.created.day == now.day:
                # For same day we show only time e.g. 16:12:23
                return record.created.strftime("%H:%M:%S")

            if record.created.isocalendar().week == now.isocalendar().week:
                # For same week we show day and time e.g. Mon, 16:12:23
                return record.created.strftime("%a, %H:%M:%S")

            # For same year we show month, day and time e.g. Sep 18, 16:12:23
            return record.created.strftime("%b %d, %H:%M:%S")

        # For records older than current year we show everything
        # e.g. 2023-09-18 16:12:23
        return record.created.strftime("%Y-%m-%d %H:%M:%S")
