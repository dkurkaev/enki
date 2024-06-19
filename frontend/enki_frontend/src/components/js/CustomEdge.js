import React, { memo } from 'react';
import { getSmoothStepPath, EdgeLabelRenderer, EdgeProps } from 'reactflow';

const CustomEdge = ({
                        id,
                        sourceX,
                        sourceY,
                        targetX,
                        targetY,
                        sourcePosition,
                        targetPosition,
                        style = {},
                        markerEnd,
                        data,
                    }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const getColorByStatus = (status) => {
        switch (status) {
            case 'new':
                return '#009900';
            case 'modify':
                return '#007FFF';
            case 'delete':
                return '#FF0000';
            case 'use':
                return '#6B7280';
            default:
                return '#000000';
        }
    };

    const color = getColorByStatus(data?.status);

    return (
        <>
            <svg width="0" height="0">
                <defs>
                    <marker
                        id={`arrowhead-${id}`}
                        viewBox="0 0 10 10"
                        refX="10"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                    </marker>
                </defs>
            </svg>
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                style={{ stroke: color }}
                markerEnd={`url(#arrowhead-${id})`}
            />
            {/* Uncomment if you want to render the label */}
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: 'white',
                        padding: '2px',
                        borderRadius: '3px',
                        fontSize: 12,
                        pointerEvents: 'all'
                    }}
                >
                    {data?.label || 'Label'}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default memo(CustomEdge);