from django.db import models

class Node(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    type = models.CharField(max_length=100, default="default")
    data = models.JSONField()
    position = models.JSONField()
    height = models.IntegerField(default=150)
    width = models.IntegerField(default=150)


    def __str__(self):
        return self.id

class Edge(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    source = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    sourceHandle = models.CharField(max_length=100, null=True, blank=True)
    targetHandle = models.CharField(max_length=100, null=True, blank=True)
    animated = models.BooleanField(default=False)

    def __str__(self):
        return self.id