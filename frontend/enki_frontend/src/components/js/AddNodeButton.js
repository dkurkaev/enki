import React, { useContext } from 'react';
import { DiagramContext } from './DiagramArea';

const AddNodeButton = () => {
    const { nodes, setNodes, setFinalNodeChanges } = useContext(DiagramContext);

    const addNode = () => {
        const newNode = {
            id: `node-${+new Date()}`,
            type: 'CustomNode',
            data: { label: `node-${+new Date()}` },
            position: { x: Math.random() * 250, y: Math.random() * 250 },
            isNew: true,  // Mark this node as new
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        setFinalNodeChanges((prevChanges) => [...prevChanges, newNode]);
    };

    return <button onClick={addNode}>Add Node</button>;
};

export default AddNodeButton;
