import { memo, useEffect, useState } from 'react';
import {Handle, Position, NodeResizer, useUpdateNodeInternals, useNodesState, useReactFlow} from 'reactflow';
import FunctionPopup from './FunctionPopup';
import '../css/CustomNode.css';

const CustomNode = ({ data, id, selected }) => {
    const { label, status, functions, height, width } = data;
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const updateNodeInternals = useUpdateNodeInternals();
    // const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const { setNodes } = useReactFlow();

    // Update the internal state of the node to ensure it re-renders correctly
    useEffect(() => {
        updateNodeInternals(id);
    }, [data.height, data.width, id, updateNodeInternals]);

    // Handling double-click on Node.Function and opening popup for editing function
    const handleFunctionDoubleClick = (func) => {
        setSelectedFunction(func);
        setShowPopup(true);
    };

    // Closing popup
    const closePopup = () => {
        setShowPopup(false);
        setSelectedFunction(null);
    };

    // Rendering functions depending on status
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

    // Painting node's border depending on status
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

    // Handle resizing to save it
    const onResizeHandler = (event, { width: newWidth, height: newHeight }) => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id ? { ...node, width: newWidth, height: newHeight } : node
            )
        );
        updateNodeInternals(id);
    };

    return (
        <div className="custom-node" style={{ borderColor: getBorderColor(data.status), width: width || 150, height: height || 150 }}>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                onResize={(event, { width: newWidth, height: newHeight }) => setNodes((prevNodes) => prevNodes.map(node => node.id === id ? { ...node, data: { ...node.data, width: newWidth, height: newHeight } } : node))}
                minWidth={100}
                minHeight={30}
            />
            <div className="ml-2">
                <div className="text-lg font-bold">{label}</div>
                <div className="custom-node-body">
                    {functions.map(renderFunction)}
                </div>
            </div>

            <Handle type="target" isConnectableStart="true" isConnectableEnd="true" position={Position.Top} className="w-16 !bg-teal-500" />
            <Handle type="source" isConnectableStart="true" isConnectableEnd="true" position={Position.Bottom} className="w-16 !bg-teal-500" />

            {showPopup && (
                <FunctionPopup functionData={selectedFunction} nodeId={id} onClose={closePopup} />
            )}
        </div>
    );
};

export default memo(CustomNode);