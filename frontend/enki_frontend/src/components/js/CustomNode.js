import { memo, useEffect, useState, useLayoutEffect, useMemo, useRef } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals, useNodesState, useReactFlow } from 'reactflow';
import FunctionPopup from './FunctionPopup';
import '../css/CustomNode.css';

const CustomNode = ({ data, id, selected }) => {
    const { label, status, functions, height, width } = data;
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const updateNodeInternals = useUpdateNodeInternals();
    const { setNodes } = useReactFlow();
    const nodeRef = useRef();


    useEffect(() => {
        updateNodeInternals(id);
    }, [id, width, height]);



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
        <div ref={nodeRef} className="custom-node" style={{ borderColor: getBorderColor(data.status), width: width || 150, height: height || 150 }}>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                onResize={(event, { width: newWidth, height: newHeight }) => {
                    setNodes((prevNodes) => prevNodes.map(node => node.id === id ? { ...node, data: { ...node.data, width: newWidth, height: newHeight } } : node));
                }}
                minWidth={100}
                minHeight={30}
            />
            <div className="ml-2">
                <div className="text-lg font-bold">{label}</div>
                <div className="custom-node-body">
                    {functions.map(renderFunction)}
                </div>
            </div>

            <Handle type={'source'} position={Position.Top} id={'top-1'} style={{ left: '25%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Top} id={'top-2'} style={{ left: '50%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Top} id={'top-3'} style={{ left: '75%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Bottom} id={'bottom-1'} style={{ left: '25%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Bottom} id={'bottom-2'} style={{ left: '50%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Bottom} id={'bottom-3'} style={{ left: '75%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Left} id={'left-1'} style={{ top: '25%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Left} id={'left-2'} style={{ top: '50%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Left} id={'left-3'} style={{ top: '75%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Right} id={'right-1'} style={{ top: '25%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Right} id={'right-2'} style={{ top: '50%'}} isConnectableStart={true} isConnectableEnd={true} />
            <Handle type={'source'} position={Position.Right} id={'right-3'} style={{ top: '75%'}} isConnectableStart={true} isConnectableEnd={true} />



            {showPopup && (
                <FunctionPopup functionData={selectedFunction} nodeId={id} onClose={closePopup} />
            )}
        </div>
    );
};

export default memo(CustomNode);