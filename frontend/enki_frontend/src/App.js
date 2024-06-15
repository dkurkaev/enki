// App.js
import React, { useState } from 'react'; // Import useState hook
import ReactFlow, {MiniMap, Background, BackgroundVariant, Controls, ReactFlowProvider} from 'reactflow';
import Header from './components/js/Header';
import LeftPanel from './components/js/LeftPanel';
import RightPanel from './components/js/RightPanel';
import flow from "./components/js/Flow";
import './App.css';
import DiagramArea from "./components/js/DiagramArea";


const App = () => {
    // Define state variables for nodes, edges, and changes
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    // const [changes, setChanges] = useState({ nodes: [], edges: [] });
    // const [pendingNodeChanges, setPendingNodeChanges] = useState([]);  // Initialize as empty array
    // const [pendingEdgeChanges, setPendingEdgeChanges] = useState([]);  // Initialize as empty array
    // const [finalNodeChanges, setFinalNodeChanges] = useState([]);
    // const [finalEdgeChanges, setFinalEdgeChanges] = useState([]);
    const [addedNodes, setAddedNodes] = useState([]);
    const [updatedNodes, setUpdatedNodes] = useState([]);
    const [deletedNodes, setDeletedNodes] = useState([]);
    const [addedEdges, setAddedEdges] = useState([]);
    const [updatedEdges, setUpdatedEdges] = useState([]);
    const [deletedEdges, setDeletedEdges] = useState([]);

    const handleNodeResize = (id, newWidth, newHeight) => {
        setNodes((nodes) => nodes.map((node) => node.id === id ? { ...node, width: newWidth, height: newHeight } : node));
        setUpdatedNodes((prev) => [...prev, { id, width: newWidth, height: newHeight }]);
    };


    return (
        <ReactFlowProvider>
                <div className="app">
                    <Header
                        addedNodes={addedNodes}
                        setAddedNodes={setAddedNodes}
                        updatedNodes={updatedNodes}
                        setUpdatedNodes={setUpdatedNodes}
                        deletedNodes={deletedNodes}
                        setDeletedNodes={setDeletedNodes}
                        addedEdges={addedEdges}
                        setAddedEdges={setAddedEdges}
                        updatedEdges={updatedEdges}
                        setUpdatedEdges={setUpdatedEdges}
                        deletedEdges={deletedEdges}
                        setDeletedEdges={setDeletedEdges}
                    />
                    <div className="main-content">
                        <DiagramArea
                            addedNodes={addedNodes}
                            setAddedNodes={setAddedNodes}
                            updatedNodes={updatedNodes}
                            setUpdatedNodes={setUpdatedNodes}
                            deletedNodes={deletedNodes}
                            setDeletedNodes={setDeletedNodes}
                            addedEdges={addedEdges}
                            setAddedEdges={setAddedEdges}
                            updatedEdges={updatedEdges}
                            setUpdatedEdges={setUpdatedEdges}
                            deletedEdges={deletedEdges}
                            setDeletedEdges={setDeletedEdges}
                        />
                    </div>
                </div>
        </ReactFlowProvider>
    );
};

export default App;