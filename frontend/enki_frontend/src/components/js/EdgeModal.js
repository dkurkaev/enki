import React, { useState } from 'react';
import { Modal, Select, Button, Input, List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const EdgeModal = ({ edge, isOpen, onClose, onSave, updateEdge }) => {
    const [status, setStatus] = useState(edge.data.status);
    const [integrations, setIntegrations] = useState(edge.data.integrations);

    const handleStatusChange = (value) => {
        setStatus(value);
        const updatedEdge = {
            ...edge,
            data: {
                ...edge.data,
                status: value,
            },
        };
        updateEdge(updatedEdge);
    };

    const handleIntegrationChange = (index, field, value) => {
        const newIntegrations = [...integrations];
        newIntegrations[index][field] = value;
        setIntegrations(newIntegrations);
        const updatedEdge = {
            ...edge,
            data: {
                ...edge.data,
                integrations: newIntegrations,
            },
        };
        updateEdge(updatedEdge);
    };

    const handleAddIntegration = () => {
        const newIntegration = {
            id: `integration-${+new Date()}`,
            code: `code-${Math.floor(Math.random() * 1000000)}`,
            status: 'new',
            name: '',
        };
        const newIntegrations = [...integrations, newIntegration];
        setIntegrations(newIntegrations);
        const updatedEdge = {
            ...edge,
            data: {
                ...edge.data,
                integrations: newIntegrations,
            },
        };
        updateEdge(updatedEdge);
    };

    const handleRemoveIntegration = (index) => {
        const newIntegrations = integrations.filter((_, i) => i !== index);
        setIntegrations(newIntegrations);
        const updatedEdge = {
            ...edge,
            data: {
                ...edge.data,
                integrations: newIntegrations,
            },
        };
        updateEdge(updatedEdge);
    };

    return (
        <Modal
            title="Edit Edge"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div style={{ marginBottom: 16 }}>
                <label>Status:</label>
                <Select
                    value={status}
                    onChange={handleStatusChange}
                    style={{ width: '100%' }}
                >
                    <Option value="new">New</Option>
                    <Option value="modify">Modify</Option>
                    <Option value="delete">Delete</Option>
                    <Option value="use">Use</Option>
                </Select>
            </div>
            <div>
                <List
                    header={<div>Integrations</div>}
                    bordered
                    dataSource={integrations}
                    renderItem={(integration, index) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleRemoveIntegration(index)}
                                />,
                            ]}
                        >
                            <div style={{ display: 'flex', width: '100%' }}>
                                <Input
                                    value={integration.code}
                                    readOnly
                                    style={{ marginRight: 8, flex: 1 }}
                                />
                                <Select
                                    value={integration.status}
                                    onChange={(value) => handleIntegrationChange(index, 'status', value)}
                                    style={{ marginRight: 8, flex: 1 }}
                                >
                                    <Option value="new">New</Option>
                                    <Option value="modify">Modify</Option>
                                    <Option value="delete">Delete</Option>
                                    <Option value="use">Use</Option>
                                </Select>
                                <Input
                                    value={integration.name}
                                    onChange={(e) => handleIntegrationChange(index, 'name', e.target.value)}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </List.Item>
                    )}
                />
                <Button type="dashed" onClick={handleAddIntegration} style={{ width: '100%', marginTop: 16 }}>
                    Add Integration
                </Button>
            </div>
        </Modal>
    );
};

export default EdgeModal;