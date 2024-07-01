import xml.etree.ElementTree as ET
from .models import Node, Edge

def get_color(status):
    colors = {
        'new': '#009900',   # green
        'modify': '#007FFF',  # blue
        'delete': '#FF0000',  # red
        'use': '#000000'     # black
    }
    return colors.get(status, '#000000')

def get_stroke_width(status):
    return '1' if status == 'use' else '2'

def get_handle_coordinates(handle):
    handle_mapping = {
        'top-1': (0.25, 0),
        'top-2': (0.5, 0),
        'top-3': (0.75, 0),
        'bottom-1': (0.25, 1),
        'bottom-2': (0.5, 1),
        'bottom-3': (0.75, 1),
        'left-1': (0, 0.25),
        'left-2': (0, 0.5),
        'left-3': (0, 0.75),
        'right-1': (1, 0.25),
        'right-2': (1, 0.5),
        'right-3': (1, 0.75),
    }
    return handle_mapping.get(handle, (0.5, 0.5))

def create_edge_value(integrations):
    return "<br>".join([f"{integration['code']}: {integration['name']}" for integration in integrations])

def create_xml(nodes, edges):
    mxfile = ET.Element('mxfile', {
        'host': 'Electron',
        'modified': '2024-07-01T17:00:55.193Z',
        'agent': 'your-agent-string',
        'etag': 'your-etag-string',
        'version': '20.8.16',
        'type': 'device'
    })

    diagram = ET.SubElement(mxfile, 'diagram', {'id': 'jGSXmbqYQtW5LkMTx_gE', 'name': 'Page-2'})
    mxGraphModel = ET.SubElement(diagram, 'mxGraphModel', {
        'dx': '2722', 'dy': '927', 'grid': '1', 'gridSize': '10', 'guides': '1',
        'tooltips': '1', 'connect': '1', 'arrows': '1', 'fold': '1', 'page': '1',
        'pageScale': '1', 'pageWidth': '850', 'pageHeight': '1100', 'math': '0', 'shadow': '0'
    })

    root = ET.SubElement(mxGraphModel, 'root')

    ET.SubElement(root, 'mxCell', {'id': '0'})
    ET.SubElement(root, 'mxCell', {'id': '1', 'parent': '0'})

    for node in nodes:
        status = node.data.get('status')
        color = get_color(status)
        stroke_width = get_stroke_width(status)
        node_cell = ET.SubElement(root, 'mxCell', {
            'id': str(node.id),
            'value': node.data.get('label'),
            'style': f'swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;whiteSpace=wrap;html=1;swimlaneFillColor=default;strokeColor={color};strokeWidth={stroke_width};',
            'parent': '1',
            'vertex': '1'
        })
        ET.SubElement(node_cell, 'mxGeometry', {
            'x': str(node.position.get('x')),
            'y': str(node.position.get('y')),
            'width': str(node.data.get('width')),
            'height': str(node.data.get('height')),
            'as': 'geometry'
        })

        for func in node.data.get('functions', []):
            func_color = get_color(func.get('status'))
            func_cell = ET.SubElement(root, 'mxCell', {
                'id': str(func.get('id')),
                'value': func.get('name'),
                'style': f'text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fontColor={func_color};',
                'parent': str(node.id),
                'vertex': '1'
            })
            ET.SubElement(func_cell, 'mxGeometry', {
                'y': '30',
                'width': '270',
                'height': '30',
                'as': 'geometry'
            })

    for edge in edges:
        status = edge.data.get('status')
        color = get_color(status)
        stroke_width = get_stroke_width(status)
        entry_x, entry_y = get_handle_coordinates(edge.sourceHandle)
        exit_x, exit_y = get_handle_coordinates(edge.targetHandle)
        edge_value = create_edge_value(edge.data.get('integrations', []))
        edge_cell = ET.SubElement(root, 'mxCell', {
            'id': str(edge.id),
            'value': edge_value,
            'style': f'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX={exit_x};entryY={exit_y};exitX={entry_x};exitY={entry_y};strokeColor={color};strokeWidth={stroke_width};startArrow=none;startFill=1;',
            'parent': '1',
            'source': str(edge.source),
            'target': str(edge.target),
            'edge': '1'
        })
        ET.SubElement(edge_cell, 'mxGeometry', {'relative': '1', 'as': 'geometry'})

    return ET.tostring(mxfile, encoding='utf-8', method='xml').decode('utf-8')