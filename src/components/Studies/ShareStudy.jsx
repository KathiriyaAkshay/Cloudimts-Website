import React, { useEffect, useState } from 'react'
import { fetchEmailList, getStudyData, sendEmail } from '../../apis/studiesApi'
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  Tag,
  Typography
} from 'antd'
import { MdEmail, MdOutlineWhatsapp } from 'react-icons/md'
import NotificationMessage from '../NotificationMessage'
import APIHandler from '../../apis/apiHandler'
import { getMoreDetails } from '../../apis/studiesApi'
import API from '../../apis/getApi'
const ShareStudy = ({
  isShareStudyModalOpen,
  setIsShareStudyModalOpen,
  studyID,
  setStudyID,
  referenceId
}) => {
  const token = localStorage.getItem('token')

  const [modalData, setModalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [isNewEmailModalOpen, setIsNewEmailModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false)

  const [emailOptions, setEmailOptions] = useState([])
  const [form] = Form.useForm()
  const [studyData, setStudyData] = useState({})

  // **** Retervie particular study information **** // 
  const retrieveStudyData = () => {
    setIsLoading(true)
    getMoreDetails({ id: studyID })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data

          const modifiedData = [
            {
              name: "Patient id",
              value: referenceId
            },
            {
              name: "Study UID", 
              value: resData?.Study_UID
            }, 
            {
              name: "Series UID", 
              value: resData?.Series_UID
            }, 
            {
              name: "Patient Name",
              value: resData?.Patient_name
            },
            {
              name: "Institution",
              value: resData?.institution?.Institution_name
            },
            {
              name: 'Study Description',
              value: resData?.Study_description
            },

            {
              name: 'Modality',
              value: resData?.Modality
            }
          ]
          setModalData(modifiedData)
          setStudyData(resData)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
        setModalData(modifiedData);
        setStudyData(resData);
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Network request failed',
          err.response.data.message
        )
      )
    setIsLoading(false)
  }

  // **** Reterive email list option information **** // 

  const retrieveEmailOptions = () => {
    fetchEmailList()
      .then(res => {
        if (res.data.status) {
          const resData = res.data?.data?.map(data => ({
            label: data.email,
            value: data.email
          }))
          setEmailOptions(resData)
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
  useEffect(() => {
    if (studyID && isShareStudyModalOpen) {
      retrieveStudyData()
    }
  }, [studyID])

  useEffect(() => {
    if (isEmailModalOpen) {
      retrieveEmailOptions()
    }
  }, [isEmailModalOpen])

  useEffect(() => {
    if (isNewEmailModalOpen) {
      retrieveRoleOptions()
    }
  }, [isNewEmailModalOpen])

  // **** Email share option handler **** // 
  const handleSubmitEmail = async values => {
    setIsEmailSending(true)

    let requestPayload = {
      sender_email: values?.email,
      attach_dicom: values?.attach_dicom,
      study_id: studyID
    }

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'email/v1/email-share-option'
    )

    setIsEmailSending(false)
    setIsEmailModalOpen(false)

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed')
    } else if (responseData['status'] === true) {
      NotificationMessage('success', 'Email send successfully')
    } else {
      NotificationMessage('warning', responseData['message'])
    }
  }

  // **** Whatsapp share option handler **** // 
  const handleSubmitWhatsapp = async values => {

    setIsEmailSending(true)

    let requestPayload = {
      // sender_email: values?.email,
      // attach_dicom: values?.attach_dicom,
      // study_id: studyID
    }

    // let responseData = await APIHandler(
    //   'POST',
    //   requestPayload,
    //   'email/v1/email-share-option'
    // )

    setIsEmailSending(false)
    setIsWhatsappModalOpen(false)

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed')
    } else if (responseData['status'] === true) {
      NotificationMessage('success', 'Email send successfully')
    } else {
      NotificationMessage('warning', responseData['message'])
    }
  }

  const modalHeader = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: '50px'
      }}
    >
      <span>Share Study</span>
      <div>
        <Button style={{ background: 'transparent', border: '1px solid #fff' }}>
          <MdEmail
            className='action-icon'
            style={{ color: '#fff' }}
            onClick={() => setIsEmailModalOpen(true)}
          />
        </Button>

        <Button style={{ background: 'transparent', border: '1px solid #fff', marginLeft: "0.3rem" }}>
          <MdOutlineWhatsapp
            className='action-icon'
            style={{ color: '#fff' }}
            onClick={() => setIsWhatsappModalOpen(true)}
          />
        </Button>
      </div>


    </div>
  )
  
  // **** Add new email option handler **** // 
  const handleSubmit = async (values) => {

    if (values.active_status === undefined) {
      values.active_status = false
    }

    setIsLoading(true)
    await API.post('/email/v1/insert-email', values, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Email added successfully')
          form.resetFields()
          setIsNewEmailModalOpen(false);
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage("warning", "Network request failed"))
    setIsLoading(false)
  }

  // **** Reterive role option for add new email **** // 
  const retrieveRoleOptions = async () => {
    setIsLoading(true)
    await API.get('/email/v1/role-fetch', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(role => ({
            label: role.role_name,
            value: role.id
          }))
          setRoleOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed'))
    setIsLoading(false)
  }

  return (
    <>
      {/* ==== Email deails modal ====  */}

      <Modal
        title={modalHeader}
        open={isShareStudyModalOpen}
        onOk={() => {
          setStudyID(null)
          setIsShareStudyModalOpen(false)
        }}
        onCancel={() => {
          setStudyID(null)
          setIsShareStudyModalOpen(false)
        }}
        width={1200}
        centered
        footer={[]}
        className='share-study-modal'
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
            style={{ marginTop: '8px' }}
            grid={{
              gutter: 5,
              column: 2
            }}
            className='queue-status-list'
            dataSource={modalData}
            renderItem={item => (
              <List.Item
                className={`queue-number-list ${item.name === 'Series UID' || item.name === 'Study UID'
                  ? 'full-width'
                  : 'half-width'
                  }`}
              >
                <Typography
                  style={{ display: 'flex', gap: '4px', fontWeight: '600', flexWrap: "wrap" }}
                >
                  {item.name}:
                  {item.name === "Patient id" ||
                    item.name === "Patient Name" ||
                    item.name === "Institution" ||
                    item.name === "Study UID" ||
                    item.name === "Institution Name" ||
                    item.name === "Series UID" ||
                    item.name === "Assign study time" ||
                    item.name === "Assign study username" ? (
                    <Tag color="#87d068">{item.value}</Tag>
                  ) : (
                    <Typography style={{ fontWeight: '400' }}>
                      {item.value}
                    </Typography>
                  )}
                </Typography>
              </List.Item>
            )}
          />
        </Spin>
      </Modal>

      {/* ==== Share Email modal ====  */}

      <Modal
        title='Email Report'
        centered
        open={isEmailModalOpen}
        onCancel={() => {
          form.resetFields()
          setIsEmailModalOpen(false)
        }}
        okText='Send'
        onOk={() => form.submit()}
      >
        <Spin spinning={isEmailSending}>
          <Form
            labelCol={{
              span: 24
            }}
            wrapperCol={{
              span: 24
            }}
            form={form}
            onFinish={handleSubmitEmail}
            className='mt'
          >
            <Row gutter={15}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name='email'
                  label='Email Address'
                  className='category-select'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter valid email address'
                    }
                  ]}
                >
                  <Select
                    placeholder='Select Email'
                    options={emailOptions}
                    showSearch
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '')
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name='attach_dicom'
                  label='Attach Dicom Images'
                  valuePropName='checked'
                  initialValue={false}
                >
                  <Switch />
                </Form.Item>
                <Button type="primary" onClick={() => setIsNewEmailModalOpen(true)}>Add New Email</Button>

              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

      {/* ==== Share Whatsapp modal ==== */}
      <Modal
        title='Whatsapp Report'
        centered
        open={isWhatsappModalOpen}
        onCancel={() => {
          form.resetFields()
          setIsWhatsappModalOpen(false)
        }}
        okText='Send'
        onOk={() => form.submit()}
      >
        <Spin spinning={isEmailSending}>
          <Form
            labelCol={{
              span: 24
            }}
            wrapperCol={{
              span: 24
            }}
            form={form}
            onFinish={handleSubmitWhatsapp}
            className='mt'
          >
            <Row gutter={15}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name='contact'
                  label='Contact Details'
                  className='category-select'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter valid Contact Number'
                    }
                  ]}
                >
                  <Input
                    placeholder='Enter Whatsapp Number'
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name='attach_dicom'
                  label='Attach Dicom Images'
                  valuePropName='checked'
                  initialValue={false}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

      {/* ==== Add Email Model ==== */}
      <Modal
        title='Add New Email'
        open={isNewEmailModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsNewEmailModalOpen(false)
        }}
      >
        <Form
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 24
          }}
          form={form}
          onFinish={handleSubmit}
          style={{ marginTop: "12px" }}
        >
          <Form.Item
            name='full_name'
            label='Full Name'
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please enter full name'
              }
            ]}
          >
            <Input placeholder='Enter Full Name' />
          </Form.Item>

          <Form.Item
            name='email'
            label='Email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please enter email'
              }
            ]}
          >
            <Input placeholder='Enter Email' />
          </Form.Item>

          <Form.Item
            name='contact'
            label='Contact'
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

          <Form.Item
            label='Role'
            name='role_id'
            className='category-select'
            rules={[
              {
                required: true,
                message: 'Please select role'
              }
            ]}
          >
            <Select
              placeholder='Select Role'
              options={roleOptions}
              showSearch
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name='active_status'
            label='Active'
            valuePropName='checked'
            initialValue={false}
          >
            <Switch/>
          </Form.Item>

        </Form>

      </Modal>

    </>
  )
}

export default ShareStudy
