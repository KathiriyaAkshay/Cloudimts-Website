import React, { useEffect, useState, useRef } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Button, Card, Col, Form, Input, Row, Select, Radio, Upload, message, Divider, Space } from 'antd'
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
import { descriptionOptions, MODALITY_OPTIONS } from '../../helpers/utils'
import API from '../../apis/getApi'
import APIHandler from '../../apis/apiHandler'
import { UploadOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons'; 


const AddTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams()

  const [editorData, setEditorData] = useState('');
  const [modalityOptions, setModalityOptions] = useState([...MODALITY_OPTIONS]);
  const [descriptionSelectionOptions, setDescriptionSelectionOptions] = useState([...descriptionOptions]);
  const [loading, setLoading] = useState(false);
  const { changeBreadcrumbs } = useBreadcrumbs()
  const [form] = Form.useForm()

  // Modality 
  const [name, setName] = useState('');
  const inputRef = useRef();

  // Study description
  const [description, setDescription] = useState("");
  const descriptionRef = useRef();

  // Custom Modality enter related option handler 
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    try {
      e.preventDefault();
    } catch (error) {
    }

    if (name !== "" && name !== undefined && name !== null) {
      setModalityOptions([{ label: name, value: name }, ...modalityOptions]);
      setName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Custom study description related option handler 
  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const addDescriptionItem = (e) => {
    try {
      e.preventDefault();
    } catch (error) {
    }

    if (description !== "" && description !== undefined && description !== null) {
      setDescriptionSelectionOptions([{ label: description, value: description }, ...descriptionSelectionOptions]);
      setDescription('');
      setTimeout(() => {
        descriptionRef.current?.focus();
      }, 0);
    }
  };


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
          form.setFieldsValue({
            "institution_select": resData
          })
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
      "institute/v1/fetch-radiologist-name?is_template_radiologist=true"
    );

    if (responseData["status"] === true) {

      const resData = responseData?.radiologist?.map((element) => ({
        label: element.name,
        value: element.id
      }))

      setAllRadiologistOption(resData);

    }
  }

  // **** Reterive institution modality name list options **** // 
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
    // FetchInstitutionModalityList();
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
        setLoading(true);
        updateReport({ ...requestPayload })
          .then(res => {
            setLoading(false); // Ensure loading is stopped for both success and failure cases
            if (res.data.status) {
              NotificationMessage('success', 'Template updated successfully');
              navigate('/reports');
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message || 'Unknown error occurred'
              );
            }
          })
          .catch(err => {
            setLoading(false);
            const errorMessage =
              err.response?.data?.message || 'An unexpected error occurred';
            NotificationMessage('warning', 'Network request failed', errorMessage);
          });

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
        console.log(reader.result);
        
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
    accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    onChange(info) {
      handleFileChange(info);
    },
    beforeUpload: (file) => {
      console.log("File type informaTion ", file?.type);
      
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isDoc = file.type === 'application/msword';
      
      if (!isDocx && !isDoc) {
        message.error(`${file.name} is not a valid file type. Only .doc or .docx files are allowed.`);
        return Upload.LIST_IGNORE; // Reject the file
      }
      return true; // Accept the file
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

            <Col lg={6} md={8} sm={8}>

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
                    message: 'Please, Select template Modality'
                  }
                ]}
              >
                <Select
                  placeholder="Select Modality"
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: '8px 0',
                        }}
                      />
                      <Space
                        style={{
                          padding: '0 8px 4px',
                        }}
                      >
                        <Input
                          placeholder="Please enter item"
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                          Add item
                        </Button>
                      </Space>
                    </>
                  )}
                  options={modalityOptions.map((item) => ({
                    label: item?.label,
                    value: item?.value,
                  }))}
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
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: '8px 0',
                        }}
                      />
                      <Space
                        style={{
                          padding: '0 8px 4px',
                        }}
                      >
                        <Input
                          placeholder="Please enter item"
                          ref={descriptionRef}
                          value={description}
                          onChange={onDescriptionChange}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addDescriptionItem}>
                          Add item
                        </Button>
                      </Space>
                    </>
                  )}
                  options={descriptionSelectionOptions.map((item) => ({
                    label: item?.label,
                    value: item?.value,
                  }))}
                />
              </Form.Item>

              {/* Institution name dropdown  */}
              <Form.Item
                name="institution_select"
                label="Institution"
                className="category-select"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select Institutions"
                  options={[
                    { label: 'Select All', value: 'selectAll' },
                    { label: 'Unselect All', value: 'unselectAll' },
                    ...institutionOptions,
                  ]}
                  style={{
                    width: '100%',
                    padding: '4px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    overflowY: "auto"
                  }}
                  showSearch
                  onChange={(values) => {
                    const allOptionValues = institutionOptions.map(option => option.value);

                    if (values.includes('selectAll')) {
                      form.setFieldsValue({ institution_select: allOptionValues }); // Select all institutions
                    } else if (values.includes('unselectAll')) {
                      form.setFieldsValue({ institution_select: [] }); // Deselect all institutions
                    } else {
                      form.setFieldsValue({ institution_select: values }); // Set the selected values as usual
                    }
                  }}
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
                    required: false,
                  },
                ]}
              >
                <Select
                  mode="multiple"  // Enable multiple selection
                  placeholder="Select Study Radiologist"
                  options={[
                    { label: 'Select All', value: 'selectAll' },  // Add Select All option
                    { label: 'Unselect All', value: 'unselectAll' },  // Add Unselect All option
                    ...allRadiologistOption  // Spread other radiologist options
                  ]}
                  style={{
                    width: '100%',
                    padding: '4px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    overflowY: "auto"
                  }}
                  showSearch
                  onChange={(values) => {
                    const allRadiologistValues = allRadiologistOption.map(option => option.value); // Get all radiologist values

                    if (values.includes('selectAll')) {
                      // If Select All is chosen, select all radiologists
                      form.setFieldsValue({ study_radiologist: allRadiologistValues });
                    } else if (values.includes('unselectAll')) {
                      // If Unselect All is chosen, deselect all radiologists
                      form.setFieldsValue({ study_radiologist: [] });
                    } else {
                      // Otherwise, update the selected values as usual
                      form.setFieldsValue({ study_radiologist: values });
                    }
                  }}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </Form.Item>

              {/* Gender  */}
              {/* <Form.Item
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

              </Form.Item> */}

              <Form.Item
                label='Gender'
                name='gender'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select placeholder="Select Gender">
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                  <Select.Option value="Male,Female">Both</Select.Option>
                  <Select.Option value="Others">Others</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col
              lg={18}
              md={16}
              sm={16}
              className='add-template-option-editor'
              style={{ height: "70vh", overflow: "hidden", position: "relative" }}
            >
              <Form.Item style={{ position: "relative" }}>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
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
              <Button type='primary' htmlType='submit' loading={loading}>
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
