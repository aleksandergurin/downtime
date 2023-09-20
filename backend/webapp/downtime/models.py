from django.db import models
from django.contrib.auth.models import User


class PollingInterval(models.IntegerChoices):
    ONE = 1
    FIVE = 5
    TEN = 10


class ResourceScheme(models.TextChoices):
    HTTP = 'http'
    HTTPS = 'https'


class Resource(models.Model):
    id = models.AutoField(primary_key=True)
    url = models.TextField()
    scheme = models.TextField(choices=ResourceScheme.choices)
    polling_interval = models.IntegerField(choices=PollingInterval.choices)
    created = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)


class Timeline(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
