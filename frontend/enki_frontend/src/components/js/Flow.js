import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider, Position,
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
        }
    }, [loading, initialNodes, initialEdges, setNodes, setEdges, setViewport]);

    const onConnect = useCallback(
        (params) => {
            const newEdge = { ...params, type: 'custom', data: { status: 'new', integrations: [] } };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
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
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleChangeStatus = (nodeId, status) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, status } };
                }
                return node;
            })
        );
        setContextMenu({ visible: false, position: { x: 0, y: 0 }, nodeId: null });
    };

    const handleEdgeDoubleClick = (event, edge) => {
        event.preventDefault();
        setSelectedEdge(edge);
        setIsModalOpen(true);
    };

    const handleNodeClick = (event, node) => {
        setSelectedNode(node);
    };

    return (
        <div className="reactflow-wrapper" style={{ flex: 1 }}>
            {/*<div className="header">*/}
            {/*    <div className="header-left">*/}
            {/*        <SaveChangesButton />*/}
            {/*        <AddNodeButton />*/}
            {/*    </div>*/}
            {/*    <div className="header-right">*/}
            {/*        <button onClick={toggleSidebar} className="toggle-sidebar-btn">*/}
            {/*            {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div style={{ flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeContextMenu={onNodeContextMenu}
                    onEdgeDoubleClick={handleEdgeDoubleClick}  // Add this line
                    onNodeClick={handleNodeClick}  // Add this line


                    fitView
                    attributionPosition="top-right"
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    className="overview"
                    zoomOnDoubleClick={false} // Disable zoom on double click
                    connectionMode="loose"
                >
                    {/*<MiniMap position={Position.Bottom}/>*/}
                    <Controls />
                    <Background />
                </ReactFlow>
                {/*<Sidebar nodes={nodes} setNodes={setNodes} hidden={!sidebarVisible} />*/}
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