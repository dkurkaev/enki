import React, { useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { useStore } from 'reactflow';
import NodeUpdate from './NodeUpdate';

const transformSelector = (state) => state.transform;

const Sidebar = forwardRef(({ nodes, setNodes, onNodesChange, hidden }, ref) => {
    const transform = useStore(transformSelector);
    const [visible, setVisible] = useState(!hidden);

    const selectAll = useCallback(() => {
        setNodes((nds) =>
            nds.map((node) => {
                node.selected = true;
                return node;
            })
        );
    }, [setNodes]);

    const toggleSidebar = () => {
        setVisible((prev) => !prev);
    };

    useImperativeHandle(ref, () => ({
        toggleSidebar,
    }));

    return (
        <aside className={`sidebar ${visible ? '' : 'hidden-sidebar'}`}>
            <NodeUpdate nodes={nodes} setNodes={setNodes} onNodesChange={onNodesChange} />
        </aside>
    );
});

export default Sidebar;