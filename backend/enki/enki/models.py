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
    id = models.CharField(primary_key=True, max_length=100)
    #source = models.ForeignKey(Node, related_name='source_edges', on_delete=models.CASCADE)
    #target = models.ForeignKey(Node, related_name='target_edges', on_delete=models.CASCADE)
    source = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    animated = models.BooleanField(default=False)

    #class Meta:
        #unique_together = ('source', 'target')

    def __str__(self):
        return self.id