// App.js
import React, { useState } from 'react'; // Import useState hook
import ReactFlow, { MiniMap, Background, BackgroundVariant, Controls } from 'reactflow';
import Header from './components/js/Header';
import LeftPanel from './components/js/LeftPanel';
import DiagramArea, { DiagramContext } from './components/js/DiagramArea'; // Import DiagramContext and DiagramArea
import RightPanel from './components/js/RightPanel';
import './App.css';

const App = () => {
    // Define state variables for nodes, edges, and changes
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [changes, setChanges] = useState({ nodes: [], edges: [] });
    const [pendingNodeChanges, setPendingNodeChanges] = useState([]);  // Initialize as empty array
    const [pendingEdgeChanges, setPendingEdgeChanges] = useState([]);  // Initialize as empty array
    const [finalNodeChanges, setFinalNodeChanges] = useState([]);
    const [finalEdgeChanges, setFinalEdgeChanges] = useState([]);


    return (
        <DiagramContext.Provider value={{ nodes, setNodes, edges, setEdges, changes, setChanges, finalNodeChanges, setFinalNodeChanges, finalEdgeChanges, setFinalEdgeChanges }}>
            <div className="app">
                <Header />
                <div className="main-content">
                    {/*<LeftPanel />*/}
                    <DiagramArea /> {/* DiagramArea wraps its children */}
                    {/*<RightPanel />*/}
                </div>
            </div>
        </DiagramContext.Provider>
    );
};

export default App;