import React, { forwardRef, useImperativeHandle } from 'react';
import { useReactFlow } from 'reactflow';

const AddNodeButton = forwardRef((props, ref) => {
    const { setNodes } = useReactFlow();

    const addNode = () => {
        const newNode = {
            id: `node-${+new Date()}`,
            type: 'custom',
            data: {
                label: `node-${+new Date()}`,
                type: 'system',
                status: 'modify',
                height: 170,
                width: 220,
                functions: [
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'new', name: 'Function 1' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'modify', name: 'Function 2' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'delete', name: 'Function 3' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'use', name: 'Function 4' },
                    { id: `func-${+new Date()}-${Math.floor(Math.random() * 1000000)}`, status: 'use', name: 'Function 5' }
                ]
            },
            position: { x: Math.random() * 250, y: Math.random() * 250 },
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
    };

    useImperativeHandle(ref, () => ({
        addNode,
    }));

    return null;
});

export default AddNodeButton;