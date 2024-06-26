from ninja import Router
from ...models import Node, Edge
from .schemas import NodeSchema, EdgeSchema
from ...extractor import create_xml
from django.shortcuts import get_object_or_404
from django.http import FileResponse
import tempfile


from typing import List

router = Router()


@router.get("/nodes/", response=list[NodeSchema])
def list_nodes(request):
    return list(Node.objects.all())


@router.post("/nodes/", response=NodeSchema)
def create_node(request, payload: NodeSchema):
    node = Node.objects.create(**payload.dict())
    return node


@router.put("/nodes/{node_id}/", response=NodeSchema)
def update_node(request, node_id: str, payload: NodeSchema):
    node = get_object_or_404(Node, id=node_id)
    for attr, value in payload.dict().items():
        setattr(node, attr, value)
    node.save()
    return node


@router.delete("/nodes/{node_id}/", response=dict)
def delete_node(request, node_id: str):
    node = get_object_or_404(Node, id=node_id)
    node.delete()
    return {"success": True}


@router.post("/edges", response=EdgeSchema)
def create_edge(request, payload: EdgeSchema):
    edge = Edge.objects.create(**payload.dict())
    return edge

@router.put("/edges/{edge_id}", response=EdgeSchema)
def update_edge(request, edge_id: str, payload: EdgeSchema):
    edge = Edge.objects.get(id=edge_id)
    for attr, value in payload.dict().items():
        setattr(edge, attr, value)
    edge.save()
    return edge

@router.get("/edges", response=List[EdgeSchema])
def list_edges(request):
    edges = Edge.objects.all()
    return edges

@router.get("/edges/{edge_id}", response=EdgeSchema)
def get_edge(request, edge_id: str):
    edge = Edge.objects.get(id=edge_id)
    return edge

@router.delete("/edges/{edge_id}", response={204: None})
def delete_edge(request, edge_id: str):
    edge = Edge.objects.get(id=edge_id)
    edge.delete()
    return 204

@router.get("/export/xml")
def export_to_xml(request):
    nodes = Node.objects.all()
    edges = Edge.objects.all()
    xml_content = create_xml(nodes, edges)

    with tempfile.NamedTemporaryFile(delete=False, suffix='.xml') as temp_file:
        temp_file.write(xml_content.encode('utf-8'))
        temp_file_path = temp_file.name

    return FileResponse(open(temp_file_path, 'rb'), as_attachment=True, filename='diagram.xml')