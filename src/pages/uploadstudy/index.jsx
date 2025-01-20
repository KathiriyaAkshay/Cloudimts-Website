import React, { useState, useRef } from 'react';
import { UploadOutlined, SelectOutlined, ClearOutlined } from '@ant-design/icons';
import { message, Upload, Button, Spin, Flex, Progress } from 'antd';
import { useEffect } from 'react';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_APP_BE_ENDPOINT;

const UploadStudyImages = () => {

    const UploadRef = useRef(null);
    const navigation = useNavigate();
    const { changeBreadcrumbs } = useBreadcrumbs()
    const [allSelectImages, setAllSelectImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [patientInformation, setPatientInformation] = useState(undefined) ; 
    const [patientInformationLoading, setPatientInformationLoading] = useState(false) ;
    const [uploadingPercentage, setUploadPercentage] = useState(0) ;  

    useEffect(() => {
        changeBreadcrumbs([{ name: 'Upload DICOM images' }])
    }, []);

    const FetchPatientInformation = async () => {
        setPatientInformationLoading(true) ; 
        const token = localStorage.getItem("token");
        const formValue = new FormData();
        formValue.append("file", allSelectImages[0]?.originFileObj);

        var requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formValue,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${BASE_URL}image/v1/dicom_attr_fetch`, requestOptions);
            const result = await response.json();

            if (response?.status == 200) {
                setPatientInformation(result?.data) ;
            } else {
                message.warning(result?.message);
            }
        } catch (error) {
            console.log('error', error);
        }
        setPatientInformationLoading(false);
    }

    useEffect(() => {
        if (allSelectImages?.length > 0 && patientInformation == undefined && patientInformationLoading == false){
            FetchPatientInformation() ; 
        }

    }, [patientInformation, allSelectImages, patientInformation])


    const props = {
        name: 'file',
        multiple: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                setAllSelectImages([...allSelectImages, info.file])
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                // message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const UploadStudyHandler = async () => {
        if (allSelectImages?.length == 0) {
            message.warning("Please, Select at least one dicom image for upload");
        } else {
            try {
                setLoading(true);
                setUploadPercentage(0) ; 
                let completedUploads = 0; // Track the number of completed uploads
                const totalFiles = allSelectImages.length; // Total number of 
                
                const updateProgress = () => {
                    const percentage = Math.round((completedUploads / totalFiles) * 100);
                    setUploadPercentage(percentage) ; 
                };
    
                for (const element of allSelectImages) {
                    const token = localStorage.getItem("token");
                    const formValue = new FormData();
                    formValue.append("file", element?.originFileObj);
    
                    var requestOptions = {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formValue,
                        redirect: 'follow'
                    };
    
                    try {
                        const response = await fetch(`${BASE_URL}image/v1/dicom_upload`, requestOptions);
                        const result = await response.json();
    
                        if (response?.status == 200) {
                            completedUploads += 1; 
                            updateProgress() ; 
                            // message.success("Image uploaded successfully")
                        } else {
                            message.warning(result?.message);
                        }
                    } catch (error) {
                        console.log('error', error);
                    }
                }
    
                setLoading(false);
                setAllSelectImages([]);
                setPatientInformation(undefined) ;
                if (completedUploads == totalFiles){
                    message.success("Study uploaded successfully") ; 
                    navigation("/studies") ; 
                }
            } catch (error) {
                setLoading(false); 
                setUploadPercentage(0) ; 
                setAllSelectImages([]) ; 
                setPatientInformation(undefined);
                message.error("Unable to upload the study. Please try again.    ") ; 
            }

        }
    }

    return (
        <div>

            <Spin spinning={loading}>
                <div className='w-100'>

                    {patientInformation !== undefined && (
                        <Flex style={{cursor: "pointer", width: "fit-content", marginBottom: 6}}>

                            {/* Patient name information  */}
                            <Flex style={{marginTop: -10, fontSize: 15}}>
                                <div style={{fontWeight: 600}}>Patient Name : </div>
                                <div>&nbsp; {patientInformation?.patient_name?.map((element) => element).join("")}</div>
                            </Flex>

                            <Flex style={{marginTop: -10, 
                                fontSize: 15, 
                                marginLeft: 6,
                                marginRight: 6, 
                                fontWeight: 600
                            }}>
                                <div>|</div>
                            </Flex>
                            

                            {/* Modality information  */}
                            <Flex style={{marginTop: -10, fontSize: 15}}>
                                <div style={{fontWeight: 600}}>Modality : </div>
                                <div>&nbsp; {patientInformation?.modality}</div>
                            </Flex>

                        </Flex>
                    )}

                    {loading && (
                        <div style={{marginBottom: 5}}>
                            <Progress 
                                percent={uploadingPercentage}
                                status={uploadingPercentage == 100?"success":"active"}/>
                        </div>
                    )}    
                    

                    <Button onClick={UploadStudyHandler} type='primary' style={{ float: "right" }} icon={<UploadOutlined />}>Upload Study</Button>

                    {allSelectImages?.length !== 0 && (
                        <Button danger 
                            onClick={() => { 
                                setAllSelectImages([]) ; 
                                setPatientInformation(undefined) ; 
                            }} 
                            type='primary' style={{ float: "right", marginRight: "1rem" }} icon={<ClearOutlined />}>
                            Clear all images
                        </Button>
                    )}
                </div>

                <div className='w-100'>
                    
                    {/* ====== DICOM Image uploader handler =========  */}

                    <Upload className='dicom-upload-image-drawer'
                        {...props}
                        fileList={allSelectImages}
                        onChange={({ fileList }) => setAllSelectImages(fileList)}
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        directory
                        multiple
                        >
                        <Button className='upload-directory-option-button' icon={<SelectOutlined />}>Select Folder</Button>
                    </Upload>
            
                </div>
            </Spin>
        </div>
    )
}

export default UploadStudyImages; 