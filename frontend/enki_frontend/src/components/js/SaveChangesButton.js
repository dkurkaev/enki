import React, { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useReactFlow, useNodesState, useEdgesState } from 'reactflow';
import { createNode, updateNode, deleteNode, createEdge, updateEdge, deleteEdge, fetchNodes, fetchEdges } from '../../api'; // Adjust import path as necessary

const SaveChangesButton = forwardRef((props, ref) => {
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
    const [initialNodes, setInitialNodes] = useState([]);
    const [initialEdges, setInitialEdges] = useState([]);
    const [nodes, , onNodesChange] = useNodesState([]);
    const [edges, , onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            const fetchedNodes = await fetchNodes();
            const fetchedEdges = await fetchEdges();

            const nodesWithSize = fetchedNodes.map(node => ({
                ...node,
                width: node.width || 150,
                height: node.height || 150,
            }));

            setInitialNodes(nodesWithSize);
            setInitialEdges(fetchedEdges);
            setNodes(nodesWithSize);
            setEdges(fetchedEdges);
        };

        fetchInitialData();
    }, [setNodes, setEdges]);

    const saveChanges = useCallback(async () => {
        const currentNodes = getNodes();
        const currentEdges = getEdges();

        const addedNodes = currentNodes.filter(node => !initialNodes.some(n => n.id === node.id));
        const updatedNodes = currentNodes.filter(node => initialNodes.some(n => n.id === node.id && (n.position !== node.position || n.data !== node.data)));
        const deletedNodes = initialNodes.filter(node => !currentNodes.some(n => n.id === node.id));

        const addedEdges = currentEdges.filter(edge => !initialEdges.some(e => e.id === edge.id));
        const updatedEdges = currentEdges.filter(edge => initialEdges.some(e => e.id === edge.id && (e.source !== edge.source || e.target !== edge.target || e.data !== edge.data)));
        const deletedEdges = initialEdges.filter(edge => !currentEdges.some(e => e.id === edge.id));

        // Ensure all edges include the required fields
        const ensureEdgeFields = (edge) => ({
            ...edge,
            animated: edge.animated || false,
            data: edge.data || { status: 'use', integrations: [] },
        });

        try {
            // Process added nodes
            for (const node of addedNodes) {
                await createNode(node);
            }

            // Process updated nodes
            for (const node of updatedNodes) {
                await updateNode(node.id, node);
            }

            // Process deleted nodes
            for (const node of deletedNodes) {
                await deleteNode(node.id);
            }

            // Process added edges
            for (const edge of addedEdges) {
                await createEdge(ensureEdgeFields(edge));
            }

            // Process updated edges
            for (const edge of updatedEdges) {
                await updateEdge(edge.id, ensureEdgeFields(edge));
            }

            // Process deleted edges
            for (const edge of deletedEdges) {
                await deleteEdge(edge.id);
            }

            // Fetch updated nodes and edges from backend
            const fetchedNodes = await fetchNodes();
            const fetchedEdges = await fetchEdges();

            const nodesWithSize = fetchedNodes.map(node => ({
                ...node,
                width: node.width || 150,
                height: node.height || 150,
            }));

            setInitialNodes(nodesWithSize);
            setInitialEdges(fetchedEdges);
            setNodes(nodesWithSize);
            setEdges(fetchedEdges);
        } catch (error) {
            console.error('Error saving changes:', error);
            console.error('Error details:', error.response?.data);
        }
    }, [getNodes, getEdges, setNodes, setEdges, initialNodes, initialEdges]);

    useImperativeHandle(ref, () => ({
        saveChanges,
    }));

    return null;

});

export default SaveChangesButton;