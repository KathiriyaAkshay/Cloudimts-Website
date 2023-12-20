import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Divider, Row, Steps, Button } from 'antd';
import { Tabs } from 'antd';

import logo from '../../assets/images/Imageinet-logo.png'
import Title from 'antd/es/typography/Title';
const { Header, Content, Footer } = Layout;
const onChange = (key) => {
    console.log(key);
};
const items = [
    {
        key: '1',
        label: 'Windows',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'Android App',
        children: 'Content of Tab Pane 2',
    },
];
const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout id="download-page-main">
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: "0.8rem"
                }}
            >
                <div style={{ height: "3rem", width: "5rem" }}>
                    <img src={logo} width="100%" height="100%" />
                </div>
                <Divider type='vertical' className='vertical-divider' />

                <div style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#000',
                    justifyContent: 'center'
                }}>
                    Downloads

                </div>

            </Header>
            <Content
                style={{
                    padding: '1rem 3rem',

                }}
            >
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        maxHeight: "100%",
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        overflowY: 'auto',

                    }}
                >

                    <div className='download-page-advertise'>
                        <div>
                            <img src={logo} width="150px" height="100px" />
                        </div>
                        <div className='download-typography'>
                            Download Our Software!
                        </div>

                    </div>

                    <div style={{ width: "50%", fontSize: "1.1rem" }}>
                        Lorem, ipsum dolor sit ameboro it dicta doloribus saepe, sequi voluptate deleniti cum sunt eaque consequatur, id beatae. Architecto, blanditiis.
                    </div>


                    <div style={{ width: "60%", marginTop: "1rem" }}>
                        <Tabs>
                            <Tabs.TabPane key={'1'} tab='Windows'>
                                <Row gutter={15}>
                                    <div style={{ width: "100%" }}>
                                        <div style={{ fontSize: "1.5rem" }}>Step By Step Installation Guide To install This App On Windows</div>

                                        <Steps
                                            progressDot
                                            current={3}
                                            direction="vertical"
                                            items={[
                                                {
                                                    title: 'Step 1 ',
                                                    description: 'This is a description. This is a description.',
                                                },
                                                {
                                                    title: 'Step 2',
                                                    description: 'This is a description. This is a description.',
                                                },
                                                {
                                                    title: 'Step 3',
                                                    description: 'This is a description.',
                                                },
                                            ]}
                                        />

                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            style={{ width: "max-content" }}
                                        >
                                            Download Exe
                                        </Button>

                                    </div>

                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane key={'2'} tab='Android'>
                                <Row gutter={15}>
                                    <div style={{ width: "100%" }}>
                                        <div style={{ fontSize: "1.5rem" }}>Step By Step Installation Guide To install This App On Android</div>

                                        <Steps
                                            progressDot
                                            current={4}
                                            direction="vertical"
                                            items={[
                                                {
                                                    title: 'Step 1 ',
                                                    description: 'This is a description. This is a description.',
                                                },
                                                {
                                                    title: 'Step 2',
                                                    description: 'This is a description. This is a description.',
                                                },
                                                {
                                                    title: 'Step 3',
                                                    description: 'This is a description.',
                                                },
                                                {
                                                    title: 'Step 4',
                                                    description: 'This is a description.',
                                                },
                                            ]}
                                        />
                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            style={{ width: "max-content" }}
                                        >
                                            Download App
                                        </Button>
                                    </div>
                                </Row>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>

                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                ImageInet ©2023
            </Footer>
        </Layout>
    );
};
export default App;