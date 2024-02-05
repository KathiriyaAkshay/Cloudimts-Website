import { Col, DatePicker, Form, Input, Modal, Row, Spin, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { getStudyData, updateStudyData } from '../../apis/studiesApi'
import NotificationMessage from '../NotificationMessage'
import dayjs from 'dayjs'
import { descriptionOptions } from '../../helpers/utils'

const EditStudy = ({
  isEditModalOpen,
  setIsEditModalOpen,
  studyID,
  setStudyID, 
  referenceId
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()

  // **** Retervie particular study information **** // 

  const retrieveStudyData = () => {
    setIsLoading(true)
    getStudyData({ id: studyID })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data
          const modifiedData = {
            patient_id: referenceId,
            patient_name: resData?.Patient_name,
            accession_number: resData?.Accession_number,
            study_description: resData?.Study_description,
            dob:
              resData.DOB !== ''
                ? resData.DOB && dayjs(resData.DOB, 'DD/MM/YYYY')
                : '',
            gender: resData?.Gender,
            referring_physician: resData?.Referring_physician_name
          }
          form.setFieldsValue(modifiedData)
        } else {
          NotificationMessage(
            'warning',
            'Edit study',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Edit study',
          err.response.data.message
        )
      )
    setIsLoading(false)
  }

  useEffect(() => {
    if (studyID && isEditModalOpen) {
      retrieveStudyData()
    }
  }, [studyID])


  const handleSubmit = values => {

    let  modifiedData = {
      ...values,
      id: studyID,
      dob: values.dob !== '' ? values.dob.format('DD/MM/YYYY') : '',
      study_history:
        values?.study_history == undefined ? '' : values?.study_history
    } ; 

    if (values?.study_description === null){
      modifiedData = {...modifiedData, study_description: " "}
    }

    updateStudyData(modifiedData)
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Study details updated Successfully')
          setStudyID(null)
          setIsEditModalOpen(false)
          form.resetFields()
        } else {
          NotificationMessage(
            'warning',
            'Edit study',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Edit study',
          err.response.data.message
        )
      )
  }

  const GenderSelectionOption = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ]

  return (
    <Modal
      title='Edit Study'
      open={isEditModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setStudyID(null)
        setIsEditModalOpen(false)
      }}
      width={1000}
      centered
    >
      <Spin spinning={isLoading}>
        <Form
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 24
          }}
          form={form}
          onFinish={handleSubmit}
          className='mt'
        >
          <Row gutter={15}>
            {/* ==== Patient id ====  */}

            <Col lg={12}>
              <Form.Item
                name='patient_id'
                label="Patient's Id"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Patient's Id"
                  }
                ]}
              >
                <Input placeholder="Enter Patient's Id" disabled />
              </Form.Item>
            </Col>

            {/* ==== Patient name ====  */}

            <Col lg={12}>
              <Form.Item
                name='patient_name'
                label="Patient's Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Patient's Name"
                  }
                ]}
              >
                <Input placeholder="Enter Patient's Name" />
              </Form.Item>
            </Col>

            {/* ==== Accession number ====  */}

            <Col lg={12}>
              <Form.Item
                name='accession_number'
                label='Accession Number'
                rules={[
                  {
                    whitespace: true,
                    message: 'Please enter Accession Number'
                  }
                ]}
              >
                <Input placeholder='Enter Accession Number' />
              </Form.Item>
            </Col>

            {/* ==== Date of brith information ====  */}

            <Col lg={12}>
              <Form.Item
                name='dob'
                label='Date of Birth'
              >
                <DatePicker format={'DD/MM/YYYY'} />
              </Form.Item>
            </Col>

            {/* ==== Study description ====  */}

            <Col lg={12}>
              <Form.Item
                name='study_description'
                label='Description'
                className='category-select'
                rules={[
                  {
                    whitespace: true,
                    message: 'Please enter Description'
                  }
                ]}
              >
                <Select
                  placeholder='Select Study Description'
                  options={descriptionOptions}
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col lg={12}>
              <Form.Item
                name='study_history'
                label='study History'
                rules={[
                  {
                    whitespace: true,
                    message: 'Please, Enter Study History'
                  }
                ]}
              >
                <Input placeholder='Enter Study History' />
              </Form.Item>
            </Col>

            {/* ==== Gender information ====  */}

            <Col lg={12}>
              <Form.Item
                name='gender'
                label='Gender'
                rules={[
                  {
                    whitespace: true,
                    message: 'Please enter Gender'
                  }
                ]}
              >
                <Select
                  placeholder='Select Gender'
                  options={GenderSelectionOption}
                  showSearch
                  className='category-select'
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            {/* ==== Referring Physician information =====  */}

            <Col lg={12}>
              <Form.Item
                name='referring_physician'
                label='Referring Physician'
                rules={[
                  {
                    whitespace: true,
                    message: 'Please enter Referring Physician'
                  }
                ]}
              >
                <Input placeholder='Enter Referring Physician' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default EditStudy
