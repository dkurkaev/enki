import React, { useCallback } from 'react';
import { useReactFlow, useNodesState } from 'reactflow';
import '../css/NodeContextMenu.css';

const NodeContextMenu = React.forwardRef(({ id, top, left, onChangeStatus }, ref) => {
    const { getNode, setEdges } = useReactFlow();
    const [nodes, setNodes] = useNodesState();

    // const duplicateNode = useCallback(() => {
    //     const node = getNode(id);
    //     const position = {
    //         x: node.position.x + 50,
    //         y: node.position.y + 50,
    //     };
    //
    //     setNodes((nds) => [
    //         ...nds,
    //         {
    //             ...node,
    //             id: `${node.id}-copy`,
    //             position,
    //         },
    //     ]);
    // }, [id, getNode, setNodes]);
    //
    // const deleteNode = useCallback(() => {
    //     setNodes((nds) => nds.filter((node) => node.id !== id));
    //     setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    // }, [id, setNodes, setEdges]);

    return (
        <div
            ref={ref}
            className="context-menu"
            style={{
                top: `${top}px`,
                left: `${left}px`,
            }}
        >
            <button onClick={() => onChangeStatus(id, 'new')}>New</button>
            <button onClick={() => onChangeStatus(id, 'modify')}>Modify</button>
            <button onClick={() => onChangeStatus(id, 'delete')}>Delete</button>
            <button onClick={() => onChangeStatus(id, 'use')}>Use</button>
            {/*<button onClick={duplicateNode}>Duplicate</button>*/}
            {/*<button onClick={deleteNode}>Delete</button>*/}
        </div>
    );
});

export default NodeContextMenu;