import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, Col, Row, Space, Table, Tag, Modal, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import UploadImage from '../../components/UploadImage';

const ManualEntry = () => {
    const [multipleImageFile, setMultipleImageFile] = useState([]);
    const [value, setValues] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const showModal = () => {

        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        {
            title: 'Session Description',
            dataIndex: 'session_desc',
            key: 'session_desc',
        },
        {
            title: 'Modality',
            dataIndex: 'modality',
            key: 'modality',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button><EditOutlined /></Button>
                    <Button><DeleteOutlined /></Button>
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            session_desc: "here",
            modality: "her1"
        },
    ];
    return (
        <div className='manual-entry-wrapper'>

            <div className='manual-entry p-2'>
                <div className='w-100 text-center header'>Manual Entry</div>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: "100%",
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row className='w-100'>
                        <Col span={12}>
                            <Form.Item
                                label="Patient's Name"
                                name="patient_name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Patient's name!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Patient's Id   "
                                name="patient_id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Patient's id",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter description",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                label="Age"
                                name="age"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Patient's age",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Modality"
                                name="modality"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Patient's age",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Institution Name"
                                name="institution_name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Institution name!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Accession Number"
                                name="accession_number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter accession number",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                label="Referring Physician"
                                name="referring_physician"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Referring Physician",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                label="Gender"
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Patient's gender",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="images"
                                name="images"
                            >
                                <Button onClick={() => { setIsModalOpen(true) }}>Add Image Series</Button>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Form.Item
                        wrapperCol={{
                            offset: 20,
                            // span: 20,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

                <Table columns={columns} dataSource={data} pagination={false} />
            </div>

            <Modal title="Add Image Series" width={800} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                className='add-image-series'
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: "100%",
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Series Description"
                        name="series_description"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter series_description!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Modality"
                        name="modality"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter modality!',
                            },
                        ]}
                    >
                        <Input />
                        </Form.Item>
                        {/* <Form.Item
                            label="Select Images"
                            name="images"
                        > */}
                        <UploadImage 
                            isAddImageSeries={true}
                            multipleImage={true}
                            multipleImageFile={multipleImageFile}
                            values={value}
                            setValues={setValues}
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            setMultipleImageFile={setMultipleImageFile}
                             />
                        
                </Form>
            </Modal>

        </div>
    )
}


export default ManualEntry;