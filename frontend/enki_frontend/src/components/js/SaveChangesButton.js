import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { createNode, updateNode, deleteNode, createEdge, updateEdge, deleteEdge, fetchNodes, fetchEdges } from '../../api';

const SaveChangesButton = ({
                               addedNodes,
                               setAddedNodes,
                               updatedNodes,
                               setUpdatedNodes,
                               deletedNodes,
                               setDeletedNodes,
                               addedEdges,
                               setAddedEdges,
                               updatedEdges,
                               setUpdatedEdges,
                               deletedEdges,
                               setDeletedEdges,
                           }) => {
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

    const saveChanges = useCallback(async () => {
        const nodes = getNodes();
        const edges = getEdges();

        try {
            // Process node changes
            for (const node of nodes) {
                if (addedNodes.some(n => n.id === node.id)) {
                    await createNode(node);
                } else {
                    await updateNode(node.id, node);
                }
            }

            // Process added edges
            for (const edge of addedEdges) {
                await createEdge(edge);
            }

            // Process updated edges
            for (const edge of updatedEdges) {
                await updateEdge(edge.id, edge);
            }

            // Process deleted edges
            for (const edgeId of deletedEdges) {
                await deleteEdge(edgeId);
            }

            // Process deleted nodes
            for (const nodeId of deletedNodes) {
                await deleteNode(nodeId);
            }

            // Fetch updated nodes and edges from backend
            const fetchedNodes = await fetchNodes();
            const fetchedEdges = await fetchEdges();

            const nodesWithSize = fetchedNodes.map(node => ({
                ...node,
                width: node.width || 150, // Default width if not available
                height: node.height || 150, // Default height if not available
            }));

            setNodes(nodesWithSize);
            setEdges(fetchedEdges);
            setAddedNodes([]); // Clear added nodes after saving
            setUpdatedNodes([]); // Clear updated nodes after saving
            setDeletedNodes([]); // Clear deleted nodes after saving
            setAddedEdges([]); // Clear added edges after saving
            setUpdatedEdges([]); // Clear updated edges after saving
            setDeletedEdges([]); // Clear deleted edges after saving

        } catch (error) {
            console.error('Error saving changes:', error);
            console.error('Error details:', error.response?.data);
        }
    }, [getNodes, getEdges, setNodes, setEdges, addedNodes, updatedNodes, deletedNodes, addedEdges, updatedEdges, deletedEdges]);

    return <button onClick={saveChanges}>Save Changes</button>;
};

export default SaveChangesButton;