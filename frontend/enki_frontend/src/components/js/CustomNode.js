import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data }) {

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
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2" style={{ borderColor: getBorderColor(data.status) }}>
            <div className="flex">
                <div className="ml-2">
                    <div className="text-lg font-bold">{data.label}</div>
                    <div className="text-gray-500 whitespace-pre-wrap">
                        {data.functions ? data.functions.map((func, index) => (
                            <div key={index}>
                                {func.status === 'new' && <>🧩  {func.name}</>}
                                {func.status === 'modify' && <>🖌️  {func.name}</>}
                                {func.status === 'delete' && <>🖍️  {func.name}</>}
                                {func.status === 'use' && <>      {func.name}</>}
                            </div>
                        )) : ''}
                    </div>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
            <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
        </div>
    );
}

export default memo(CustomNode);