// Header.js
import React from 'react';
import AddNodeButton from '../js/AddNodeButton';
import SaveChangesButton from '../js/SaveChangesButton';
import { useReactFlow } from 'reactflow';
import '../css/Header.css';

const Header = ({
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
    return (
        <div className="header">
            <button>New Diagram</button>
            <SaveChangesButton
                addedNodes={addedNodes}
                setAddedNodes={setAddedNodes}
                updatedNodes={updatedNodes}
                setUpdatedNodes={setUpdatedNodes}
                deletedNodes={deletedNodes}
                setDeletedNodes={setDeletedNodes}
                addedEdges={addedEdges}
                setAddedEdges={setAddedEdges}
                updatedEdges={updatedEdges}
                setUpdatedEdges={setUpdatedEdges}
                deletedEdges={deletedEdges}
                setDeletedEdges={setDeletedEdges}
            />
            <AddNodeButton setAddedNodes={setAddedNodes} /> {/* Pass setAddedNodes */}
        </div>
    );
};

export default Header;