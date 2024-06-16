import axios from 'axios';

const API_BASE_PATH = 'http://localhost:8000/api/v1'; // Ensure this base URL is correct

export const createNode = async (node) => {
    const response = await axios.post(`${API_BASE_PATH}/nodes/`, node);
    return response.data;
};

export const updateNode = async (id, node) => {
    const response = await axios.put(`${API_BASE_PATH}/nodes/${id}/`, node);
    return response.data;
};

export const deleteNode = async (id) => {
    const response = await axios.delete(`${API_BASE_PATH}/nodes/${id}/`);
    return response.data;
};

export const createEdge = async (edge) => {
    //const response = await axios.post(`${API_BASE_PATH}/edges/`, edge);
    //return response.data;
    // Inside the createEdge function in api.js
    //console.log("Creating edge with payload:", edge); // Debug message

    const response = await axios.post(`${API_BASE_PATH}/edges`, edge).catch(error => {
        console.error("Edge creation failed:", error.response?.data);
        throw error;
    });
    return response.data;
};

export const updateEdge = async (id, edge) => {
    const response = await axios.put(`${API_BASE_PATH}/edges/${id}`, edge);
    return response.data;
};

export const deleteEdge = async (id) => {
    const response = await axios.delete(`${API_BASE_PATH}/edges/${id}`);
    return response.data;
};

// export const fetchNodes = async () => {
//     const response = await axios.get(`${API_BASE_PATH}/nodes/`);
//     return response.data;
// };

export const fetchNodes = async () => {
    console.log("Fetching nodes...");
    const response = await axios.get(`${API_BASE_PATH}/nodes/`);
    console.log("Nodes fetched:", response.data);
    return response.data;
};

// export const fetchEdges = async () => {
//     const response = await axios.get(`${API_BASE_PATH}/edges/`);
//     return response.data;
// };

export const fetchEdges = async () => {
    console.log("Fetching edges...");
    const response = await axios.get(`${API_BASE_PATH}/edges`);
    console.log("Edges fetched:", response.data);
    return response.data;
};