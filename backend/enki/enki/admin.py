from django.contrib import admin
from .models import Node, Edge


@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ['id', 'type', 'data', 'position']


@admin.register(Edge)
class EdgeAdmin(admin.ModelAdmin):
    list_display = ['id', 'source', 'target', 'animated']
