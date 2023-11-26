import { Form, List, Modal, Select, Spin, Tag, Typography, Input } from 'antd'
import React, { useEffect, useState, useContext } from 'react'
import {
  fetchAssignStudy,
  getStudyData,
  postAssignStudy,
  uploadImage
} from '../apis/studiesApi'
import { omit } from 'lodash'
import NotificationMessage from './NotificationMessage'
import APIHandler from '../apis/apiHandler'
import { StudyIdContext } from '../hooks/studyIdContext'

const EditSeriesId = ({
  isEditSeriesIdModifiedOpen,
  setIsEditSeriesIdModifiedOpen,
  studyID,
  setStudyID
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [form] = Form.useForm()
  const { studyIdArray, setStudyIdArray } = useContext(StudyIdContext)

  // Fetch radiologist name based on Institution id

  const FetchRadiologist = async () => {
    let requestPayload = {}

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'institute/v1/fetch-radiologist-name'
    )

    if (responseData['status'] === true) {
      const resData = responseData['data'].map(element => ({
        label: element.name,
        value: element.id
      }))

      setOptions(resData)
    }
  }

  useEffect(() => {
    FetchRadiologist()
  }, [])

  const handleSubmit = async values => {
    setIsLoading(true)

    let requestPayload = {
      studyId: studyIdArray,
      assign_user: values?.radiologist
    }

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'studies/v1/quick-assign-study'
    )

    setIsLoading(false)

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed')
    } else if (responseData['status'] === true) {
      setIsEditSeriesIdModifiedOpen(false)
      setStudyIdArray([])
      NotificationMessage('success', 'Study assign successfully')
    } else {
      NotificationMessage(
        'warning',
        'Network request failed',
        responseData['message']
      )
    }
  }

  return (
    <Modal
      title='Edit Series Id'
      open={isEditSeriesIdModifiedOpen}
      centered
      onOk={() => {
        form.submit()
      }}
      onCancel={() => {
        setStudyID(null)
        setIsEditSeriesIdModifiedOpen(false)
        form.resetFields()
      }}
      width={'40%'}
    >
      <Spin spinning={isLoading}>
        <div
          style={{
            background: '#ebf7fd',
            fontWeight: '600',
            padding: '10px 24px',
            borderRadius: '0px',
            margin: '0 -24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>Edit Series Id</div>
        </div>

        <div
          className='Study-modal-input-option-division'
          style={{ borderTop: '0px', paddingTop: 0 }}
        >
          <div className='assign_studies_all_id_list'>
            {studyIdArray.map(element => {
              return (
                <div className='particular_assign_study_id_information'>
                  {element}
                </div>
              )
            })}
          </div>

          <div
            className='Assign-study-upload-option-input-layout'
            style={{ marginTop: 20 }}
          >
            <div className='quick-assign-study-division'>
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
                <Form.Item
                  label='Input manually'
                  name='radiologist'
                  className='category-select'
                  rules={[
                    {
                      required: true,
                      message: 'Please select radiologist'
                    }
                  ]}
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  <Input placeholder='Basic usage' />

                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}

export default EditSeriesId
