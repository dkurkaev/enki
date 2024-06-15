import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState, useReactFlow, ReactFlowProvider,
} from 'reactflow'

// import {nodes as initialNodes, edges as initialEdges} from "./FetchElements";

import useFetchElements from "./FetchElements";

// import AnnotationNode from './AnnotationNode';
// import ToolbarNode from './ToolbarNode';
// import ResizerNode from './ResizerNode';
// import CircleNode from './CircleNode';
// import TextNode from './TextNode';
// import ButtonEdge from './ButtonEdge';
import CustomNode from "./CustomNode";
import addNodeButton from "./AddNodeButton";

import 'reactflow/dist/style.css';
import '../css/index.css'
import '../css/Overview.css';
import fetchElements from "./FetchElements";
import Sidebar from "./Sidebar";
import AddNodeButton from "./AddNodeButton";
import SaveChangesButton from "./SaveChangesButton";


const nodeTypes = {
    // annotation: AnnotationNode,
    // tools: ToolbarNode,
    // resizer: ResizerNode,
    // circle: CircleNode,
    // textinput: TextNode,
    custom: CustomNode
};

// const edgeTypes = {
//     button: ButtonEdge,
// };

const nodeClassName = (node) => node.type;

const Flow = () => {
    const { nodes: initialNodes, edges: initialEdges, loading } = useFetchElements();

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    console.log("Нафетчили:")
    console.log(nodes)

    const { setViewport } = useReactFlow();

    useEffect(() => {
        if (!loading) {
            setNodes(initialNodes);
            setEdges(initialEdges);
            setViewport({ x: 0, y: 0, zoom: 1 }); // Reset viewport to default on load
        }
    }, [loading, initialNodes, initialEdges, setNodes, setEdges, setViewport]);


    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    return (
        <div className="providerflow">
            <ReactFlowProvider>
                <div className="header">
                    <button>New Diagram</button>
                    <SaveChangesButton/>
                    <AddNodeButton />
                </div>
                <div className="reactflow-wrapper">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        attributionPosition="top-right"
                        nodeTypes={nodeTypes}
                        // edgeTypes={edgeTypes}
                        className="overview"
                    >
                        <MiniMap zoomable pannable nodeClassName={nodeClassName} />
                        <Controls />
                        <Background />
                    </ReactFlow>
                </div>
                <Sidebar nodes={nodes} setNodes={setNodes} />
            </ReactFlowProvider>
        </div>

    );
};

export default Flow;