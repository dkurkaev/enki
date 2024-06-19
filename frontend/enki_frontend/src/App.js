import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import './index.css';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined, SelectOutlined, SwitcherOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Flow from "./components/js/Flow"; // Import Flow component

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
    // getItem('Files', '9', <FileOutlined />),
];

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Diagrams</Breadcrumb.Item>
                        <Breadcrumb.Item>New Diagram</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'calc(100vh - 130px)'
                            // Такая высота, если вставляем футер:
                            // height: 'calc(100vh - 190px)', // Adjust height to fit header, footer, and breadcrumb
                        }}
                    >
                        <ReactFlowProvider>
                            <Flow /> {/* Add Flow component here */}
                        </ReactFlowProvider>
                    </div>
                </Content>
                {/*<Footer style={{ textAlign: 'center' }}>*/}
                {/*    Enki ©{new Date().getFullYear()} Created by Dmitry Kurkaev*/}
                {/*</Footer>*/}
            </Layout>
        </Layout>
    );
};

export default App;