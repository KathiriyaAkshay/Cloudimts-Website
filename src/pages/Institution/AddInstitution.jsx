import React, { useEffect, useState } from 'react'

import {
  Steps,
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  DatePicker,
  Switch,
  Select,
  Spin,
  InputNumber,
  Modal
} from 'antd'

import { useNavigate, useParams } from 'react-router-dom'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import TableWithFilter from '../../components/TableWithFilter'
import API from '../../apis/getApi'
import NotificationMessage from '../../components/NotificationMessage'
import dayjs from 'dayjs'
import {
  getRadiologistList,
  updateBlockUsers,
  updateInHouseUser
} from '../../apis/studiesApi'
import CustomReportHeaderGenerator from './Popup'

const { Step } = Steps

const AddInstitution = () => {
  const { id } = useParams() ; 

  const { changeBreadcrumbs } = useBreadcrumbs()

  const [currentStep, setCurrentStep] = useState(0)
  const [tableData, setTableData] = useState([])
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [payload, setPayload] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [radiologistOptions, setRadiologistOptions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [reportSettingModal, setReportSettingModal] = useState(false)
  const [institutionId, setInstitutionId] = useState(null)

  useEffect(() => {
    const crumbs = [{ name: <span style={{color:"#0052c6"}}>Institution</span>, to: '/institutions' }]

    crumbs.push({
      name: id ? 'Edit' : 'Add'
    })

    changeBreadcrumbs(crumbs)

      if (id) {
        retrieveInstitutionData()
        retrieveModalityData()
        retrieveRadiologistData()
      } else {
        retrieveModalityData()
        retrieveRadiologistData()
      }
}, [])

  const convertToInitialObject = data => {
    let initialObject = {}
    for (let i = 1; i <= 47; i++) {
      initialObject[`${i}_reporting_charge`] = data[i].reporting_charge
      initialObject[`${i}_communication_charge`] = data[i].communication_charge
    }
    return initialObject
  }

  const retrieveInstitutionData = async () => {
    setIsLoading(true)

    await API.post(
      '/institute/v1/institute-particular-details-fetch',
      { id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (res.data.status) {
          const modalityData = convertToInitialObject(res.data.data.modality)

          const formData = {
            ...res.data.data,
            ...modalityData,
            contract_valid_date: dayjs(res.data.data.contract_valid_date),
            radiologist: res.data?.blocked_user?.map(data => data.id),
            house_radiologist: res.data?.in_house_radiologist?.map(
              data => data.id
            ),
            institution_info_header:
              res.data.data?.report_settings?.institution_info_header,
            attach_qr_code: res.data.data?.report_settings?.attach_qr_code,
            show_patient_info:
              res.data.data?.report_settings?.show_patient_info?.with_border &&
              'TABLE_WITH_BORDER',
            modify_study_id: res.data?.data?.modify_study_id
          }
          form.setFieldsValue(formData)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })

      .catch(err => navigate('/not-found'))
    setIsLoading(false)
  }

  const retrieveModalityData = async () => { 
    const auth = 'Bearer ' + `${token}`
    await API.get('/institute/v1/institute-modality', {
      headers: { Authorization: auth }
    }).then(res => {
      if (res.data.status) {
        const resData = res.data.data.map(item => ({
          ...item,
          reporting_charge: 0,
          communication_charge: 0
        }))
        setTableData(resData) 
      } else {
        NotificationMessage(
          'warning',
          'Network request failed',
          res.data.message
        )
      }
    })
  }

  const retrieveRadiologistData = () => {
    getRadiologistList({ role_id: localStorage.getItem('role_id') }).then(
      res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            label: data.name,
            value: data.id
          }))
          setRadiologistOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      }
    )
  }

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(prevStep => prevStep - 1)
  }

  const convertToObject = data => {
    let modifiedObject = { modality: {} }
    for (let i = 1; i <= tableData.length; i++) {
      modifiedObject.modality[i] = {
        reporting_charge: data[`${i}_reporting_charge`],
        communication_charge: data[`${i}_communication_charge`]
      }
    }
    return modifiedObject
  }

  const handleSubmit = async values => {
    if (currentStep === 0) {
      const resData = {
        ...values,
        contract_valid_date: values.contract_valid_date.format('YYYY-MM-DD'),
        active_status: values.active_status ? values.active_status : false,
        active_whatsapp: values.active_whatsapp
          ? values.active_whatsapp
          : false,
        allow_offline_download: values.allow_offline_download
          ? values.allow_offline_download
          : false
      }
      setPayload(resData)
      if (id) {

        setIsLoading(true) ; 

        await API.post(
          '/institute/v1/institute-details-update',
          { ...resData, id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', res.data.message)
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', 'Network request failed',err?.response?.data?.message)
          )
        setIsLoading(false)
      }

      handleNextStep() ; 

    } else if (currentStep === 1) {
      setPayload(prev => ({ ...prev, ...convertToObject(values) }))
      
      if (id) {
        setIsLoading(true)
        await API.post(
          '/institute/v1/institute-modality-update',
          {
            id: id,
            modality_details: { ...convertToObject(values).modality }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', res.data.message)
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', 'Network request failed', err?.response?.data?.message)
          )
        setIsLoading(false)
      }

      handleNextStep()

    } else if (currentStep === 2) {

      setPayload(prev => ({
        ...prev,
        report_setting: {
          institution_info_header: values.institution_info_header
            ? values.institution_info_header
            : false,
          attach_qr_code: values.attach_qr_code ? values.attach_qr_code : false,
          show_patient_info: {
            with_border:
              values.show_patient_info === 'TABLE_WITH_BORDER' ? true : false
          }
        }
      }))

      if (id) {

        setIsLoading(true)
        await API.post(
          '/institute/v1/institute-report-setting-update',
          {
            institution_id: id,
            institution_info_header: values.institution_info_header
              ? values.institution_info_header
              : false,
            attach_qr_code: values.attach_qr_code
              ? values.attach_qr_code
              : false,
            with_border:
              values.show_patient_info === 'TABLE_WITH_BORDER' ? true : false
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', res.data.message)
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err => {
            NotificationMessage('warning', 'Network request failed', err?.response?.data?.message)
          })
        setIsLoading(false)
      }
      handleNextStep() ; 

    } else if (currentStep === 3) {
      setPayload(prev => ({
        ...prev,
        modify_study_id: values?.modify_study_id
          ? values?.modify_study_id
          : false
      }))
      if (id) {
        setIsLoading(true)
        await API.post(
          '/institute/v1/institution-studyID-update',
          {
            id: id,
            study_uid_option: values?.modify_study_id
              ? values?.modify_study_id
              : false
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', res.data.message)

              console.log(res)
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err => {
            NotificationMessage('warning', 'Network request failed', err?.response?.data?.message)
          })
        setIsLoading(false)
      }
      handleNextStep()
    } else if (currentStep === 4) {
      setPayload(prev => ({
        ...prev,
        blocked_user: { data: values.radiologist ? values.radiologist : [] }
      }))
      if (id) {
        updateBlockUsers({
          id: id,
          blocked_user: {
            data: values.radiologist ? values.radiologist : []
          }
        })
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', res.data.message)
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err => {
            NotificationMessage('warning', 'Network request failed', err?.response?.data?.message)
          })
      }
      handleNextStep()
    } else if (currentStep === 5) {
      setPayload(prev => ({
        ...prev,
        house_radiologist: {
          data: values.house_radiologist ? values.house_radiologist : []
        }
      }))
      if (id) {

        updateInHouseUser({
          id: parseInt(id),
          in_house_radiologist: {
            data: values.house_radiologist ? values.house_radiologist : []
          }
        })
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'Institute Updated Successfully')
              navigate('/institutions')
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err => {
            NotificationMessage('warning', 'Network request failed', err?.response?.data?.message)
          })
      
        } else {
        setIsLoading(true)
        await API.post(
          '/institute/v1/institute-create',
          {
            ...payload,
            house_radiologist: {
              data: values.house_radiologist ? values.house_radiologist : []
            }
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'Institution Created Successfully')
              form.resetFields()
              navigate('/institutions')
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', err.response.data.message)
          )
        setIsLoading(false)
      }
    }
    setIsModalOpen(false)
  }


  const reportColumns = [
    {
      title: 'Report Options',
      dataIndex: 'report_option'
    },

    {
      title: 'Value for institution',
      dataIndex: 'report_option_value',

      render: (text, record) => {
        if (record.value_field === 'switch') {
          return {
            children: (
              <Form.Item name={record.report_value} valuePropName='checked'>
                <Switch />
              </Form.Item>
            )
          }
        } else if (record.value_field === 'select') {
          return {
            children: (
              <Form.Item name={record.report_value} className='category-select'>
                <Select
                  placeholder='Select Value'
                  options={[
                    { label: 'TABLE_WITH_BORDER', value: 'TABLE_WITH_BORDER' }
                  ]}
                />
              </Form.Item>
            )
          }
        } else if (record.value_field === 'edit-option') {
          return {
            children: (
              <Button
                type='primary'
                style={{ backgroundColor: '#f5f5f5' }}
                onClick={OpenInstitutionReportSettingModal}
              >
                Update
              </Button>
            )
          }
        } else {
          return {
            children: (
              <Form.Item name={record.report_value}>
                {' '}
                <Input />
              </Form.Item>
            )
          }
        }
      }
    }
  ]

  const reportTableData = [
    {
      report_option: 'Attach institution info to report header',
      report_option_value: false,
      value_field: 'switch',
      report_value: 'institution_info_header'
    },
    {
      report_option: 'Attach QR Code to report',
      report_option_value: false,
      value_field: 'switch',
      report_value: 'attach_qr_code'
    },
    {
      report_option: 'Show patient info as',
      report_option_value: '',
      value_field: 'select',
      report_value: 'show_patient_info'
    },
    ...(id !== null && id !== undefined
      ? [
          {
            report_option: 'Report dataset',
            report_option_value: false,
            value_field: 'edit-option',
            report_value: 'report_dataset_value'
          }
        ]
      : [])
  ]

  const uploadSettingsColumns = [
    {
      title: 'Upload Option',
      dataIndex: 'upload_option'
    },

    {
      title: 'Value',
      dataIndex: 'value',
      render: (text, record) => (
        <Form.Item name={'modify_study_id'} valuePropName='checked'>
          <Switch />
        </Form.Item>
      )
    }
  ]

  const uploadSettingsData = [
    {
      upload_option: 'Modify Study seriesId for Re-upload ',
      value: false
    }
  ]

  const validateInput = (rule, value, callback) => {
    if (value !== undefined && value !== null && isNaN(value)) {
      callback('Please enter a valid number')
    } else {
      callback()
    }
  }

  const OpenInstitutionReportSettingModal = () => {
    setInstitutionId(id)
    setReportSettingModal(true)
  }

  return (
    <div className='secondary-table'>
      
      <Card>
      <div
          style={{
            marginLeft: "0.7rem",
            marginBottom: "1.3rem",
            fontWeight: "600",
            fontSize: "1rem",
            color: "#00a0e3",
            position: "absolute",
            left: 0,
            bottom: 0,
            zIndex: 999,
          }}>

            <div style={{ cursor: "pointer" }} onClick={() => setCurrentStep(4)}>
              Skip To Last
            </div>
          
        </div>
        <Spin spinning={isLoading}>
          <Steps current={currentStep} className='mb'>
            <Step title='Basic Info' />
            <Step title='Modality Charges' />
            <Steps title='Report Settings' />
            <Steps title='Upload Settings' />
            <Steps title='Blocked Users' />
            <Steps title='In house Radiologist' />
          </Steps>

          {currentStep === 0 && (
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
              style = {{marginTop : "25px"}}
            >
              <Row gutter={15}>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='name'
                    label='Institution'
                    rules={[
                      {
                        whitespace: true,
                        required: true,
                        message: 'Please enter institution name'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Institution name' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='email'
                    label='Email Address'
                    rules={[
                      {
                        type: 'email',
                        required: true,
                        message: 'Please enter valid email'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Email' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='contact'
                    label='Contact Number'
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter contact number'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Contact Number' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='contract_valid_date'
                    label='Contract Valid Till'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter valid date'
                      }
                    ]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='city'
                    label='City'
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter city'
                      }
                    ]}
                  >
                    <Input placeholder='Enter City' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='state'
                    label='State'
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter state'
                      }
                    ]}
                  >
                    <Input placeholder='Enter State' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='country'
                    label='Country'
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter country'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Country' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name='website'
                    label='Website'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter website name'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Website' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name='address'
                    label='Address'
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter address'
                      }
                    ]}
                  >
                    <Input.TextArea placeholder='Enter Address' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name='allocated_storage'
                    label='Storage Allocated in MB'
                    rules={[
                      {
                        required: true,
                        message: 'Enter storage allocated Limit',
                        validator: validateInput
                      }
                    ]}
                  >
                    <InputNumber placeholder='Enter storage allocated Limit' type='number' />
                  </Form.Item>
                </Col>
                <Col xs={4} sm={4} md={4} lg={2}>
                  <Form.Item
                    name='active_status'
                    label='Active'
                    valuePropName='checked'
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={4} sm={4} md={4} lg={3}>
                  <Form.Item
                    name='active_whatsapp'
                    label='Active Whatsapp'
                    valuePropName='checked'
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={4} sm={4} md={4} lg={4}>
                  <Form.Item
                    name='allow_offline_download'
                    label='Allow Offline Download'
                    valuePropName='checked'
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} className='justify-end'>
                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) setIsModalOpen(true)
                      else form.submit()
                    }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>
                  {id && (
                    <Button
                      type='primary'
                      onClick={() => handleNextStep()}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          )}

          {currentStep === 1 && (
            <Form
              labelCol={{
                span: 24
              }}
              wrapperCol={{
                span: 24
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row>

                <Col xs={24} sm={24} md={24} lg={24}>

                  <div className='modality-card-wrapper' >

                    {tableData.map((element) => {
                      return(
                        <Card className='particular-modality-info-division' title = {element.name} style={{width: "fit-content",marginTop:"0.3rem"}} headerBg="#00ff00">
                          
                          <div className='particular-modality-charges-title'>Reporting charge</div>
                          <Form.Item name={`${element.id}_reporting_charge`} initialValue={element.reporting_charge}>
                            <Input />
                          </Form.Item>

                          <div className='particular-modality-charges-title'>Communication charge</div>
                          <Form.Item name={`${element.id}_communication_charge`} initialValue={element.communication_charge}>
                            <Input />
                          </Form.Item>
                        </Card> 
                      )
                    })}

                  </div>
                </Col>
                
                <Col xs={24} sm={24} md={24} lg={24} className='justify-end mt'>
                 
                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option'>
                    Previous
                  </Button>

                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) setIsModalOpen(true)
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>
                  {id && (
                    <Button
                      type='primary'
                      onClick={() => handleNextStep()}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          )}

          {currentStep === 2 && (
            <Form
              labelCol={{
                span: 24
              }}
              wrapperCol={{
                span: 24
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={30}>
                <Col lg={24} md={24} sm={24}>
                  <TableWithFilter
                    tableColumns={reportColumns}
                    tableData={reportTableData}
                    pagination
                  />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} className='justify-end mt'>
                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option'>
                    Previous
                  </Button>
                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) setIsModalOpen(true)
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>
                  {id && (
                    <Button
                      type='primary'
                      onClick={() => handleNextStep()}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          )}

          {currentStep === 3 && (
            <Form
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={30}>
                <Col lg={24} md={24} sm={24}>
                  <TableWithFilter
                    tableColumns={uploadSettingsColumns}
                    tableData={uploadSettingsData}
                    pagination
                  />
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} className='justify-end mt'>
                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option'>
                    Previous
                  </Button>

                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) setIsModalOpen(true)
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>

                  {id && (
                    <Button
                      type='primary'
                      onClick={() => handleNextStep()}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          )}

          {currentStep === 4 && (
            <Form
              labelCol={{
                span: 24
              }}
              wrapperCol={{
                span: 24
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={30}>
                <Col lg={12} md={12} sm={12}>
                  <Form.Item
                    label='Choose Radiologist'
                    name='radiologist'
                    rules={[
                      {
                        required: false,
                        message: 'Please select radiologist'
                      }
                    ]}
                  >
                    <Select
                      placeholder='Select Radiologist'
                      options={radiologistOptions}
                      showSearch
                      mode='multiple'
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col lg={24} md={24} sm={24} className='justify-end'>
                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option'>
                    Previous
                  </Button>
                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) setIsModalOpen(true)
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>
                  {id && (
                    <Button
                      type='primary'
                      onClick={() => handleNextStep()}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          )}

          {currentStep === 5 && (
            <Form
              labelCol={{
                span: 24
              }}
              wrapperCol={{
                span: 24
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={30}>
                <Col lg={12} md={12} sm={12}>
                  <Form.Item
                    label='Choose Radiologist'
                    name='house_radiologist'
                    rules={[
                      {
                        required: false,
                        message: 'Please select radiologist'
                      }
                    ]}
                  >
                    <Select
                      placeholder='Select Radiologist'
                      options={radiologistOptions}
                      showSearch
                      mode='multiple'
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col
                  lg={24}
                  md={24}
                  sm={24}
                  className='justify-end display-flex'
                >
                  <div className='w-100 d-flex justify-content-end'>
                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option' style={{marginRight:"0.4rem"}}>
                    Previous
                  </Button>
                  <Button type='primary' htmlType='submit'>
                    Submit
                  </Button>
                  </div>
                 
                </Col>
              </Row>
            </Form>
          )}
        </Spin>
      </Card>

      <Modal
        centered
        title='Confirmation'
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText='Update & Next'
      >
        <p>Are you sure you want to update this details?</p>
      </Modal>

      {reportSettingModal && (
        <CustomReportHeaderGenerator
          institutionId={institutionId}
          isModalOpen={setReportSettingModal}
        />
      )}
    </div>
  )
}

export default AddInstitution
