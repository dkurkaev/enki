import React from 'react';
import AddNodeButton from './AddNodeButton';
import SaveChangesButton from './SaveChangesButton';
import '../css/ButtonGroup.css';

const ButtonGroup = () => {
    return (
        <div className="button-group">
            <AddNodeButton />
            <SaveChangesButton />
        </div>
    );
};

export default ButtonGroup;