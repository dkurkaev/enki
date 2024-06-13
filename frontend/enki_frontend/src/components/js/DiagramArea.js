import React, { useEffect, useState, useContext, createContext, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from 'reactflow';

import 'reactflow/dist/style.css';

import ContextMenu from './ContextMenu';
import { fetchNodes, fetchEdges } from '../../api';
import '../css/DiagramArea.css';
import CustomNode from "./CustomNode";


export const DiagramContext = createContext();

const nodeTypes = {
    custom: CustomNode,
};

const DiagramArea = () => {
    const { nodes, setNodes, edges, setEdges, setFinalNodeChanges, setFinalEdgeChanges } = useContext(DiagramContext);
    const [editingNode, setEditingNode] = useState(null);
    const [nodeLabel, setNodeLabel] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 } });
    const diagramRef = useRef(null);

    useEffect(() => {
        const fetchElements = async () => {
            try {
                const fetchedNodes = await fetchNodes();
                const fetchedEdges = await fetchEdges();

                setNodes(fetchedNodes);
                setEdges(fetchedEdges);

            } catch (error) {
                console.error('Error fetching elements:', error);
            }
        };
        fetchElements();
    }, [setNodes, setEdges]);

    const onNodesChange = (nodeChanges) => {
        const updatedNodes = applyNodeChanges(nodeChanges, nodes);
        setNodes(updatedNodes);

        nodeChanges.forEach(change => {
            switch (change.type) {
                case 'remove':
                    setFinalNodeChanges((prev) => [...prev, { id: change.id, type: 'remove' }]);
                    break;
                case 'update':
                case 'position':
                    const nodeToUpdate = updatedNodes.find(n => n.id === change.id) || change.item;
                    setFinalNodeChanges(prev => {
                        const updated = prev.filter(n => n.id !== nodeToUpdate.id);
                        return [...updated, nodeToUpdate];
                    });
                    break;
                case 'add':
                    setFinalNodeChanges(prev => [...prev, change.item]);
                    break;
                default:
                    break;
            }
        });
    };

    const onEdgesChange = (edgeChanges) => {
        const updatedEdges = applyEdgeChanges(edgeChanges, edges);
        setEdges(updatedEdges);

        edgeChanges.forEach(change => {
            switch (change.type) {
                case 'remove':
                    setFinalEdgeChanges((prev) => [...prev, { id: change.id, type: 'remove' }]);
                    break;
                case 'add':
                    setFinalEdgeChanges(prev => [...prev, change.item]);
                    break;
                default:
                    break;
            }
        });
    };


    // In the onConnect function in DiagramArea.js
    const onConnect = (params) => {
        const edgeId = `e${params.source}-${params.target}`;
        const newEdge = {
            id: edgeId,
            source: params.source,
            target: params.target,
            //type: 'smoothstep',
            markerEnd: { type: 'arrowclosed' },
            animated: false, // Ensure animated field is included
            isNew: true  // Mark this edge as new
        };
        setEdges((eds) => addEdge(params, eds));
        setFinalEdgeChanges((prev) => [...prev, newEdge]);
    };

    const onNodeDoubleClick = (event, node) => {
        setEditingNode(node);
        setNodeLabel(node.data.label);
    };

    const handleLabelChange = (event) => {
        setNodeLabel(event.target.value);
    };

    const handleLabelSave = () => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === editingNode.id) {
                    node.data = { ...node.data, label: nodeLabel };
                }
                return node;
            })
        );
        setEditingNode(null);
    };

    const onContextMenu = (event) => {
        event.preventDefault();
        const position = { x: event.clientX, y: event.clientY };
        setContextMenu({ visible: true, position });
    };

    const handleClickOutside = (event) => {
        if (diagramRef.current && !diagramRef.current.contains(event.target)) {
            setContextMenu({ visible: false, position: { x: 0, y: 0 } });
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);




    return (
        <div className="diagram-container" onContextMenu={onContextMenu} ref={diagramRef}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeDoubleClick={onNodeDoubleClick}
                style={{ width: '100%', height: '100%' }}
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
        );


};

export default DiagramArea;