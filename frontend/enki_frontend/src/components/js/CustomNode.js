import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import '../css/CustomNode.css';


function CustomNode({ data }) {
    const { label, functions } = data;

    const renderFunction = (func) => {
        let icon = '';
        let color = '';

        switch (func.status) {
            case 'new':
                icon = '🧩';
                color = '#009900';
                break;
            case 'modify':
                icon = '🔷️';
                color = '#007FFF';
                break;
            case 'delete':
                icon = '❌';
                color = '#FF0000';
                break;
            case 'use':
            default:
                icon = '  ';
                color = '#808080'; // gray
                break;
        }

        return (
            <div key={func.name} style={{ color }}>
                {icon} {func.name}
            </div>
        );
    };

    const getBorderColor = (status) => {
        switch (status) {
            case 'new':
                return '#009900';
            case 'modify':
                return '#007FFF';
            case 'delete':
                return '#FF0000';
            case 'use':
                return '#6B7280'; // Tailwind's text-gray-500 color
            default:
                return '#000000'; // Default color if no status matches
        }
    };

    return (
        <div className="custom-node" style={{ borderColor: getBorderColor(data.status) }}>
            <div className="flex">
                <div className="ml-2">
                    <div className="text-lg font-bold">{data.label}</div>
                    <div className="custom-node-body">
                        {functions.map(renderFunction)}
                    </div>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
            <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
        </div>
    );
}

export default memo(CustomNode);