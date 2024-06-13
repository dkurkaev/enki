import React, { useState, useContext } from 'react';
import { DiagramContext } from './DiagramArea';
import '../css/FunctionPopup.css';

const FunctionPopup = ({ functionData, nodeId, onClose }) => {
    const { setNodes, setFinalNodeChanges } = useContext(DiagramContext);
    const [status, setStatus] = useState(functionData.status);
    const [name, setName] = useState(functionData.name);

    const handleSave = () => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === nodeId) {
                    const updatedFunctions = node.data.functions.map((func) =>
                        func.id === functionData.id ? { ...func, status, name } : func
                    );
                    const updatedNode = {
                        ...node,
                        data: {
                            ...node.data,
                            functions: updatedFunctions,
                        },
                    };
                    // Update finalNodeChanges with the modified node
                    setFinalNodeChanges((prev) => {
                        const updated = prev.filter(n => n.id !== updatedNode.id);
                        return [...updated, updatedNode];
                    });
                    return updatedNode;
                }
                return node;
            })
        );
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <label>
                    Status:
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="new">New</option>
                        <option value="modify">Modify</option>
                        <option value="delete">Delete</option>
                        <option value="use">Use</option>
                    </select>
                </label>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default FunctionPopup;