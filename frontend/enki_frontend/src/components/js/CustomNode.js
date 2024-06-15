import { memo, useEffect, useState } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals } from 'reactflow';
import FunctionPopup from './FunctionPopup';
import '../css/CustomNode.css';

const CustomNode = ({ data, id, selected }) => {
    const { label, status, functions, height, width } = data;
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        updateNodeInternals(id);
    }, [height, width, id, updateNodeInternals]);

    const handleFunctionDoubleClick = (func) => {
        setSelectedFunction(func);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedFunction(null);
    };

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
            <div key={func.id} style={{ color }} onDoubleClick={() => handleFunctionDoubleClick(func)}>
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
        <div className="custom-node" style={{ borderColor: getBorderColor(status), width, height }}>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={100}
                minHeight={30}
            />
            <div className="ml-2">
                <div className="text-lg font-bold">{data.label}</div>
                <div className="custom-node-body">
                    {functions.map(renderFunction)}
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
            <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />

            {showPopup && (
                <FunctionPopup functionData={selectedFunction} nodeId={id} onClose={closePopup} />
            )}
        </div>
    );
};

export default memo(CustomNode);