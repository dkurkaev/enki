import React, { useContext } from 'react';
import { DiagramContext } from './DiagramArea';
import { createNode, updateNode, deleteNode, createEdge, deleteEdge, fetchNodes, fetchEdges } from '../../api';

const SaveChangesButton = () => {
    const { finalNodeChanges, finalEdgeChanges, setFinalNodeChanges, setFinalEdgeChanges, setNodes, setEdges } = useContext(DiagramContext);

    const saveChanges = async () => {
        try {
            console.log("Final Node Changes:", finalNodeChanges);
            console.log("Final Edge Changes:", finalEdgeChanges);

// Process node changes
            for (const node of finalNodeChanges) {
                if (node && node.id) {
                    switch (true) {
                        case (node.type === 'remove'):
                            await deleteNode(node.id);
                            console.log("Node removed:", node); // Debug message
                            break
                        case node.isNew:
                            await createNode({...node, isNew: undefined});
                            console.log("Node added:", node); // Debug message
                            break;

                        default:
                            await updateNode(node.id, node);
                            console.log("Node updated:", node); // Debug message
                            break;
                    }
                }
            }
           /* for (const node of finalNodeChanges) {
                if (node && node.id) {
                    if (node.type === 'remove') {
                        await deleteNode(node.id);
                        console.log("Node removed:", node); // Debug message
                    } else if (node.type === 'add') {
                        const { type, ...nodePayload } = node; // Remove type before sending
                        await createNode(nodePayload);
                        console.log("Node added:", node); // Debug message
                    } else if (node.type === 'update') {
                        await updateNode(node.id, node);
                        console.log("Node updated:", node); // Debug message
                    }
                }
            } */


// Process edge changes
            for (const edge of finalEdgeChanges) {
                if (edge && edge.id) {
                    switch (true) {
                        case edge.isNew:
                            await createEdge({...edge, isNew: undefined, markerEnd: undefined});
                            break;
                        case 'remove':
                            await deleteEdge(edge.id);
                            console.log("Edge removed:", edge); // Debug message
                            break;
                        default:
                            await deleteEdge(edge.id);
                            break;
                    }
                }
            }


            // Clear changes after successful save
            setFinalNodeChanges([]);
            setFinalEdgeChanges([]);

            // Fetch updated nodes and edges from backend
            const fetchedNodes = await fetchNodes();
            const fetchedEdges = await fetchEdges();
            setNodes(fetchedNodes);
            setEdges(fetchedEdges);

            console.log('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            console.error('Error details:', error.response?.data); // Log detailed error response
        }
    };

    return <button onClick={saveChanges}>Save Changes</button>;
};

export default SaveChangesButton;