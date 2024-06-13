import React, { useContext } from 'react';
import { DiagramContext } from './DiagramArea';

const AddNodeButton = () => {
    const { nodes, setNodes, setFinalNodeChanges } = useContext(DiagramContext);

    const addNode = () => {
        const newNode = {
            id: `node-${+new Date()}`,
            type: 'custom',
            data: {
                label: 'System',
                type: 'system', // Add the type field
                status: 'delete', // Add the status field
                functions: [
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'new', name: 'Function 1' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'modify', name: 'Function 2' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'delete', name: 'Function 3' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'use', name: 'Function 4' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'use', name: 'Function 5' }
                ]  // Add functions array with status and name
            },
            position: { x: Math.random() * 250, y: Math.random() * 250 },
            isNew: true,  // Mark this node as new
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        setFinalNodeChanges((prevChanges) => [...prevChanges, newNode]);
    };

    return <button onClick={addNode}>Add Node</button>;
};

export default AddNodeButton;
