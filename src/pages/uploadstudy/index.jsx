import React, { useState } from 'react';
import { InboxOutlined, UploadOutlined, SelectOutlined } from '@ant-design/icons';
import { message, Upload, Button, Spin } from 'antd';
const { Dragger } = Upload;


const UploadStudyImages = () => {

    const [allSelectImages, setAllSelectImages] = useState([]) ; 
    const [loading, setLoading] = useState(false) ; 

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
        if (allSelectImages?.length == 0){
            message.warning("Please, Select at least one dicom image for upload") ; 
        }   else {
            
            const username = 'orthanc';
            const password = 'orthanc';
            const basicAuth = 'Basic ' + btoa(username + ':' + password);
            
            const formValue = new FormData() ; 
            allSelectImages?.map((element) => {
                formValue.append("file", element) ; 
            })

            var requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': basicAuth,
                    'Content-Type': 'application/json'
                },
                body: formValue,
                redirect: 'follow'
            };

            fetch("https://viewer.cloudimts.com/instances/", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));


        }
    }

    return(
        <div>

            <Spin spinning = {loading}>

                <div className='upload-directory-upload-option'>
                    {/* Upload directory option button  */}
                    <Upload  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" directory>
                        <Button className='upload-directory-option-button' icon={<SelectOutlined />}>Select Folder</Button>
                    </Upload>
                
                    <Button onClick={UploadStudyHandler} type='primary' style={{marginLeft: "auto"}} icon={<UploadOutlined />}>Upload Study</Button>
                
                </div>

                {/* Upload dicom image selector optoin  */}
                <Dragger {...props} className='dicom-upload-image-drawer'>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-hint" style = {{color: "#000000"}}>
                        Please select dicom images for upload study
                    </p>
                </Dragger>
            </Spin> 
        </div>
    )
}

export default UploadStudyImages ; 