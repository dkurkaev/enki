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
        const updatedIntegrations = integrations.map((integration, i) =>
            i === index ? { ...integration, [field]: value } : integration
        );
        setIntegrations(updatedIntegrations);
        const updatedEdge = {
            ...edge,
            data: {
                ...edge.data,
                integrations: updatedIntegrations,
            },
        };
        updateEdge(updatedEdge);
    };

    const handleRemoveIntegration = (index) => {
        const updatedIntegrations = integrations.filter((_, i) => i !== index);
        setIntegrations(updatedIntegrations);
        const updatedEdge = {
            ...edge,
            data: {
                ...edge.data,
                integrations: updatedIntegrations,
            },
        };
        updateEdge(updatedEdge);
    };

    const handleAddIntegration = () => {
        const newIntegration = { id: `integration-${Date.now()}${Math.floor(Math.random() * 1000000)}`, code: '', name: '', status: '' };
        const updatedIntegrations = [...integrations, newIntegration];
        setIntegrations(updatedIntegrations);
        const updatedEdge = {
            ...edge,
            data: {
                ...edge.data,
                integrations: updatedIntegrations,
            },
        };
        updateEdge(updatedEdge);
    };

    return (
        <Modal title="Edit Edge Status and Integrations" open={isOpen} onCancel={onClose} footer={null}>
            <Select defaultValue={status} onChange={handleStatusChange} style={{ width: '100%', marginBottom: '20px' }}>
                <Option value="new">New</Option>
                <Option value="modify">Modify</Option>
                <Option value="delete">Delete</Option>
                <Option value="use">Use</Option>
            </Select>
            <List
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
                        <Input
                            placeholder="Code"
                            value={integration.code}
                            onChange={(e) => handleIntegrationChange(index, 'code', e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <Input
                            placeholder="Name"
                            value={integration.name}
                            onChange={(e) => handleIntegrationChange(index, 'name', e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <Select
                            placeholder="Status"
                            value={integration.status}
                            onChange={(value) => handleIntegrationChange(index, 'status', value)}
                            style={{ width: '100px' }}
                        >
                            <Option value="new">New</Option>
                            <Option value="modify">Modify</Option>
                            <Option value="delete">Delete</Option>
                            <Option value="use">Use</Option>
                        </Select>
                    </List.Item>
                )}
            />
            <Button type="dashed" onClick={handleAddIntegration} style={{ width: '100%', marginTop: '10px' }}>
                Add Integration
            </Button>
        </Modal>
    );
};

export default EdgeModal;