import { Form, List, Modal, Select, Spin, Tag, Typography, Input } from 'antd'
import React, { useEffect, useState, useContext } from 'react'
import NotificationMessage from './NotificationMessage'
import APIHandler from '../apis/apiHandler'
import { StudyIdContext } from '../hooks/studyIdContext'

const EditSeriesId = ({
  isEditSeriesIdModifiedOpen,
  setIsEditSeriesIdModifiedOpen,
  studyID,
  setStudyID, 
  seriesId, 
  setPagination
}) => {
  const [isLoading, setIsLoading] = useState(false) ; 
  const [form] = Form.useForm() ; 
  const { studyIdArray, setStudyIdArray } = useContext(StudyIdContext) ; 

  const handleSubmit = async (values) => {    
    setIsLoading(true) ; 

    let requestPayload = {
      "id": studyID, 
      "updated_series_id": values?.seriesId
    }

    let responseData = await APIHandler("POST", requestPayload, "studies/v1/edit-series-id") ; 

    setIsLoading(false) ; 

    if (responseData === false){

      NotificationMessage("warning", "Network request failed") ; 
    
    } else if (responseData['status'] === true){

      setIsEditSeriesIdModifiedOpen(false) ; 
      NotificationMessage("success", "Study seriesId updated successfully") ; 
      setPagination((prev) => ({ ...prev, page: 1 }));

    } else {

      NotificationMessage("warning", responseData['message']) ; 
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
          <div>StudyId - {studyID}</div>
        </div>

        <div className='Study-modal-input-option-division' style={{ borderTop: '0px', paddingTop: 0 }} >
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
                initialValues={{seriesId:seriesId}}
              >
                <Form.Item
                  label='Provide updated seriesId'
                  name='seriesId'
                  className='category-select'
                  rules={[
                    {
                      required: true,
                      message: 'Please select radiologist'
                    }
                  ]}
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  <Input placeholder='Update seriesd id' />

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
