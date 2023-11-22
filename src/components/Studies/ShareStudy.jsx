import React, { useEffect, useState } from 'react'
import { fetchEmailList, getStudyData, sendEmail } from '../../apis/studiesApi'
import {
  Button,
  Col,
  Form,
  List,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  Tag,
  Typography
} from 'antd'
import { MdEmail } from 'react-icons/md'
import NotificationMessage from '../NotificationMessage'
import APIHandler from '../../apis/apiHandler'

const ShareStudy = ({
  isShareStudyModalOpen,
  setIsShareStudyModalOpen,
  studyID,
  setStudyID
}) => {
  const [modalData, setModalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [emailOptions, setEmailOptions] = useState([])
  const [form] = Form.useForm()
  const [studyData, setStudyData] = useState({})

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

  const retrieveStudyData = () => {
    setIsLoading(true)
    getStudyData({ id: studyID })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data

          const modifiedData = [
            {
              name: "Patient's id",
              value: resData?.Patient_id
            },
            {
              name: 'Referring Physician Name',
              value: resData?.Referring_physician_name
            },
            {
              name: "Patient's Name",
              value: resData?.Patient_name
            },

            {
              name: "Assign study time", 
              value: resData?.study_assign_time
            }, 
  
            {
              name:"Assign study username", 
              value: resData?.study_assign_username
            }, 
            
            {
              name: 'Performing Physician Name',
              value: resData?.Performing_physician_name
            },
            {
              name: 'Accession Number',
              value: resData?.Accession_number
            },
            {
              name: 'Modality',
              value: resData?.Modality
            },
            {
              name: 'Gender',
              value: resData?.Gender
            },
            {
              name: 'Date of birth',
              value: resData?.DOB
            },
            {
              name: 'Study Description',
              value: resData?.Study_description
            },
            {
              name: "Patient's comments",
              value: resData?.Patient_comments
            },
            {
              name: 'Body Part',
              value: resData?.Study_body_part
            },
            {
              name: 'Study UID',
              value: resData?.Study_UID
            },
            {
              name: 'Series UID',
              value: resData?.Series_UID
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

  const handleSubmit = async values => {
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
      <Button style={{ background: 'transparent', border: '1px solid #fff' }}>
        <MdEmail
          className='action-icon'
          style={{ color: '#fff' }}
          onClick={() => setIsEmailModalOpen(true)}
        />
      </Button>
    </div>
  )

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
        width={1000}
        centered
        footer={null}
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
                className={`queue-number-list ${
                  item.name === 'Series UID' || item.name === 'Study UID'
                    ? 'full-width'
                    : 'half-width'
                }`}
              >
                <Typography
                  style={{ display: 'flex', gap: '4px', fontWeight: '600' }}
                >
                  {item.name}:
                  {item.name === "Patient's id" ||
                  item.name === "Patient's Name" ||
                  item.name === "Study UID" ||
                  item.name === "Institution Name" ||
                  item.name === "Series UID" || 
                  item.name === "Assign study time" || 
                  item.name === "Assign study username"? (
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
            onFinish={handleSubmit}
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
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default ShareStudy
