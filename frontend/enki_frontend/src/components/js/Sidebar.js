import React from 'react';
import { Drawer } from 'antd';
import NodeUpdate from './NodeUpdate';

const Sidebar = ({ visible, onClose, nodes, setNodes, onNodesChange }) => {
    return (
        <Drawer
            title="Node Update"
            placement="right"
            onClose={onClose}
            visible={visible}
            width={300} // Adjust the width as needed
        >
            <NodeUpdate nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange} />
        </Drawer>
    );
};

export default Sidebar;