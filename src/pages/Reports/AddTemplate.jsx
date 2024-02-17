import React, { useEffect, useState } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Button, Card, Col, Form, Input, Row, Select } from 'antd'
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
import API from '../../apis/getApi'
import APIHandler from '../../apis/apiHandler'

const AddTemplate = () => {
  const [editorData, setEditorData] = useState('')
  const { changeBreadcrumbs } = useBreadcrumbs()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()

  // **** Reterive particular template information **** // 
  const retrieveTemplateData = () => {
    fetchTemplate({ id })
      .then(res => {
        if (res.data.status) {
          form.setFieldsValue({ name: res.data.data.report_name, study_description: res?.data?.data?.report_description })
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

  // **** Reterive institution options **** // 
  const [institutionOptions, setInstitutionOptions] = useState([]) ; 

  const retrieveInstitutionDataFunction = async () => {
    const token = localStorage.getItem('token');
    await API.get('/user/v1/fetch-institution-list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            label: item.name,
            value: item.id
          }))
          setInstitutionOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Quick Filter',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Quick Filter',
          err.response.data.message
        )
      )
  }

  // **** Reterive all radiologist options **** // 
  const [allRadiologistOption, setAllRadiologistOption] = useState([]) ; 

  const FetchAllRadiologist = async () => {
    let requestPayload = {};

    let responseData = await APIHandler(
      "POST",
      requestPayload,
      "institute/v1/fetch-radiologist-name"
    );

    if (responseData["status"] === true) {

      const resData = responseData['data'].map((element) => ({
        label: element.name,
        value: element.id
      }))

      setAllRadiologistOption(resData);

    }
  }

  useEffect(() => {
    const crumbs = [{ name: 'Templates', to: '/reports' }]
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
    changeBreadcrumbs(crumbs) ; 
    retrieveInstitutionDataFunction() ;
    FetchAllRadiologist();  
  }, [])

  // **** Template submit request handler **** // 
  const handleSubmit = (values) => {

    if (editorData.trim() !== '') {
      if (!id) {

        let requestPayload = {
          name: values?.name, 
          data: editorData, 
          description: values?.study_description
        }; 

        if (values?.institution_select !== undefined){
          requestPayload['institution'] = values?.institution_select
        }

        if (values?.study_radiologist !== undefined){
          requestPayload['radiologist'] = values?.study_radiologist
        }

        insertNewTemplate({ ...requestPayload })
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'Template successfully created')
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

        let requestPayload = {
          id: id, 
          update_data: editorData, 
          update_report_name: values?.name, 
          update_report_description: values?.study_description
        }; 

        if (values?.institution_select !== undefined){
          requestPayload['institution'] = values?.institution_select
        }

        if (values?.study_radiologist !== undefined){
          requestPayload['radiologist'] = values?.study_radiologist
        }

        updateReport({ ...requestPayload })
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'Template updated successfully')
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

              {/* Template name input  */}
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

              {/* Modality selection dropdown  */}
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
            
              {/* Institution name dropdown  */}
              <Form.Item
                name="institution_select"
                label="Institution"
                className="category-select"

                rules={[
                  {
                    required: false
                  },
                ]}
              >
                <Select
                  placeholder="Select Study Description"
                  options={institutionOptions}
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </Form.Item>
          
              {/* User name dropdown  */}
              <Form.Item
                name="study_radiologist"
                label="Radiologist"
                className="category-select"

                rules={[
                  {
                    required: false
                  },
                ]}
              >
                <Select
                  placeholder="Select Study Description"
                  options={allRadiologistOption}
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
