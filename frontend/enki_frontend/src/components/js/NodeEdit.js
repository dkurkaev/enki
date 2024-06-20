import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Drawer, Button, Input, Select } from 'antd';

const { Option } = Select;

const NodeEdit = forwardRef(({ nodes, setNodes }, ref) => {
    const [visible, setVisible] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [functions, setFunctions] = useState([]);

    const showDrawer = (node) => {
        setSelectedNode(node);
        setFunctions(node.data.functions || []);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    useImperativeHandle(ref, () => ({
        showDrawer,
    }));

    const handleStatusChange = (funcId, status) => {
        const updatedFunctions = functions.map((func) =>
            func.id === funcId ? { ...func, status } : func
        );
        setFunctions(updatedFunctions);
        updateNodeFunctions(updatedFunctions);
    };

    const handleNameChange = (funcId, name) => {
        const updatedFunctions = functions.map((func) =>
            func.id === funcId ? { ...func, name } : func
        );
        setFunctions(updatedFunctions);
        updateNodeFunctions(updatedFunctions);
    };

    const handleDeleteFunction = (funcId) => {
        const updatedFunctions = functions.filter((func) => func.id !== funcId);
        setFunctions(updatedFunctions);
        updateNodeFunctions(updatedFunctions);
    };

    const handleAddFunction = () => {
        const newFunction = {
            id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`,
            status: 'new',
            name: 'New Function'
        };
        const updatedFunctions = [...functions, newFunction];
        setFunctions(updatedFunctions);
        updateNodeFunctions(updatedFunctions);
    };

    const updateNodeFunctions = (updatedFunctions) => {
        if (typeof setNodes === 'function') {
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === selectedNode.id) {
                        return { ...node, data: { ...node.data, functions: updatedFunctions } };
                    }
                    return node;
                })
            );
        }
    };

    return (
        <Drawer
            title="Node Edit"
            placement="right"
            onClose={onClose}
            open={visible}
            width={500}
        >
            {functions.map((func) => (
                <div key={func.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ marginRight: 10 }}>{func.id}</span>
                    <Select
                        value={func.status}
                        onChange={(value) => handleStatusChange(func.id, value)}
                        style={{ width: 120, marginRight: 10 }}
                    >
                        <Option value="new">New</Option>
                        <Option value="modify">Modify</Option>
                        <Option value="delete">Delete</Option>
                        <Option value="use">Use</Option>
                    </Select>
                    <Input
                        value={func.name}
                        onChange={(e) => handleNameChange(func.id, e.target.value)}
                        style={{ marginRight: 10 }}
                    />
                    <Button onClick={() => handleDeleteFunction(func.id)}>X</Button>
                </div>
            ))}
            <Button type="dashed" onClick={handleAddFunction} style={{ width: '100%' }}>
                Add Function
            </Button>
        </Drawer>
    );
});

export default NodeEdit;