from ninja import Router
from .models import Node, Edge
from enki.api.v1.schemas import NodeSchema, EdgeSchema
from django.shortcuts import get_object_or_404

router = Router()


@router.get("/nodes", response=list[NodeSchema])
def list_nodes(request):
    return list(Node.objects.all())


@router.post("/nodes", response=NodeSchema)
def create_node(request, payload: NodeSchema):
    node = Node.objects.create(**payload.dict())
    return node


@router.put("/nodes/{node_id}", response=NodeSchema)
def update_node(request, node_id: str, payload: NodeSchema):
    node = get_object_or_404(Node, id=node_id)
    for attr, value in payload.dict().items():
        setattr(node, attr, value)
    node.save()
    return node


@router.delete("/nodes/{node_id}", response=dict)
def delete_node(request, node_id: str):
    node = get_object_or_404(Node, id=node_id)
    node.delete()
    return {"success": True}


@router.get("/edges", response=list[EdgeSchema])
def list_edges(request):
    return list(Edge.objects.all())


@router.post("/edges", response=EdgeSchema)
def create_edge(request, payload: EdgeSchema):
    edge = Edge.objects.create(**payload.dict())
    return edge


@router.put("/edges/{edge_id}", response=EdgeSchema)
def update_edge(request, edge_id: str, payload: EdgeSchema):
    edge = get_object_or_404(Edge, id=edge_id)
    for attr, value in payload.dict().items():
        setattr(edge, attr, value)
    edge.save()
    return edge


@router.delete("/edges/{edge_id}", response=dict)
def delete_edge(request, edge_id: str):
    edge = get_object_or_404(Edge, id=edge_id)
    edge.delete()
    return {"success": True}
