import {
  Col,
  Form,
  List,
  Modal,
  Radio,
  Row,
  Spin,
  Tag,
  Typography, 
  Select,
  Divider
} from 'antd'
import React, { useEffect, useState } from 'react'
import {
  submitNormalReportFile,
  uploadImage
} from '../../apis/studiesApi'
import UploadImage from '../UploadImage'
import NotificationMessage from '../NotificationMessage'
import { descriptionOptions } from '../../helpers/utils'

const FileReport = ({
  isFileReportModalOpen,
  setIsFileReportModalOpen,
  studyID,
  setReportModalOpen, 
  modalData
}) => {

  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const [imageFile, setImageFile] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [value, setValues] = useState([])

  // **** Submit simplified report option handle **** // 
  const submitReport = async (values, report_attach_data = []) => {

    await submitNormalReportFile({
      id: studyID,
      report_type: values.report_type,
      report_study_description: values.report_study_description,
      report_attach_data: report_attach_data
    })
      .then(res => {
        if (res.data.status) {
          form.resetFields()
          setIsFileReportModalOpen(false) ; 
          setReportModalOpen(false) ; 
          
          NotificationMessage('success', 'File Report Submitted Successfully')
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Network request failed',
          err.response.data.message
        )
      )
  }

  const handleSubmit = async (values) => {

    setIsLoading(true) ; 

    const report_attach_data = [] ; 

    try {

      for (const data of value){

        try {
  
          const formData = {image: data.url} ; 
          const res = await uploadImage(formData)
          report_attach_data.push(res.data.image_url)
  
        } catch (err) {}
      }
    } catch (error) {
      
    }
    
    try {
      await submitReport(values, report_attach_data)
    } catch (err) {
      NotificationMessage("warning", "Network request failed", "Failed to file Simplified report") ; 
    }
    
    setIsLoading(false) ; 
  }

  return (
    <Modal
      title='Simplified Report'
      open={isFileReportModalOpen}
      onOk={() => { form.submit() }}
      onCancel={() => { setIsFileReportModalOpen(false) }}
      width={1000}
      centered
      okText='Save Report'
      className='simplified-report-modal'
    >
      <Spin spinning={isLoading}>
        <div
          style={{
            background: '#ebf7fd',
            fontWeight: '600',
            padding: '10px 24px',
            borderRadius: '0px',
            margin: '0 -24px'
          }}
        >
          Patient Info
        </div>

        <List
          style={{ marginTop: '8px', height:"22vh" }}
          grid={{
            gutter: 5,
            column: 2
          }}
          className='queue-status-list h-9'
          dataSource={modalData?.filter(data => data.name !== 'urgent_case')}
          renderItem={item => (
            <List.Item className='queue-number-list'>
              <Typography
                style={{ display: 'flex', gap: '4px', fontWeight: '600',flexWrap:"wrap" }}
              >
                {item.name}:
                {item.name === "Patient id" ||
                item.name === "Patient Name" ||
                item.name === 'Study UID' ||
                item.name === 'Institution Name' ||
                item.name === 'Series UID' ? (
                  <Tag color='#87d068'>{item.value}</Tag>
                ) : (
                  <Typography style={{ fontWeight: '400' }}>
                    {item.value}
                  </Typography>
                )}
              </Typography>
            </List.Item>
          )}
        />
        <Divider />

        <Form
          className="simplied-report-input"
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 24
          }}
          form={form}
          onFinish={handleSubmit}
          style={{borderTop: "1px"}}
        >
          <Row gutter={15}>

            {/* ===== Report type information =====  */}
            
            <Col xs={24} md={12}>
              <Form.Item
                name='report_type'
                label='Report Result'
                rules={[
                  {
                    required: true,
                    message: 'Please select report result'
                  }
                ]}
              >
                <Radio.Group>
                  <Radio value={1}>Normal</Radio>
                  <Radio value={2}>Abnormal</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            {/* ==== Report study description information =====  */}
            
            <Col xs={24} lg={12}>
              <Form.Item
                name='report_study_description'
                label='Modality Study Description'
                rules={[
                  {
                    required: true,
                    message: 'Please, Select Study description'
                  }
                ]}
              >
                <Select
                  placeholder="Select Study Description"
                  options={descriptionOptions}
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            {/* ===== Report refernce images information =====  */}
            
            <Col xs={24} md={12}>
              <UploadImage
                values={value}
                setValues={setValues}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imageURL={imageURL}
                multipleImage={true}
              />
            </Col>

          </Row>
        </Form>

      </Spin>

    </Modal>
  )
}

export default FileReport
