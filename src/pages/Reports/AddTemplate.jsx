import React, { useEffect, useState } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Button, Card, Col, Form, Input, Row, Select, Radio, Upload,message } from 'antd'
import '../../../ckeditor5/build/ckeditor'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { useNavigate, useParams } from 'react-router-dom'
import mammoth from 'mammoth';
import {
  fetchTemplate,
  insertNewTemplate,
  updateReport
} from '../../apis/studiesApi'
import NotificationMessage from '../../components/NotificationMessage'
import { descriptionOptions } from '../../helpers/utils'
import API from '../../apis/getApi'
import APIHandler from '../../apis/apiHandler'
import { UploadOutlined } from '@ant-design/icons'

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
          form.setFieldsValue({
            name: res.data.data.report_name,
            study_description: res?.data?.data?.report_description,
            modality: res?.data?.data?.modality,
            institution_select: res?.data?.data?.institution,
            study_radiologist: res?.data?.data?.radiologist_id, 
            gender: res?.data?.data?.gender
          })
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
  const [institutionOptions, setInstitutionOptions] = useState([]);
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
  const [allRadiologistOption, setAllRadiologistOption] = useState([]);
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

  // **** Reterive institution modality name list options **** // 
  const [modalityOptions, setModalityOptions] = useState([]);
  const FetchInstitutionModalityList = async () => {
    let requestPayload = {};
    let responseData = await APIHandler(
      "GET",
      requestPayload,
      "institute/v1/modality/fetch"
    );
    if (responseData?.status) {
      const resData = responseData?.data?.map((element) => ({
        label: element?.name,
        value: element?.name
      }))
      setModalityOptions(resData);
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
    changeBreadcrumbs(crumbs);
    retrieveInstitutionDataFunction();
    FetchAllRadiologist();
    FetchInstitutionModalityList();
  }, [])

  // **** Template submit request handler **** // 
  const handleSubmit = (values) => {

    if (editorData.trim() !== '') {
      if (!id) {
        let requestPayload = {
          name: values?.name,
          data: editorData,
          description: values?.study_description,
          modality: values?.modality, 
          gender: values?.gender
        };
        if (values?.institution_select !== undefined) {
          requestPayload['institution'] = values?.institution_select
        }
        if (values?.study_radiologist !== undefined) {
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
          update_report_description: values?.study_description,
          update_modality: values?.modality, 
          update_gender: values?.gender
        };
        let institutionMatch = 0;
        let institutionMatchValue = null;
        for (let i = 0; i < institutionOptions?.length; i++) {
          let item = institutionOptions[i];
          if (item['label'] === values?.institution_select) {
            institutionMatchValue = item['value'];
            institutionMatch = 1;
          }
        }
        let radiologistMatch = 0;
        let radiologistMatchValue = null;
        for (let i = 0; i < allRadiologistOption?.length; i++) {
          let item = allRadiologistOption[i];
          if (item['label'] === values?.study_radiologist) {
            radiologistMatch = 1;
            radiologistMatchValue = item['value'];
          }
        }

        if (values?.institution_select !== undefined) {
          requestPayload['institution'] = institutionMatch == 1 ? institutionMatchValue : values?.institution_select
        }
        if (values?.study_radiologist !== undefined) {
          requestPayload['radiologist'] = radiologistMatch == 1 ? radiologistMatchValue : values?.study_radiologist
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

  // Function to handle file selection and conversion
  const handleFileChange = (event) => {
    const file = event.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = reader.result;
        const text = await mammoth.convertToHtml({ arrayBuffer });
        setEditorData(text.value);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const props = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    accept:".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    onChange(info) {
      handleFileChange(info)
    },
    beforeUpload: (file) => {
      const isFileValid = (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      if (!isFileValid) {
        message.error(`${file.name} is not a valid file`);
      }
      return isFileValid || Upload.LIST_IGNORE;
    },
  };

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
          <Row gutter={30} style={{ height: "70vh" }}>

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

              {/* Modality option input  */}
              <Form.Item
                label='Modality'
                name='modality'
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please Enter Template Name'
                  }
                ]}
              >
                <Select
                  placeholder="Select Study Description"
                  options={modalityOptions}
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
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
                  placeholder="Select Modality Description"
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

              {/* Gender  */}
              <Form.Item
                label='Gender'
                name='gender'
                rules={[
                  {
                    required: true,
                  }
                ]}
              >
                <Radio.Group >
                  <Radio value={"Male"}>Male</Radio>
                  <Radio value={"Female"}>Female</Radio>
                  <Radio value={"Others"}>others</Radio>

                </Radio.Group>

              </Form.Item>

            </Col>

            <Col
              lg={16}
              md={16}
              sm={16}
              className='add-template-option-editor'
              style={{ height: "70vh", overflow: "hidden", position: "relative" }}
            >
              <Form.Item style={{ position: "relative" }}>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  {/* Template Doc input  */}
                  <div style={{ fontWeight: "700" }}>Create Template</div>
                  <Upload {...props} className='m'>
                    <Button type='primary' icon={<UploadOutlined />}>Insert Doc File</Button>
                  </Upload>

                </div>


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
