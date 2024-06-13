// Header.js
import React from 'react';
import AddNodeButton from '../js/AddNodeButton';
import SaveChangesButton from '../js/SaveChangesButton';
import '../css/Header.css';

const Header = ({ nodes, setNodes, edges, setEdges, changes, setChanges }) => {
    return (
        <div className="header">
            <button>New Diagram</button>
            <SaveChangesButton />
            <AddNodeButton />
        </div>
    );
};

export default Header;