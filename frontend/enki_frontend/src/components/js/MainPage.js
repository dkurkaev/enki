import React from 'react';
import DiagramArea from './DiagramArea';
import Header from './Header';
import ButtonGroup from './ButtonGroup';
import '../css/MainPage.css';

const MainPage = () => {
    return (
        <div className="main-container">
            <Header />
            <ButtonGroup />
            <DiagramArea />
        </div>
    );
};

export default MainPage;