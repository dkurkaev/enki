from typing import Optional

from ninja import Schema


class NodeSchema(Schema):
    id: str
    type: str
    position: dict
    data: dict

    height: int
    width: int


class EdgeSchema(Schema):
    id: str
    source: str
    type: str
    data: Optional[dict]
    target: str
    sourceHandle: str
    targetHandle: str
    animated: bool
