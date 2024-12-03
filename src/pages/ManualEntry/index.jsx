import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Col, Row, Space, Table, Spin, Modal, Select } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import UploadImage from '../../components/UploadImage';
import "./index.scss" ; 
import APIHandler from '../../apis/apiHandler';
import { render } from 'react-dom';
import NotificationMessage from '../../components/NotificationMessage';
import { FaPage4 } from 'react-icons/fa';
import { uploadImage } from '../../apis/studiesApi';
import { useNavigate } from 'react-router-dom';


const ManualEntry = () => {
    const navigation = useNavigate() ; 
    const [value, setValues] = useState([]);
    const [userInformation, setUserInformation] = useState({});
    const [showManualEntry,setShowManualEntry]=useState(false);
    const [uploadingStudy, setUploadingStudy] = useState(false);

    const modality=[
        { value: 'CT', label: 'CT' },
        { value: 'CR', label: 'CR' },
        { value: 'MR', label: 'MR' },
        { value: 'DX', label: 'DX' },
        { value: 'DR', label: 'DR' },
        { value: 'SC', label: 'SC' },
        { value: 'MG', label: 'MG' },
        { value: 'US', label: 'US' },
        { value: 'SEG', label: 'SEG' },
        { value: 'OT', label: 'OT' },
        { value: 'ECG', label: 'ECG' },
        { value: 'EPS', label: 'EPS' },
        { value: 'TG', label: 'TG' },
        { value: 'SR', label: 'SR' },
        { value: 'PR', label: 'PR' },
        { value: 'XA', label: 'XA' },
        { value: 'RF', label: 'RF' },
        { value: 'BI', label: 'BI' },
        { value: 'CD', label: 'CD' },
        { value: 'DD', label: 'DD' },
        { value: 'DG', label: 'DG' },
        { value: 'ES', label: 'ES' },
        { value: 'LS', label: 'LS' },
        { value: 'PT', label: 'PT' },
        { value: 'RG', label: 'RG' },
        { value: 'ST', label: 'ST' },
        { value: 'RTIMAGE', label: 'RTIMAGE' },
        { value: 'RTDOSE', label: 'RTDOSE' },
        { value: 'RTSTRUCT', label: 'RTSTRUCT' },
        { value: 'RTPLAN', label: 'RTPLAN' },
        { value: 'RTRECORD', label: 'RTRECORD' },
        { value: 'HC', label: 'HC' },
        { value: 'NM', label: 'NM' },
        { value: 'IO', label: 'IO' },
        { value: 'PX', label: 'PX' },
        { value: 'GM', label: 'GM' },
        { value: 'SM', label: 'SM' },
        { value: 'XC', label: 'XC' },
        { value: 'AU', label: 'AU' },
        { value: 'EPS', label: 'EPS' },
        { value: 'HD', label: 'HD' },
        { value: 'IVUS', label: 'IVUS' },
        { value: 'OP', label: 'OP' },
        { value: 'SMR', label: 'SMR' }
    ];
    // Manual entry related form 
    const [form] = Form.useForm();
    const [patientSeriesForm] = Form.useForm() ; 

    const LoadUserInformation = async () => {
        let responseData = await APIHandler("POST", {}, "owner/v1/user_details_fetch") ;
        if (responseData?.status){
            setUserInformation({...responseData?.data}) ; 
            form.setFieldsValue({
                institution_name: responseData?.data?.institution_name
            });
        }
    }

    function generateRandomString() {
        function generateSegment() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(8).substring(1);
        }
    
        return `${generateSegment()}${generateSegment()}-${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}-${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}-${generateSegment()}${generateSegment()}-${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}${generateSegment()}d`;
    }

    function generateRandomIdentifier() {
        function generateSegment() {
            return Math.floor(Math.random() * 100000).toString();
        }
    
        return `1.${generateSegment()}.${generateSegment()}.${generateSegment()}.${generateSegment()}.${generateSegment()}.${generateSegment()}.${generateSegment()}.${generateSegment()}.${generateSegment()}`;
    }

    useEffect(() => {
        LoadUserInformation() ; 
    }, []) ; 

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const DeleteSeriesOptionHandler = async (id) => {
        setPatientSeriesData((prev) =>
            prev?.map((element) => {
                if (element?.id !== id) {
                    return { ...element };
                } else {
                    return null; // Return null for elements you want to remove
                }
            }).filter(Boolean) // Filter out null or undefined values
        );
    }

    const [editId, setEditId] = useState(null) ; 
    const EditSeriesOptionHandler = async (id) => {
        setShowManualEntry(true);
        const element = patientSeriesData?.find((element) => element?.id === id);
        patientSeriesForm.resetFields() ; 
        patientSeriesForm.setFieldsValue({
            series_description: element?.study_description, 
            modality: element?.modality
        }); 
        setValues([...element?.study_images]) ; 
        setEditId(id) ; 
        setIsModalOpen(true) ; 
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => (
                `${index + 1}`
            )
        },
        {
            title: 'Session Description',
            dataIndex: 'study_description',
            key: 'session_desc',
            render: (text, record) => {
                return(
                    <span style={{
                        fontWeight: 600
                    }}>
                        {text}
                    </span>
                )
            }
        },
        {
            title: 'Modality',
            dataIndex: 'modality',
            key: 'modality',
        },
        {
            title: "Images", 
            dataIndex: "", 
            render: (text, record) => {
                let count = patientSeriesData?.find((element) => element?.id === record?.id) ;
                return(
                    <div>{count?.study_images?.length}</div>
                )
            }
        }, 
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => {EditSeriesOptionHandler(record?.id)}}>
                        <EditOutlined />
                    </Button>
                    
                    <Button danger onClick={() => {DeleteSeriesOptionHandler(record?.id)}}>
                        <DeleteOutlined/>
                    </Button>
                </Space>
            ),
        },
    ];

    const [patientSeriesData, setPatientSeriesData] = useState([]) ; 
    const [totalInsertSeies, setTotalInsertSeries] = useState(0) ; 
    const [imageFile, setImageFile] = useState([]) ; 

    const AddSeriesOptionHandler = async (values) => {
        if (editId == null){
            const fieldValue = form.getFieldsValue() ; 
            setPatientSeriesData([...patientSeriesData, {
                "study_description": fieldValue.description, 
                "modality": fieldValue.modality, 
                "study_images": value, 
                "id": totalInsertSeies, 
                "series_id": generateRandomString()
            }]); 
            setTotalInsertSeries((prev) => prev + 1) ; 
        }   else {
            setPatientSeriesData((prev) =>
                prev?.map((element) => {
                    if (element?.id === editId) {
                        return {
                            ...element, "study_description": values?.series_description, "modality": values?.modality,
                            "study_images": value
                        };
                    } else {
                        return { ...element };
                    }
                })
            );
        }
        setIsModalOpen(false) ; 
        setEditId(null) ; 
    }; 

    const UploadStudyOptionHandler = async (values) => {
        setUploadingStudy(true) ; 

        let studyId = generateRandomString(); 
        let studyUId = generateRandomIdentifier() ; 
        let totalSeries = [] ; 
        patientSeriesData?.map((element) => {
            totalSeries.push(element?.series_id)
        }) ; 

        let study_metadata = {
            "ID": studyId,
            "IsStable": true,
            "LastUpdate": "20230923T090010",
            "MainDicomTags": {
                "AccessionNumber": values?.accession_number,
                "StudyInstanceUID": studyUId
            },
            "ParentPatient": studyId,
            "PatientMainDicomTags": {
                "PatientID": values?.patient_id,
                "PatientName": values?.patient_name
            },
            "Series": totalSeries,
            "Type": "Study"
        } ; 

        if (patientSeriesData?.length == 0){
            NotificationMessage("warning", "Please, Add at least one series") ; 
     
        }   else {
            
            patientSeriesData?.map(async (element) => {
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            
                let series_metdata =  {
                    "ExpectedNumberOfInstances": "",
                    "ID": element?.series_id,
                    "Instances": [],
                    "IsStable": true,
                    "LastUpdate": formattedDate, // Update LastUpdate field with formattedDate
                    "MainDicomTags": {
                        "ImageOrientationPatient": "-0.04540329\\0.99896874\\0\\-0\\-0\\-1",
                        "Modality": element?.modality,
                        "SeriesDescription": "FLAIR",
                        "SeriesInstanceUID": "1.2.826.0.1.3680043.8.498.11080017939623954520316925248840896201",
                        "SeriesNumber": "401", 
                        "SeriesInformation": element?.study_description
                    },
                    "ParentStudy": study_metadata?.ID,
                    "Status": "Unknown",
                    "Type": "Series"
                }; 
            
                // Upload Series 
                let uploadSerisRequestPayload = {
                    "study_metadata": study_metadata, 
                    "series_metadata": series_metdata, 
                    "upload_start_time" : formattedDate, 
                    "manual_upload": true, 
                    "total_instance": 0
                }
                let uploadSeriesResponse = await APIHandler("POST", uploadSerisRequestPayload, "studies/v1/insert_new_studies");
                let dbSeriesId = uploadSeriesResponse?.series ; 

                if (uploadSeriesResponse?.status){
                    element?.study_images?.map(async (series_images) => {
                        let uploadImageResponse = await uploadImage({image: series_images?.url}) ;
                        
                        // Store series image
                        let storeSeriesImage = await APIHandler("POST", {
                            "series_id": dbSeriesId, 
                            "image": uploadImageResponse?.data?.image_url
                        }, "studies/v1/insert_series_image")
                    })
                }

                setUploadingStudy(false)
                NotificationMessage("success", "Upload Series successfully") ;
            });
            
            // navigation("/studies") ; 

        }

    }

    return (
        <div className='manual-entry-wrapper'>

            <div className='manual-entry p-2'>
                <Spin spinning={uploadingStudy}>
                    <div className='w-100 text-center header'>
                        <span style={{
                            fontWeight: 600
                        }}>Manual Entry</span>
                    </div>
                    <Form
                        form={form}
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
                        onFinish={UploadStudyOptionHandler} 
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className='manul-entry-form'
                        requiredMark = {true}
                        
                    >
                        <Row className='w-100'>
                            <Col span={12}>

                                {/* Patient name  */}
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
                                
                                {/* Patient id  */}
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
                                
                                {/* Study description information  */}
                                <Form.Item
                                    label="Description"
                                    name="description"
                                >
                                    <Input />
                                </Form.Item>

                                {/* Age information  */}
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
                                    <Input type='number' />
                                </Form.Item>
                                
                                {/* Modality information  */}
                                <Form.Item
                                    label="Modality"
                                    name="modality"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter Modality",
                                        },
                                    ]}
                                >
                                    <Select options={modality}>
                                     
                                    </Select>
                                </Form.Item>
                            </Col>
                            
                            {/* Institution name information  */}
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
                                    <Input disabled />
                                </Form.Item>

                                <Form.Item
                                    label="Accession Number"
                                    name="accession_number"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter Accession number",
                                        },
                                    ]}
                                >
                                    <Input placeholder='B199' />
                                </Form.Item>


                                <Form.Item
                                    label="Referring Physician"
                                    name="referring_physician"
                                >
                                    <Input />
                                </Form.Item>


                                <Form.Item
                                    label="Gender"
                                    name="gender"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select the patient's gender",
                                        },
                                    ]}
                                >
                                    <Select>
                                        <Select.Option value="male">Male</Select.Option>
                                        <Select.Option value="female">Female</Select.Option>
                                        <Select.Option value="other">Other</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="images"
                                    name="images"
                                    style={{ marginTop: "3rem" }}
                                >
                                    <Button onClick={() => {
                                        const values = form.getFieldsValue() ; 
                                        
                                        if (values?.description == undefined || values?.description == ""){
                                            NotificationMessage("warning", "Please, Enter Study description") ; 
                                            return ; 
                                        }   else if (values?.modality == undefined || values?.modality == ""){
                                            NotificationMessage("warning", "Please, Select Study modality") ; 
                                            return ; 
                                        }   else {
                                            setShowManualEntry(false);
                                            patientSeriesForm.resetFields();
                                            setValues([]);
                                            setIsModalOpen(true)
                                        }
                                        
                                    }}>
                                        Add Image Series
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                // span: 20,
                            }}
                        >
                            <Button type="primary" htmlType="submit"
                                onClick={(e) => { e.preventDefault(); form.submit() }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>

                    <Table 
                        columns={columns} 
                        dataSource={patientSeriesData} 
                        pagination={false} 
                    />
                </Spin>
            </div>

            {/* ==== Upload image related model =====  */}
            {isModalOpen && (
                <Modal 
                    title="Add Image Series" 
                    width={800} 
                    open={isModalOpen} 
                    onOk={() => { patientSeriesForm.submit() }} 
                    onCancel={handleCancel}
                    centered
                >
                    <Form
                        form={patientSeriesForm}
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: "100%",
                            padding: 10, 
                            paddingTop: 20
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={AddSeriesOptionHandler}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {/* <Form.Item
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
                            <Select options={modality}>
                            </Select>
                        </Form.Item> */}

                        <UploadImage
                            isAddImageSeries={true}
                            values={value}
                            setValues={setValues}
                            manualEntry={true}
                            showManualEntry={showManualEntry}
                            multipleImage = {true}
                            isManualSeriesUpload = {true}
                            setImageFile={setImageFile}
                        />

                    </Form>
                </Modal>
            )}

        </div>
    )
}


export default ManualEntry;