from ninja import Schema


class NodeSchema(Schema):
    id: str
    type: str
    data: dict
    position: dict


class EdgeSchema(Schema):
    id: str
    source: str
    target: str
    animated: bool
