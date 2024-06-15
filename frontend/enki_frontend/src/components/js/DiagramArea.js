import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    useReactFlow,
    addEdge,
    MiniMap,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchNodes, fetchEdges } from '../../api';
import '../css/DiagramArea.css';
import '../css/NodeContextMenu.css';
import NodeContextMenu from './NodeContextMenu';
import CustomNode from './CustomNode';

const nodeTypes = {
    custom: CustomNode,
};

const DiagramArea = ({
                         addedNodes,
                         setAddedNodes,
                         updatedNodes,
                         setUpdatedNodes,
                         deletedNodes,
                         setDeletedNodes,
                         addedEdges,
                         setAddedEdges,
                         updatedEdges,
                         setUpdatedEdges,
                         deletedEdges,
                         setDeletedEdges,
                     }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { setViewport } = useReactFlow();
    const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, nodeId: null });
    const diagramRef = useRef(null);
    const contextMenuRef = useRef(null);

    const handleNodeResize = (id, newWidth, newHeight) => {
        setNodes((nodes) => nodes.map((node) => node.id === id ? { ...node, width: newWidth, height: newHeight } : node));
        setUpdatedNodes((prev) => [...prev, { id, width: newWidth, height: newHeight }]);
    };

    useEffect(() => {
        const fetchElements = async () => {
            const [fetchedNodes, fetchedEdges] = await Promise.all([fetchNodes(), fetchEdges()]);

            const nodesWithSize = fetchedNodes.map(node => ({
                ...node,
                width: node.width || 150,
                height: node.height || 150,
            }));

            setNodes(nodesWithSize);
            setEdges(fetchedEdges);

            console.log("Fetchez sizez:")
            console.log(nodesWithSize)

            setViewport({ x: 0, y: 0, zoom: 1 }); // Reset viewport to default on load
        };

        fetchElements();
    }, [setNodes, setEdges, setViewport]);

    const onConnect = (params) => {
        const newEdge = {
            id: `e${params.source}-${params.target}`,
            source: params.source,
            target: params.target,
            markerEnd: { type: 'arrowclosed' },
            animated: false,
        };
        setEdges((eds) => addEdge(newEdge, eds));
        setAddedEdges((prev) => [...prev, newEdge]);
    };

    const handleEdgesChange = useCallback((changes) => {
        const added = [];
        const updated = [];
        const removed = [];

        changes.forEach(change => {
            switch (change.type) {
                case 'add':
                    added.push(change.item);
                    break;
                case 'update':
                case 'position':
                case 'resize':
                    updated.push(change.item);
                    break;
                case 'remove':
                    removed.push(change.id);
                    break;
                default:
                    break;
            }
        });

        setEdges((eds) => applyEdgeChanges(changes, eds));
        setAddedEdges((prev) => [...prev, ...added]);
        setUpdatedEdges((prev) => [...prev, ...updated]);
        setDeletedEdges((prev) => [...prev, ...removed]);
    }, [setEdges, setAddedEdges, setUpdatedEdges, setDeletedEdges]);

    const handleNodesChange = useCallback((changes) => {
        const added = [];
        const updated = [];
        const removed = [];

        changes.forEach(change => {
            switch (change.type) {
                case 'add':
                    added.push(change.item);
                    break;
                case 'update':
                case 'position':
                case 'resize':
                    updated.push(change.item);
                    break;
                case 'remove':
                    removed.push(change.id);
                    break;
                default:
                    break;
            }
        });

        setNodes((nds) => applyNodeChanges(changes, nds));
        setAddedNodes((prev) => [...prev, ...added]);
        setUpdatedNodes((prev) => [...prev, ...updated]);
        setDeletedNodes((prev) => [...prev, ...removed]);
    }, [setNodes, setAddedNodes, setUpdatedNodes, setDeletedNodes]);

    const onNodeContextMenu = useCallback(
        (event, node) => {
            event.preventDefault();
            const nodeRect = event.target.getBoundingClientRect();
            const paneRect = diagramRef.current.getBoundingClientRect();
            setContextMenu({
                visible: true,
                nodeId: node.id,
                position: {
                    x: nodeRect.left - paneRect.left + window.scrollX,
                    y: nodeRect.top - paneRect.top + window.scrollY,
                }
            });
        },
        []
    );

    const handleClickOutside = (event) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            setContextMenu({ visible: false, position: { x: 0, y: 0 }, nodeId: null });
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleChangeStatus = (nodeId, status) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, status } };
                }
                return node;
            })
        );
        setContextMenu({ visible: false, position: { x: 0, y: 0 }, nodeId: null });
    };

    return (
            <div className="diagram-container" ref={diagramRef}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={handleEdgesChange}
                    onConnect={onConnect}
                    onNodeContextMenu={onNodeContextMenu}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                    {contextMenu.visible && (
                        <NodeContextMenu
                            id={contextMenu.nodeId}
                            top={contextMenu.position.y}
                            left={contextMenu.position.x}
                            onChangeStatus={handleChangeStatus}
                            ref={contextMenuRef}
                        />
                    )}
                </ReactFlow>
            </div>
    );
};

export default DiagramArea;