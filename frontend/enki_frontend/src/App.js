import React, { useRef, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import {
    DownloadOutlined,
    FileAddOutlined,
    SaveOutlined,
    SelectOutlined,
    SwitcherOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import './index.css';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Flow from "./components/js/Flow"; // Import Flow component
import AddNodeButton from './components/js/AddNodeButton';
import SaveChangesButton from './components/js/SaveChangesButton';
import NodeEdit from './components/js/NodeEdit'; // Import NodeEdit
import logo from './assets/logo.png';
import { exportToXML } from './api'; // Import the new API function


const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('New diagram', '1', <SelectOutlined />),
    getItem('Repository', 'sub1', <SwitcherOutlined />, [
        getItem('Systems', '3'),
        getItem('Functions', '4'),
        getItem('Integrations', '5'),
    ]),
    getItem('My clusters', 'sub2', <TeamOutlined />, [getItem('Сontract accounting', '6'), getItem('Funding management', '8')]),
];

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const addNodeButtonRef = useRef(null);
    const saveChangesButtonRef = useRef(null);
    const nodeEditRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleAddNode = () => {
        if (addNodeButtonRef.current) {
            addNodeButtonRef.current.addNode();
        }
    };

    const handleSaveChanges = () => {
        if (saveChangesButtonRef.current) {
            saveChangesButtonRef.current.saveChanges();
        }
    };

    const handleToggleSidebar = () => {
        if (nodeEditRef.current) {
            if (selectedNode) {
                nodeEditRef.current.showDrawer(selectedNode);
            } else {
                alert('No node selected');
            }
        }
    };

    const handleExportToXML = async () => {
        try {
            const blob = await exportToXML();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'diagram.xml');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting to XML:', error);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header">
                <img src={logo} alt="Logo" style={{ height: '35px', marginLeft: '6px', marginRight: '16px' }} />
                <div className="logo" />
                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light" width={200} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={items}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Finances & IT</Breadcrumb.Item>
                            <Breadcrumb.Item>Сontract accounting</Breadcrumb.Item>
                            <Breadcrumb.Item>2024 Q3</Breadcrumb.Item>
                        </Breadcrumb>
                        <div
                            style={{
                                padding: 24,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'calc(100vh - 150px)',
                            }}
                        >
                            <ReactFlowProvider>
                                <Flow nodes={nodes} setNodes={setNodes} onNodesChange={setNodes} edges={edges} setEdges={setEdges} setSelectedNode={setSelectedNode} />
                                <AddNodeButton ref={addNodeButtonRef} style={{ display: 'none' }} />
                                <SaveChangesButton ref={saveChangesButtonRef} style={{ display: 'none' }} />
                                <NodeEdit ref={nodeEditRef} />
                            </ReactFlowProvider>
                            <FloatButton.Group shape="square" style={{ right: 60 }}>
                                <FloatButton icon={<FileAddOutlined />} onClick={handleAddNode} />
                                <FloatButton icon={<SaveOutlined />} onClick={handleSaveChanges} />
                                <FloatButton icon={<SelectOutlined />} onClick={handleToggleSidebar} />
                                <FloatButton icon={<DownloadOutlined />} onClick={handleExportToXML} /> {/* New export button */}
                            </FloatButton.Group>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;