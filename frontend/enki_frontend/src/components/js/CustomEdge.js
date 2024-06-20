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