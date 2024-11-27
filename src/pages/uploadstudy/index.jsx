import React, { useState, useRef } from 'react';
import { UploadOutlined, SelectOutlined, ClearOutlined } from '@ant-design/icons';
import { message, Upload, Button, Spin } from 'antd';
import { useEffect } from 'react';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
const { Dragger } = Upload;
const BASE_URL = import.meta.env.VITE_APP_BE_ENDPOINT;

const UploadStudyImages = () => {

    const UploadRef = useRef(null);
    const [allSelectImages, setAllSelectImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { changeBreadcrumbs } = useBreadcrumbs()

    useEffect(() => {
        changeBreadcrumbs([{ name: 'Upload DICOM images' }])
    }, []);

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

            setLoading(true);

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
            UploadRef.current.clear();


        }
    }

    return (
        <div>

            <Spin spinning={loading}>
                <div className='w-100'>
                    <Button onClick={UploadStudyHandler} type='primary' style={{ float: "right" }} icon={<UploadOutlined />}>Upload Study</Button>

                    {allSelectImages?.length !== 0 && (
                        <Button danger onClick={() => { setAllSelectImages([]) }} type='primary' style={{ float: "right", marginRight: "1rem" }} icon={<ClearOutlined />}>
                            Clear all images
                        </Button>
                    )}
                </div>

                <div className='w-100'>
                    {/* Upload directory option button  */}
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