import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';

import useFetchElements from './FetchElements';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

import AddNodeButton from './AddNodeButton';
import SaveChangesButton from './SaveChangesButton';
import Sidebar from './Sidebar';
import NodeContextMenu from './NodeContextMenu';
import EdgeModal from './EdgeModal';  // Import EdgeModal

import 'reactflow/dist/style.css';
import '../css/index.css';
import '../css/Overview.css';

const nodeTypes = {
    custom: CustomNode,
};
const edgeTypes = {
    custom: CustomEdge,
};

const Flow = ({ setSelectedNode }) => {
    const { nodes: initialNodes, edges: initialEdges, loading } = useFetchElements();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const history = useRef([{ nodes: initialNodes, edges: initialEdges }]);
    const redoHistory = useRef([]);
    const [sidebarVisible, setSidebarVisible] = useState(false); // Hide sidebar by default
    const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, nodeId: null });
    // Add state variables for managing modal visibility and the selected edge
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [selectedNodes, setSelectedNodes] = useState([]);

    const { setViewport } = useReactFlow();
    const contextMenuRef = useRef(null);

    useEffect(() => {
        if (!loading) {
            setNodes(initialNodes);
            setEdges(initialEdges);
            setViewport({ x: 0, y: 0, zoom: 1 }); // Reset viewport to default on load
            history.current = [{ nodes: initialNodes, edges: initialEdges }]; // Initialize history
        }
    }, [loading, initialNodes, initialEdges, setNodes, setEdges, setViewport]);

    const onConnect = useCallback(
        (params) => {
            const newEdge = { ...params, type: 'custom', data: { status: 'new', integrations: [] } };
            setEdges((eds) => {
                const updatedEdges = addEdge(newEdge, eds);
                history.current.push({ nodes, edges: updatedEdges });
                redoHistory.current = [];
                return updatedEdges;
            });
        },
        [setEdges, nodes, edges]
    );

    const toggleSidebar = () => {
        setSidebarVisible((prev) => !prev);
    };

    const onNodeContextMenu = useCallback(
        (event, node) => {
            event.preventDefault();
            const diagramRect = document.querySelector('.reactflow-wrapper').getBoundingClientRect();
            setContextMenu({
                visible: true,
                nodeId: node.id,
                position: {
                    x: event.clientX - diagramRect.left + 5, // Adjusting the X coordinate to position the menu slightly right
                    y: event.clientY - diagramRect.top + 5, // Adjusting the Y coordinate to position the menu slightly below
                },
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
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [nodes, edges, history, redoHistory]);

    const handleChangeStatus = (nodeId, status) => {
        const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
                return { ...node, data: { ...node.data, status } };
            }
            return node;
        });
        setNodes(updatedNodes);
        setContextMenu({ visible: false, position: { x: 0, y: 0 }, nodeId: null });
        history.current.push({ nodes: updatedNodes, edges });
        redoHistory.current = [];
    };

    const handleEdgeDoubleClick = (event, edge) => {
        event.preventDefault();
        setSelectedEdge(edge);
        setIsModalOpen(true);
    };

    const handleNodeClick = (event, node) => {
        setSelectedNode(node);
    };

    const handleUndo = () => {
        if (history.current.length <= 1) return; // Prevent undoing the initial state

        const lastState = history.current[history.current.length - 2];
        redoHistory.current.unshift(history.current.pop());
        setNodes(lastState.nodes);
        setEdges(lastState.edges);
    };

    const handleRedo = () => {
        if (redoHistory.current.length === 0) return;

        const nextState = redoHistory.current.shift();
        history.current.push(nextState);
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
    };

    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            handleUndo();
        } else if (((event.ctrlKey || event.metaKey) && event.key === 'y') || ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z')) {
            event.preventDefault();
            handleRedo();
        }
    };

    const handleNodesChange = (changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    };

    const handleNodesDragStop = (event, node) => {
        setNodes((nds) => {
            const updatedNodes = nds.map((n) => (n.id === node.id ? node : n));
            history.current.push({ nodes: updatedNodes, edges });
            redoHistory.current = [];
            return updatedNodes;
        });
    };

    const handleNodeResizeStop = (event, node) => {
        setNodes((nds) => {
            const updatedNodes = nds.map((n) => (n.id === node.id ? node : n));
            history.current.push({ nodes: updatedNodes, edges });
            redoHistory.current = [];
            return updatedNodes;
        });
    };

    const handleEdgesChange = (changes) => {
        setEdges((eds) => {
            const updatedEdges = applyEdgeChanges(changes, eds);
            history.current.push({ nodes, edges: updatedEdges });
            redoHistory.current = [];
            return updatedEdges;
        });
    };

    return (
        <div className="reactflow-wrapper" style={{ flex: 1 }}>
            <div style={{ flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onNodesDragStop={handleNodesDragStop}
                    onNodeResizeStop={handleNodeResizeStop}
                    onEdgesChange={handleEdgesChange}
                    onConnect={onConnect}
                    onNodeContextMenu={onNodeContextMenu}
                    onEdgeDoubleClick={handleEdgeDoubleClick}
                    onNodeClick={handleNodeClick}
                    fitView
                    attributionPosition="top-right"
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    zoomOnDoubleClick={false} // Disable zoom on double click
                    connectionMode="loose"
                >
                    <Controls />
                    <Background />
                </ReactFlow>
                {contextMenu.visible && (
                    <NodeContextMenu
                        id={contextMenu.nodeId}
                        top={contextMenu.position.y}
                        left={contextMenu.position.x}
                        onChangeStatus={handleChangeStatus}
                        ref={contextMenuRef}
                    />
                )}
                {isModalOpen && (
                    <EdgeModal
                        edge={selectedEdge}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={(updatedEdge) => {
                            setEdges((eds) =>
                                eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e))
                            );
                            setIsModalOpen(false);
                        }}
                        updateEdge={(updatedEdge) => {
                            setEdges((eds) =>
                                eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e))
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );

};

export default Flow;