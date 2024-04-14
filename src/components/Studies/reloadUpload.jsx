import React, { useEffect, useState } from "react";
import { Modal, Spin, Form, Row, Col , Input} from "antd";
import APIHandler from "../../apis/apiHandler";
import moment from "moment";
import NotificationMessage from "../NotificationMessage";

export default function ReUploadStudyModel({isModalOpen, setIsModalOpen, studyData}){
    const [loading, setLoading] = useState(false) ; 
    const [form] = Form.useForm(); 

    useEffect(() => {
        form.setFieldsValue({
            "patient_id": studyData?.patient_id, 
            "patient_name": studyData?.name
        })
    }, [isModalOpen]) ; 

    const ReUploadStudyOptionHandler = async (value) => {
        setLoading(true) ; 

        // Fetch study metadata information 
        let studyResponse = await APIHandler("POST", {"id": studyData?.id}, "studies/v1/study_metadata") ; 
        console.log(studyResponse);
        let tempSeriesId = studyResponse?.data?.series_metadata?.ID ; 

        // Insert new study 
        let currentTime = moment().format("YYYY-MM-DD HH:MM:SS") ; 
        let insertStudyPayload = {
            "study_metadata": studyResponse?.data?.study_metadata, 
            "series_metadata": studyResponse?.data?.series_metadata, 
            "upload_start_time": currentTime, 
            "patient_name": value?.patient_name, 
            "patient_id": value?.patient_id
        }; 
        let insertStudyResponse = await APIHandler("POST", insertStudyPayload, "studies/v1/insert_new_studies") ; 
        if (insertStudyResponse?.status == true){
            NotificationMessage(
                "success", 
                "Reupload study successfully", 
            ); 

            setIsModalOpen(false) ; 
        }

        // Insert study upload time information 

        setLoading(false) ; 
    }

    return(
        <Modal
            title = "Reupload study"
            centered
            open = {isModalOpen}
            onCancel={() => {setIsModalOpen(false)}}
            okText = {"Reupload"}
            onOk={() => {form.submit()}}
        >
            <Spin spinning = {loading}>
                <Form
                    labelCol={{
                        span: 24
                    }}
                    wrapperCol={{
                        span: 24
                    }}
                    form={form}
                    onFinish={ReUploadStudyOptionHandler}
                >
                    
                    {/* Update PatientID  */}
                    <Row gutter={15}>
                        <Col xs={24} lg={24} style={{ marginTop: '20px' }}>
                            <Form.Item
                            name='patient_id'
                            label='Change Patient ID'
                            rules={[
                                {
                                required: true,
                                message: 'Please, Enter updated patient id for reupload'
                                }
                            ]}
                            >
                            <Input placeholder='Enter PatientID' />
                            </Form.Item>
                        </Col>
                    </Row>
                            
                    {/* Update PatientName  */}
                    <Row gutter={15}>
                        <Col xs={24} lg={24} style={{ marginTop: '20px' }}>
                            <Form.Item
                            name='patient_name'
                            label='Change Patient Name'
                            rules={[
                                {
                                required: true,
                                message: 'Please, Enter updated patient name for reupload'
                                }
                            ]}
                            >
                            <Input placeholder='Enter PatientName' />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Spin>
        </Modal>
    )
}