import React, { useState } from "react";
import { Button, Spin } from "antd";
import { UploadOutlined, SelectOutlined, ClearOutlined } from '@ant-design/icons';

const UploadNormalImages = () => {
    const [uploading, setUploading] = useState(false) ; 
    return(
        <div>
            <Spin spinning = {uploading}>

                <div className='w-100'>
                    <Button type='primary' style={{ float: "right" }} icon={<UploadOutlined />}>Upload</Button>
                </div>

                
            </Spin>


        </div>
    )
}

export default UploadNormalImages ; 