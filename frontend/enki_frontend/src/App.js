// App.js
import React, { useState } from 'react'; // Import useState hook
import {ReactFlowProvider} from 'reactflow';
import Header from './components/js/Header';
import flow from "./components/js/Flow";
import './App.css';
import DiagramArea from "./components/js/DiagramArea";
import Flow from "./components/js/Flow";
import AddNodeButton from "./components/js/AddNodeButton";
import Sidebar from "./components/js/Sidebar";


const App = () => {

    return (
        <ReactFlowProvider>
                <div className="app">
                    {/*<Header/>*/}
                    <div className="main-content">
                        <Flow/>
                    </div>
                </div>
        </ReactFlowProvider>
    );
};

export default App;