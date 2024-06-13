// src/components/js/CustomNode.js

// src/components/js/CustomNode.js

import React, { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import '../css/CustomNode.css';  // Import CSS for CustomNode

const CustomNode = ({ data, selected }) => {
    return (
        <>
            <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
            <Handle type="target" position={Position.Left} />
            <div style={{ padding: 10 }}>{data.label}</div>
            <Handle type="source" position={Position.Right} />
        </>
    );
};

export default memo(CustomNode);