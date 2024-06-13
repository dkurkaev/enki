import React, { useEffect, useRef } from 'react';
import '../css/ContextMenu.css';

const ContextMenu = ({ position, closeMenu }) => {
    const contextMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeMenu]);

    return (
        <ul className="context-menu" style={{ top: position.y, left: position.x }} ref={contextMenuRef}>
            <li className="context-menu-item" onClick={() => alert('Add Node')}>
                Add Node
            </li>
        </ul>
    );
};

export default ContextMenu;