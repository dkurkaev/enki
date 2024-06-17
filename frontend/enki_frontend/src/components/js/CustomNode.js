import { memo, useEffect, useState, useLayoutEffect, useMemo, useRef } from 'react';
import { Handle, Position, NodeResizer, useUpdateNodeInternals, useNodesState, useReactFlow } from 'reactflow';
import FunctionPopup from './FunctionPopup';
import '../css/CustomNode.css';

const CustomNode = ({ data, id, selected }) => {
    const { label, status, functions, height, width } = data;
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [targetArrayWidth, setTargetArrayWidth] = useState([]);
    const [targetArrayHeight, setTargetArrayHeight] = useState([]);
    const updateNodeInternals = useUpdateNodeInternals();
    const { setNodes } = useReactFlow();
    const nodeRef = useRef();

    useLayoutEffect(() => {
        if (nodeRef.current) {
            generateHandles(); // Call generateHandles initially
        }
    }, [id, width, height]);

    useEffect(() => {
        updateNodeInternals(id);
    }, [id, width, height]);

    const generateHandles = () => {
        const topBottomHandleCount = Math.floor((width || 150) / 30); // Adjust divisor to control handle density
        const leftRightHandleCount = Math.floor((height || 150) / 30); // Adjust divisor to control handle density

        const newTargetArrayWidth = Array.from({ length: topBottomHandleCount }, (_, i) => i + 1);
        const newTargetArrayHeight = Array.from({ length: leftRightHandleCount }, (_, i) => i + 1);

        setTargetArrayWidth(newTargetArrayWidth);
        setTargetArrayHeight(newTargetArrayHeight);
    };

    const positionHandle = (index, total) => {
        return (index / total) * 100 + '%';
    };

    const DynHandle = ({ position, idx, idPrefix, total }) => (
        <Handle
            type="source"
            position={position}
            id={`${idPrefix}-${idx}`}
            style={position === Position.Top || position === Position.Bottom
                ? { left: positionHandle(idx, total) }
                : { top: positionHandle(idx, total) }}
        />
    );

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

    const topHandles = useMemo(() =>
        targetArrayWidth.map((idx) => (
            <DynHandle key={`top-${idx}`} position={Position.Top} idx={idx} idPrefix="top" total={targetArrayWidth.length} />
        )), [targetArrayWidth]);

    const bottomHandles = useMemo(() =>
        targetArrayWidth.map((idx) => (
            <DynHandle key={`bottom-${idx}`} position={Position.Bottom} idx={idx} idPrefix="bottom" total={targetArrayWidth.length} />
        )), [targetArrayWidth]);

    const leftHandles = useMemo(() =>
        targetArrayHeight.map((idx) => (
            <DynHandle key={`left-${idx}`} position={Position.Left} idx={idx} idPrefix="left" total={targetArrayHeight.length} />
        )), [targetArrayHeight]);

    const rightHandles = useMemo(() =>
        targetArrayHeight.map((idx) => (
            <DynHandle key={`right-${idx}`} position={Position.Right} idx={idx} idPrefix="right" total={targetArrayHeight.length} />
        )), [targetArrayHeight]);


    return (
        <div ref={nodeRef} className="custom-node" style={{ borderColor: getBorderColor(data.status), width: width || 150, height: height || 150 }}>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                onResize={(event, { width: newWidth, height: newHeight }) => {
                    setNodes((prevNodes) => prevNodes.map(node => node.id === id ? { ...node, data: { ...node.data, width: newWidth, height: newHeight } } : node));
                    generateHandles(); // Re-generate handles on resize
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

            {topHandles}
            {bottomHandles}
            {leftHandles}
            {rightHandles}

            {showPopup && (
                <FunctionPopup functionData={selectedFunction} nodeId={id} onClose={closePopup} />
            )}
        </div>
    );
};

export default memo(CustomNode);