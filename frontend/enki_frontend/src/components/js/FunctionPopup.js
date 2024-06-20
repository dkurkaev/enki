import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { Modal, Select, Input, Button } from 'antd';
import '../css/FunctionPopup.css';

const { Option } = Select;

const FunctionPopup = ({ functionData, nodeId, onClose }) => {
    const { getNode, setNodes } = useReactFlow();
    const [status, setStatus] = useState(functionData.status);
    const [name, setName] = useState(functionData.name);

    const handleStatusChange = (value) => {
        setStatus(value);
        updateNodeState(value, name);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        updateNodeState(status, e.target.value);
    };

    const updateNodeState = (newStatus, newName) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === nodeId) {
                    const updatedFunctions = node.data.functions.map((func) =>
                        func.id === functionData.id ? { ...func, status: newStatus, name: newName } : func
                    );
                    const updatedNode = {
                        ...node,
                        data: {
                            ...node.data,
                            functions: updatedFunctions,
                        },
                    };
                    return updatedNode;
                }
                return node;
            })
        );
    };

    return (
        <Modal
            title="Edit Function"
            open={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Ok
                </Button>,
            ]}
        >
            <div className="popup-content">
                <label>
                    Status:
                    <Select value={status} onChange={handleStatusChange} style={{ width: '100%' }}>
                        <Option value="new">New</Option>
                        <Option value="modify">Modify</Option>
                        <Option value="delete">Delete</Option>
                        <Option value="use">Use</Option>
                    </Select>
                </label>
                <label>
                    Name:
                    <Input type="text" value={name} onChange={handleNameChange} />
                </label>
            </div>
        </Modal>
    );
};

export default FunctionPopup;