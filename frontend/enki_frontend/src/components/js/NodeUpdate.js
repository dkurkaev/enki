import React, { useEffect, useState } from 'react';
import { useNodesState, useReactFlow, useOnSelectionChange } from 'reactflow';
import 'reactflow/dist/style.css';
import '../css/index.css'; // Ensure this is included to use the styles

const NodeUpdate = () => {
    const { getNodes, setNodes } = useReactFlow();
    const [selectedNode, setSelectedNode] = useState(null);
    const [nodeLabel, setNodeLabel] = useState('');
    const [nodeStatus, setNodeStatus] = useState('');
    const [nodeFunctions, setNodeFunctions] = useState([]);

    useOnSelectionChange({
        onChange: ({ nodes: selectedNodes }) => {
            if (selectedNodes.length > 0) {
                const node = selectedNodes[0];
                setSelectedNode(node);
                setNodeLabel(node.data.label);
                setNodeStatus(node.data.status);
                setNodeFunctions(node.data.functions || []);
            } else {
                setSelectedNode(null);
                setNodeLabel('');
                setNodeStatus('');
                setNodeFunctions([]);
            }
        },
    });

    useEffect(() => {
        if (selectedNode) {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === selectedNode.id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                label: nodeLabel,
                                status: nodeStatus,
                                functions: nodeFunctions,
                            },
                        };
                    }
                    return node;
                })
            );
        }
    }, [nodeLabel, nodeStatus, nodeFunctions, selectedNode, setNodes]);

    const handleLabelChange = (evt) => {
        setNodeLabel(evt.target.value);
    };

    const handleStatusChange = (evt) => {
        setNodeStatus(evt.target.value);
    };

    const handleFunctionNameChange = (index, evt) => {
        const value = evt.target.value;
        const newFunctions = [...nodeFunctions];
        newFunctions[index] = { ...newFunctions[index], name: value };
        setNodeFunctions(newFunctions);
    };

    const handleFunctionStatusChange = (index, evt) => {
        const value = evt.target.value;
        const newFunctions = [...nodeFunctions];
        newFunctions[index] = { ...newFunctions[index], status: value };
        setNodeFunctions(newFunctions);
    };

    const handleDeleteFunction = (index) => {
        const newFunctions = nodeFunctions.filter((_, i) => i !== index);
        setNodeFunctions(newFunctions);
    };

    const handleAddFunction = () => {
        const newFunction = {
            id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`,
            name: 'New Function',
            status: 'new',
        };
        setNodeFunctions([...nodeFunctions, newFunction]);
    };

    return (
        <div className="node-update">
            {selectedNode ? (
                <>
                    <label>Label:</label>
                    <input value={nodeLabel} onChange={handleLabelChange} />

                    <label>Status:</label>
                    <select value={nodeStatus} onChange={handleStatusChange}>
                        <option value="new">New</option>
                        <option value="modify">Modify</option>
                        <option value="delete">Delete</option>
                        <option value="use">Use</option>
                    </select>

                    <label>Functions:</label>
                    {nodeFunctions.map((func, index) => (
                        <div key={index} className="function-group">
                            <select
                                className="function-status"
                                value={func.status}
                                onChange={(evt) => handleFunctionStatusChange(index, evt)}
                            >
                                <option value="new">New</option>
                                <option value="modify">Modify</option>
                                <option value="delete">Delete</option>
                                <option value="use">Use</option>
                            </select>
                            <input
                                className="function-name"
                                value={func.name}
                                onChange={(evt) => handleFunctionNameChange(index, evt)}
                            />
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteFunction(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        className="add-function-button"
                        onClick={handleAddFunction}
                    >
                        Add Function
                    </button>
                </>
            ) : (
                <p>No node selected</p>
            )}
        </div>
    );
};

export default NodeUpdate;