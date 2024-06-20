import React, { memo } from 'react';
import { getSmoothStepPath, EdgeLabelRenderer, EdgeProps } from 'reactflow';
import EdgeModal from './EdgeModal';

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
                        onDoubleClick,
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

    const generateLabel = () => {
        if (!data?.integrations) return '';
        return data.integrations.map(integration => `${integration.code}: ${integration.name}`).join('\n');
    };

    const label = generateLabel();

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
            <path
                id={id}
                className="react-flow__edge-path"
                d={edgePath}
                style={{ stroke: color }}
                markerEnd={markerEnd}
                onDoubleClick={onDoubleClick}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: 'white',
                        padding: '2px',
                        borderRadius: '3px',
                        fontSize: 12,
                        whiteSpace: 'pre-line',
                        pointerEvents: 'all',
                    }}
                >
                    {label}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default memo(CustomEdge);