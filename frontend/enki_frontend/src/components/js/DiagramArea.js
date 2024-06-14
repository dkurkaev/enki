import React, {useEffect, useState, useContext, createContext, useRef, useCallback} from 'react';
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

import { fetchNodes, fetchEdges } from '../../api';
import '../css/DiagramArea.css';
import '../css/NodeContextMenu.css'
import NodeContextMenu from './NodeContextMenu';

import CustomNode from "./CustomNode";


export const DiagramContext = createContext();

const nodeTypes = {
    custom: CustomNode,
};

const DiagramArea = () => {
    const { nodes, setNodes, edges, setEdges, setFinalNodeChanges, setFinalEdgeChanges } = useContext(DiagramContext);
    const [editingNode, setEditingNode] = useState(null);
    const [nodeLabel, setNodeLabel] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, nodeId: null });
    const diagramRef = useRef(null);
    const contextMenuRef = useRef(null);


    useEffect(() => {
        const fetchElements = async () => {
            const [fetchedNodes, fetchedEdges] = await Promise.all([fetchNodes(), fetchEdges()]);

            const nodesWithSize = fetchedNodes.map(node => ({
                ...node,
                data: {
                    ...node.data,
                    width: node.width || 150, // default width if not available
                    height: node.height || 150, // default height if not available
                }
            }));

            setNodes(nodesWithSize);
            setEdges(fetchedEdges);

            console.log("Loggg:")
            console.log(fetchedNodes)
        };

        fetchElements();


    }, [setNodes, setEdges]);


    const onNodesChange = (changes) => {
        setNodes((nds) => {
            const updatedNodes = applyNodeChanges(changes, nds);
            changes.forEach(change => {
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
                    case 'resize': // Handling resize
                        const resizedNode = updatedNodes.find(n => n.id === change.id);
                        if (resizedNode) {
                            setFinalNodeChanges(prev => {
                                const updated = prev.filter(n => n.id !== resizedNode.id);
                                return [...updated, resizedNode];
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
            return updatedNodes;
        });
    };

    // const onEdgesChange = (edgeChanges) => {
    //     const updatedEdges = applyEdgeChanges(edgeChanges, edges);
    //     setEdges(updatedEdges);
    //
    //     edgeChanges.forEach(change => {
    //         switch (change.type) {
    //             case 'remove':
    //                 setFinalEdgeChanges((prev) => [...prev, { id: change.id, type: 'remove' }]);
    //                 break;
    //             case 'add':
    //                 setFinalEdgeChanges(prev => [...prev, change.item]);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     });
    // };

    const onEdgesChange = (changes) => {
        setEdges((eds) => {
            const updatedEdges = applyEdgeChanges(changes, eds);
            changes.forEach(change => {
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
            return updatedEdges;
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
        [setContextMenu]
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

    const handleChangeStatus = (nodeId, status) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === nodeId) {
                    const updatedNode = { ...node, data: { ...node.data, status } };
                    setFinalNodeChanges((prev) => {
                        const nodeIndex = prev.findIndex((n) => n.id === nodeId);
                        if (nodeIndex > -1) {
                            prev[nodeIndex] = updatedNode;
                        } else {
                            prev.push({ ...updatedNode, isUpdated: true });
                        }
                        return [...prev];
                    });
                    return updatedNode;
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeContextMenu={onNodeContextMenu}
                nodeTypes={nodeTypes}
                onNodeDoubleClick={onNodeDoubleClick}
                //style={{ width: '100%', height: '100%' }}
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
                        ref={contextMenuRef} // Pass the ref to NodeContextMenu
                    />
                )}
            </ReactFlow>
        </div>
        );


};

export default DiagramArea;