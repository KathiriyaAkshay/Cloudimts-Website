import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme, Divider, Row, Steps, Button, Image } from 'antd';
import { Tabs } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/Imageinet-logo.png'
const { Header, Content, Footer } = Layout;



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

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    const [windowsTitle, setWindowsTitle] = useState("To upload your local study to a cloud server, are you prepared to download the Cloudimts exe file? Set up Cloudimts on your local computer by following these instructions.");
    const [applicationTitle, setApplicationTitle] = useState("Download our application and submit your study report from your phone");
    const [tabActivationKey, setTabActivationKey] = useState('1');

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const HandleTabChange = (activationKey) => {

        setTabActivationKey(activationKey);
        if (activationKey === "3" || activationKey === "4") {

        }
    }

    return (
        <Layout id="download-page-main">

            {/* ======  Header component ======= */}

            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: "0.8rem",
                    paddingLeft: "0.5rem",
                    position: "relative"
                }}
            >

                <div className="header-logo-downloads" style={
                    {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "5rem",
                        padding: ".3rem"
                    }

                }>
                    <Link to={"/studies"} >
                        <img src={logo} height={"100%"} width={"70px"} />
                    </Link>

                </div>


                <Divider type='vertical' className='vertical-divider' />

                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#000',
                    justifyContent: 'center'
                }}>
                    Download Instructions
                </div>

                <div
                    style={{
                        position: "absolute",
                        right: "2rem"
                    }}
                >
                    <Button
                        type='primary'
                        htmlType='submit'
                        style={{ width: "max-content" }}
                        onClick={()=>goBack("4")}
                    >
                       Go Back
                    </Button>

                </div>

            </Header>

            {/* ====== Content component =====  */}

            <Content
                style={{
                    padding: '1rem 2rem',

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

                    }}
                >

                    <div style={{ width: "30%", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>

                        <div className='download-page-advertise'>

                            <div>
                                <img src={logo} width="130px" height="70px" />
                            </div>

                            <div className='download-typography'>
                                Download Our Software!
                            </div>

                        </div>

                        <div className='download-description'>
                            {(tabActivationKey === "1" || tabActivationKey == "2") ? windowsTitle :
                                applicationTitle}
                        </div>

                    </div>

                    <div style={{ width: "70%", height:"85vh"}}>

                        <div style={{ marginTop: "1rem" }}>

                            <Tabs defaultActiveKey='1' onChange={HandleTabChange} className='download-instruction-tab'>

                                {/* === Exe download step instuctions ===  */}

                                <Tabs.TabPane key={'1'} tab='Windows DICOM Uploader'>

                                    <Row gutter={15}>
                                        <div style={{ width: "100%" }}>
                                            <div style={{ fontSize: "1.5rem" }}>
                                                How to setup ?
                                            </div>

                                            <Steps
                                                progressDot
                                                current={3}
                                                direction="vertical"
                                                className='Download-instruction-steps'
                                                items={[
                                                    {
                                                        title: 'Step 1 : Please download the Cloudimts Study Uploader from the link provided below.',
                                                        description: (
                                                            <p className='particular-steps-instruction'>
                                                                <a target='_blank'
                                                                    href='https://imagenet-dicom-image.s3.ap-south-1.amazonaws.com/exe/v1.0.0/Cloudimtsv1.0.0.exe'
                                                                    style={{ marginLeft: '0.5rem' }}>
                                                                    Download from here
                                                                </a>
                                                            </p>
                                                        ),
                                                    }
                                                ]}
                                                
                                            />

                                        </div>

                                    </Row>

                                </Tabs.TabPane>

                                {/* ==== Application download steps instructions ====  */}

                                <Tabs.TabPane key={'2'} tab='MAC DICOM Uploader'>

                                    <Row gutter={15}>

                                        <div style={{ width: "100%" }}>
                                            <div style={{ fontSize: "1.5rem" }}>Development status</div>

                                            <Steps
                                                progressDot
                                                current={4}
                                                direction="vertical"
                                                className='Download-instruction-steps'
                                                items={[
                                                    {
                                                        title: 'Step 1 ',
                                                        description: 'The MAC DICOM Uploader is currently in the development stage and will be released as soon as possible',
                                                    }
                                                ]}
                                            />
                                        </div>

                                    </Row>

                                </Tabs.TabPane>
                                
                                {/* Android application download option  */}

                                <Tabs.TabPane key={'3'} tab='Android application'>

                                    <Row gutter={15}>
                                        <div style={{ width: "100%" }}>
                                            <div style={{ fontSize: "1.5rem" }}>
                                                Development status
                                            </div>

                                            <Steps
                                                progressDot
                                                current={3}
                                                direction="vertical"
                                                className='Download-instruction-steps'
                                                items={[
                                                    {
                                                        title: 'Step 1 ',
                                                        description: 'The Android application is currently in the testing phase, and we aim to release it for all users as soon as possible',
                                                    }
                                                ]}
                                            />


                                        </div>

                                    </Row>

                                </Tabs.TabPane>

                                {/* IOS application download option  */}

                                <Tabs.TabPane key={'4'} tab='IOS application'>

                                    <Row gutter={15}>
                                        <div style={{ width: "100%" }}>
                                            <div style={{ fontSize: "1.5rem" }}>
                                                Steps for download
                                            </div>

                                            <Steps
                                                progressDot
                                                current={3}
                                                direction="vertical"
                                                className='Download-instruction-steps'
                                                items={[
                                                    {
                                                        title: 'Step 1 ',
                                                        description: 'The IOS application is currently in the testing phase, and we aim to release it for all users as soon as possible',
                                                    }
                                                ]}
                                            />

                                        </div>

                                    </Row>

                                </Tabs.TabPane>

                            </Tabs>
                        </div>

                    </div>

                </div>
            </Content>
        </Layout>
    );
};
export default App;