import { useEffect, useState } from 'react';
import { fetchNodes, fetchEdges } from '../../api';

const useFetchElements = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [fetchedNodes, fetchedEdges] = await Promise.all([fetchNodes(), fetchEdges()]);

            const nodesWithSize = fetchedNodes.map(node => ({
                ...node,
                width: node.width || 150,
                height: node.height || 150,
            }));

            setNodes(nodesWithSize);
            setEdges(fetchedEdges);
            setLoading(false);
        };

        fetchData();
    }, []);

    return { nodes, edges, loading };
};

export default useFetchElements;