import React, { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Drawer, Button, Input, Select, Form, Row, Col } from 'antd';
import { useReactFlow, useOnSelectionChange } from 'reactflow';
import 'reactflow/dist/style.css';
import '../css/index.css';

const { Option } = Select;

const NodeEdit = forwardRef((props, ref) => {
    const { getNodes, setNodes } = useReactFlow();
    const [visible, setVisible] = useState(false);
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
                setVisible(false);
            }
        },
    });

    useImperativeHandle(ref, () => ({
        showDrawer: (node) => {
            setSelectedNode(node);
            setNodeLabel(node.data.label);
            setNodeStatus(node.data.status);
            setNodeFunctions(node.data.functions || []);
            setVisible(true);
        },
    }));

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

    const handleStatusChange = (value) => {
        setNodeStatus(value);
    };

    const handleFunctionNameChange = (index, evt) => {
        const value = evt.target.value;
        const newFunctions = [...nodeFunctions];
        newFunctions[index] = { ...newFunctions[index], name: value };
        setNodeFunctions(newFunctions);
    };

    const handleFunctionStatusChange = (index, value) => {
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
        <Drawer
            title="Node Edit"
            placement="right"
            onClose={() => setVisible(false)}
            open={visible}
            width={500}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Name">
                            <Input value={nodeLabel} onChange={handleLabelChange} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Status">
                            <Select value={nodeStatus} onChange={handleStatusChange}>
                                <Option value="new">New</Option>
                                <Option value="modify">Modify</Option>
                                <Option value="delete">Delete</Option>
                                <Option value="use">Use</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {nodeFunctions.map((func, index) => (
                    <Row key={index} gutter={16} align="middle" style={{ marginBottom: 10 }}>
                        <Col span={8}>
                            <Form.Item label="Status">
                                <Select
                                    value={func.status}
                                    onChange={(value) => handleFunctionStatusChange(index, value)}
                                >
                                    <Option value="new">New</Option>
                                    <Option value="modify">Modify</Option>
                                    <Option value="delete">Delete</Option>
                                    <Option value="use">Use</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Name">
                                <Input
                                    value={func.name}
                                    onChange={(evt) => handleFunctionNameChange(index, evt)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button onClick={() => handleDeleteFunction(index)} danger>
                                X
                            </Button>
                        </Col>
                    </Row>
                ))}
                <Button type="dashed" onClick={handleAddFunction} style={{ width: '100%' }}>
                    Add Function
                </Button>
            </Form>
        </Drawer>
    );
});

export default NodeEdit;