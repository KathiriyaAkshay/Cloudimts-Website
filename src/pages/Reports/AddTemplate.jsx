import React, { useEffect, useState } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Button, Card, Col, Form, Input, Row,Select } from 'antd'
import '../../../ckeditor5/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  fetchTemplate,
  insertNewTemplate,
  updateReport
} from '../../apis/studiesApi'
import NotificationMessage from '../../components/NotificationMessage'
import { descriptionOptions } from '../../helpers/utils'

const AddTemplate = () => {
  const [editorData, setEditorData] = useState('')
  const { changeBreadcrumbs } = useBreadcrumbs()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const crumbs = [{ name: 'Reports', to: '/reports' }]
    if (id) {
      crumbs.push({
        name: 'Edit'
      })
      retrieveTemplateData()
    } else {
      crumbs.push({
        name: 'Add'
      })
    }
    changeBreadcrumbs(crumbs)
  }, [])

  const retrieveTemplateData = () => {
    fetchTemplate({ id })
      .then(res => {
        if (res.data.status) {
          form.setFieldsValue({ name: res.data.data.report_name })
          setEditorData(res.data.data.report_data)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed', err.response.data.message))
  }

  const handleSubmit = (values) => {
    if (editorData.trim() !== '') {
      if (!id) {
        insertNewTemplate({ name: values.name, data: editorData,modality_description:values.study_description })
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'Template Created Successfully')
              navigate('/reports')
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', 'Network request failed', err.response.data.message)
          )
      } else {
       
        updateReport({ id, update_data: editorData, update_report_name: values.name})
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'Template Updated Successfully')
              navigate('/reports')
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', 'Network request failed', err.response.data.message)
          )
      }
    } else {
      NotificationMessage('warning', 'Please enter valid template')
    }
  }

  return (
    <div>
      <Card className='report-template-card'>
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
            <Col lg={8} md={8} sm={8}>
              <Form.Item
                label='Template Name'
                name='name'
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please Enter Template Name'
                  }
                ]}
              >
                <Input
                  placeholder='Enter Template Name'
                />
              </Form.Item>
              <Form.Item
                    name="study_description"
                    label="Modality Description"
                    className="category-select"

                    rules={[
                      {
                        required: true,
                        message: "Please select Modality Study Description",
                      },
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
            <Col
              lg={16}
              md={16}
              sm={16}
              style={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}
            >
              
              <Form.Item label='Create Template'>
                <CKEditor
                  editor={ClassicEditor}
                  data={editorData}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setEditorData(data)
                  }}
                />
              </Form.Item>
            </Col>
            <Form.Item className='btn-div'>
              <Button onClick={() => navigate(-1)}>Cancel</Button>
              <Button type='primary' htmlType='submit'>
                Save
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default AddTemplate
