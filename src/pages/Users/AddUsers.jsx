import React, { useEffect, useState } from 'react'
import {
  Steps,
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Switch,
  Select,
  TimePicker,
  Checkbox,
  Modal,
  Spin,
  Upload,
  message,
  Image,
  Popconfirm
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import TableWithFilter from "../../components/TableWithFilter";
import API from "../../apis/getApi";
import NotificationMessage from "../../components/NotificationMessage";
import dayjs from "dayjs";
import { cities, generateRandomEmail } from '../../helpers/utils';
import { states } from '../../helpers/utils';
import UploadImage from "../../components/UploadImage";
import { uploadImage } from "../../apis/studiesApi";
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';


const { Step } = Steps;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


const AddUsers = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0)
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [roleOptions, setRoleOptions] = useState([])
  const [institutionOptions, setInstitutionOptions] = useState([])
  const [form] = Form.useForm()
  const { changeBreadcrumbs } = useBreadcrumbs()
  const token = localStorage.getItem('token')
  const [payload, setPayload] = useState({})
  const { id } = useParams()
  const [imageURL, setImageURL] = useState(null)
  const [value, setValues] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  function transform(jsonObj) {
    let result = {};
    for (let key in jsonObj) {
      for (let property in jsonObj[key]) {
        result[`${key}_${property}`] = jsonObj[key][property];
      }
    }
    return result;
  }

  // **** Signature image selection related handler **** // 
  const [fileList, setFileList] = useState([]);
  
  const onChange = ({ fileList: newFileList }) => {
    // Only allow one file
    setFileList(newFileList.slice(-1)); // This ensures only the last file uploaded is kept
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onRemove = (file) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    message.success(`${file.name} removed successfully!`);
  };

  // **** Retervie particular user information on edit user details time **** // 
  const retrieveUserData = async () => {
    await API.post(
      '/user/v1/particular-user-fetch',
      { user_id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (res.data.status) {

          const instituteData = convertToInitialObject(
            res.data.data.institution_details
          )
          let institution_transform_data = transform(res?.data?.data?.institution_details);
          const modalityData = convertToInitialModalityObject(
            res.data.data.modality_details
          )
          const resData = {
            ...res.data.data,
            username: res.data.data.user.username,
            email: res.data.data.user.email,
            role_id: res.data.data.role.id,
            institute_id: res.data.data.institute.id,
            availability: [
              dayjs(res.data.data.availability_start_time, 'HH:mm:ss'),
              dayjs(res.data.data.availability_end_time, 'HH:mm:ss')
            ],
            ...instituteData,
            ...modalityData,
            ...institution_transform_data
          }
          form.setFieldsValue(resData)
          setImageUrl(res?.data?.data?.profile_image);
          setImageURL(res.data.data.signature_image) 

          // Set Signature image 
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: res?.data?.data?.signature_image,
            },
          ])
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

  // **** Retervie Institution list for User creation **** // 
  const retrieveInstitutionData = async () => {
    setIsLoading(true)
    await API.get('/user/v1/fetch-institution-list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            ...item,
            label: item.name,
            value: item.id
          }))
          setInstitutionOptions(resData)
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

  // **** Retervide all available role list for User creation **** // 
  const retrieveRolesData = async () => {
    setIsLoading(true)
    await API.get('/user/v1/fetch-role-list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            label: item.role_name,
            value: item.id
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
      .catch(err => NotificationMessage('warning', 'Network request failed', err?.response?.data?.message))
    setIsLoading(false)
  }

  // **** Retervie modality list for User creation **** // 
  const retrieveModalityList = async () => {
    setIsLoading(true)
    await API.get('/user/v1/fetch-modality-list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            ...item,
            isAllowed: false
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
      .catch(err => {
        NotificationMessage('warning', 'Network request failed', err?.response?.data?.message)
      })
    setIsLoading(false)
  }

  useEffect(() => {
    const crumbs = [{ name: <span style={{ color: "#0052c6" }}>Users</span>, to: '/users' }]
    crumbs.push({
      name: id ? 'Edit' : 'Add'
    })
    changeBreadcrumbs(crumbs)
    retrieveInstitutionData()
    retrieveRolesData()
    retrieveModalityList()
    if (id) {
      retrieveUserData()
    }
  }, [])


  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1)
    // if (currentStep === 3) {

    //   if (imageURL === null) {
    //     if (value?.length === 0) {
    //       NotificationMessage("warning", "Please, Select signature image")
    //     } else {
    //       setCurrentStep(prevStep => prevStep + 1)
    //     }
    //   } else {
    //     setCurrentStep(prevStep => prevStep + 1)
    //   }
    // } else {

    // }

  }

  const handlePrevStep = () => {
    setCurrentStep(prevStep => prevStep - 1)
  }

  const convertToInitialModalityObject = data => {
    let initialObject = {}
    for (let i = 1; i <= Object.keys(data).length; i++) {
      initialObject[`${i}_isAllowed`] = data[i].isAllowed
    }
    return initialObject
  }

  const convertToInitialObject = data => {
    let initialObject = {}
    for (let i = 1; i <= Object.keys(data).length; i++) {
      initialObject[`${i}_viewAssign`] = data[i]?.viewAssign
      initialObject[`${i}_viewAll`] = data[i]?.viewAll
    }
    return initialObject
  }

  const convertToObject = data => {
    let modifiedObject = { institution_details: {} }
    for (let i = 1; i <= institutionOptions.length; i++) {
      modifiedObject.institution_details[i] = {
        viewAssign: data[`${i}_viewAssign`] ? data[`${i}_viewAssign`] : false,
        viewAll: data[`${i}_viewAll`] ? data[`${i}_viewAll`] : false
      }
    }
    return modifiedObject
  }

  const convertModalityToObject = data => {
    let modifiedObject = { modality_details: {} }
    for (let i = 1; i <= tableData.length; i++) {
      modifiedObject.modality_details[i] = {
        isAllowed: data[`${i}_isAllowed`] ? data[`${i}_isAllowed`] : false
      }
    }
    return modifiedObject
  }

  useEffect(() => {
    if (currentStep == 3) {
      setValues([]);
    }
  }, [currentStep]);

  const handleSubmit = async (values) => {
    setIsLoading(true)

    if (currentStep === 0) {

      let user_profile_image = null;

      if (values?.user_profile_image?.file?.originFileObj) {
        try {

          const fromData = {
            image: values?.user_profile_image?.file?.originFileObj
          };

          const response = await uploadImage(fromData);
          user_profile_image = response?.data?.image_url;

        } catch (error) {
          NotificationMessage("warning", "Network request failed", "Failed to upload user profile image");
        }
      } else {
        user_profile_image = "https://images.unsplash.com/photo-1487611459768-bd414656ea10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      }

      setIsLoading(false);

      let requestPayload = {
        ...values,
        allow_offline_download: values.allow_offline_download
          ? values.allow_offline_download
          : false,
        allow: values.allow ? values.allow : false,
        user_profile_image: user_profile_image
      } ; 

      if (requestPayload?.email == undefined  ){
        requestPayload["email"] = generateRandomEmail() ; 
      } 

      if (requestPayload?.remote_address == undefined){
        requestPayload["remote_address"] = null ; 
      }

      setPayload(requestPayload)

      handleNextStep();

    } else if (currentStep === 1) {

      if (values?.availability == undefined){
        setPayload(prev => ({
          ...prev,
          start_time: "00:00:00",
          end_time: "00:00:00"
        }))

      } else {
        setPayload(prev => ({
          ...prev,
          start_time: values.availability[0].format('HH:mm:ss'),
          end_time: values.availability[1].format('HH:mm:ss')
        }))
      }

      if (id) {
        setIsLoading(true)
        await API.post(
          '/user/v1/user-update-basic-details',
          {
            ...payload,
            start_time: values?.availability[0].format('HH:mm:ss'),
            end_time: values?.availability[1].format('HH:mm:ss'),
            user_id: parseInt(id)
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', "User details updated successfully")
            } else {
              NotificationMessage('warning', 'Network request failed')
            }
          })
          .catch(err =>
            NotificationMessage('warning', 'Network request failed', err.response.data.message)
          )
        setIsLoading(false)
      }

      if (updateOptionActivate) {
        setUpdateOptionActivate(false);
      } else {
        handleNextStep()
      }


    } else if (currentStep === 2) {

      function convertObject(input) {
        const output = {};
        for (const key in input) {
          if (input.hasOwnProperty(key)) {
            const [mainKey, subKey] = key.split('_');
            if (!output[mainKey]) {
              output[mainKey] = {};
            }
            output[mainKey][subKey] = input[key];
          }
        }

        return {
          "institution_details": output
        };
      }

      setPayload(prev => ({ ...prev, ...convertObject(values) }))

      if (id) {

        let institution_update_data = convertObject(values);
        setIsLoading(true)
        await API.post(
          '/user/v1/user-update-institution-details',
          {
            user_id: id,
            institution_update: institution_update_data
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', "User institution permission updated successfully")
            } else {
              NotificationMessage('warning', 'Network request failed')
            }
          })
          .catch(err =>
            NotificationMessage('warning', "Network request failed", err.response.data.message)
          )
        setIsLoading(false)
      }

      if (updateOptionActivate) {
        setUpdateOptionActivate(false);
      } else {
        handleNextStep()
      }

    } else if (currentStep === 3) {

      setIsLoading(true);
      
      let signature_image = null;
      
      if (fileList?.length > 0 && fileList[0]?.originFileObj !== undefined) {

        try {
          const formData = {
            image: fileList[0]?.originFileObj
          }
          const res = await uploadImage(formData)
          signature_image = res.data.image_url
          setPayload(prev => ({
            ...prev,
            signature_image: res.data.image_url
          }))
          setImageURL(res?.data?.image_url)
        } catch (err) {
          NotificationMessage('warning', "Network request failed", err.response.data.message)
        }

      } else {
        signature_image = fileList[0]?.url || null; 
      }

      setPayload(prev => ({ ...prev, signature_image }))

      if (id) {
        await API.post(
          '/user/v1/user-update-signature',
          {
            id: id,
            signature_image: signature_image
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              setImageURL(signature_image)
              setPayload(prev => ({ ...prev, signature_image }))

              NotificationMessage("success", "User signature updated successfully")
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', "Network request failed", err.response.data.message)
          )
      }
      setIsLoading(false);

      if (updateOptionActivate) {
        setUpdateOptionActivate(false);
      } else {
        handleNextStep();
      }

    } else if (currentStep === 4) {
      setIsLoading(true)
      const modalityData = { ...convertModalityToObject(values) }
      setPayload(prev => ({ ...prev, ...convertModalityToObject(values) }))
      if (id) {
        await API.post(
          '/user/v1/user-update-modality-details',
          {
            user_id: id,
            modality_update: {
              ...convertModalityToObject(values).modality_details
            }
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'User modality details updated successfully')
              form.resetFields()
              navigate('/users')
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', "Network request failed", err.response.data.message)
          )
      } else {
        await API.post(
          '/user/v1/create-user',
          { ...payload, ...modalityData },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'User successfully created')
              form.resetFields()
              navigate('/users')
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage('warning', "Network request failed", err.response.data.message)
          )
      }
      setIsLoading(false)
    }

    setIsLoading(false)
    setIsModalOpen(false)
  }

  const institutionColumn = [
    {
      title: 'Institution',
      dataIndex: 'name'
    },
    {
      title: 'View Assigned Studies',
      dataIndex: 'viewAssign',
      render: (text, record) => (
        <Form.Item name={`${record.id}_viewAssign`} valuePropName='checked'>
          <Checkbox className='institution-checkbox' />
        </Form.Item>
      )
    },
    {
      title: 'View All Studies',
      dataIndex: 'viewAll',
      render: (text, record) => (
        <Form.Item name={`${record.id}_viewAll`} valuePropName='checked'>
          <Checkbox className='institution-checkbox' />
        </Form.Item>
      )
    }
  ]

  // Check All Modality related option handler --------------------------
  const [checkAll, setCheckAll] = useState(false);
  
  const onCheckAllChange = (e) => {
    const checked = e.target.checked;
    setCheckAll(checked);
    let temp = {} ; 
    tableData?.map((element) => {
      console.log(element);
      temp[`${element?.id}_isAllowed`] = checked ; 
    })
    form.setFieldsValue(temp) ; 
    setTableData(newData);
  };

  const columns = [
    {
      title: "Modality",
      dataIndex: "name",
    },
    {
      title: (
        <Checkbox
          checked={checkAll}
          onChange={onCheckAllChange}
          className='institution-checkbox'
        >
          <div style={{color: "#FFF"}}>Allowed</div>
        </Checkbox>
      ),
      dataIndex: "isAllowed",
      render: (text, record) => (
        <Form.Item name={`${record.id}_isAllowed`} valuePropName='checked'>
          <Checkbox
            className='institution-checkbox'
            checked={record.isAllowed}
            onChange={(e) => onCheckboxChange(e.target.checked, record.id)}
          />
        </Form.Item>
      ),
    },
  ];


  //upload image functionality

  const [profileLoading, setProfileLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [updateOptionActivate, setUpdateOptionActivate] = useState(false);

  const handleProfileChange = (info) => {
    if (info.file.status === 'uploading') {
      setProfileLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        setProfileLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      {profileLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload Profile Picture
      </div>
    </button>
  );

  return (
    <div className='secondary-table' style={{ marginTop: "-20px" }}>
      <Card className='user-creation-card'>
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

          {id && (
            <div style={{ cursor: "pointer" }} onClick={
              () => { if (currentStep === 4) { setCurrentStep(0) } else { setCurrentStep(4) } }}>
              {currentStep === 4 ? "Skip to first" : "Skip to last"}
            </div>
          )}
        </div>
        <Spin spinning={isLoading}>

          <Steps current={currentStep} className="mb">

            <Step title="Basic details" />
            <Step title="Availability" />
            <Step title="Assigned Institution" />
            <Step title="User Signature" />
            <Step title="Modality" />

          </Steps>

          {/* Step1 --- User basic details input */}

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
              className="mt form-step-0"
            >
              <Row gutter={15}>
                <Col xs={4} sm={4} md={4} lg={3}>

                  <Form.Item
                    name="user_profile_image"
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://file.io"
                      beforeUpload={beforeUpload}
                      onChange={handleProfileChange}
                      style={{
                        width: "2rem",
                        height: "1rem"
                      }}
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          className='selected-profile-image'
                          alt="avatar"
                          style={{
                            width: '100%',
                          }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>

                </Col>

                <Col xs={4} sm={4} md={4} lg={16}>

                  <Form.Item
                    name='allow_offline_download'
                    label='Allow Offline Download'
                    valuePropName='checked'
                  >

                    <Switch />

                  </Form.Item>

                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name='username'
                    label='Username'
                    rules={[
                      {
                        whitespace: true,
                        required: true,
                        message: 'Please enter username'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Username' autoComplete='fal' />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name='email'
                    label='Email Address'
                    rules={[
                      {
                        type: 'email',
                        required: false,
                        message: 'Please enter valid email'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Email' />
                  </Form.Item>
                </Col>


                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name='contact'
                    label='Contact Number'
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter contact number'
                      },
                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.resolve(); // No validation if value is not provided
                          }

                          // Validate Indian contact number
                          const indianPhoneNumberRegex = /^[6-9]\d{9}$/;

                          if (indianPhoneNumberRegex.test(value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Invalid contact number");
                          }
                        }
                      }
                    ]}
                  >
                    <Input placeholder='Enter Contact Number' />
                  </Form.Item>
                </Col>

                <Col lg={8} md={12} sm={12}>
                  <Form.Item
                    label='Institution'
                    name='institute_id'
                    className='category-select'
                    rules={[
                      {
                        required: true,
                        message: 'Please select Institution'
                      }
                    ]}
                  >
                    <Select
                      placeholder='Select Institution'
                      options={institutionOptions}
                    />

                  </Form.Item>
                </Col>

                <Col lg={8} md={12} sm={12}>
                  <Form.Item
                    label='Role'
                    name='role_id'
                    className='category-select'
                    rules={[
                      {
                        required: true,
                        message: 'Please select Role'
                      }
                    ]}
                  >
                    <Select
                      placeholder='Select Role'
                      options={roleOptions}
                    />
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
                    {/* <Select
                      placeholder="City"
                      options={[...cities]}
                      showSearch
                    // onChange={() => { form.submit() }}
                    /> */}
                    <Input placeholder='Enter City'/>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter address",
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="Enter Address" />
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
                    <Input placeholder='Enter State'/>
                    {/* <Select
                      placeholder="states"
                      options={[...states]}
                      showSearch
                    // onChange={() => { form.submit() }}
                    /> */}
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter country",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Country" />
                  </Form.Item>
                </Col>


                <Col xs={24} sm={12} md={12} lg={8}>
                  <Form.Item
                    name='remote_address'
                    label='Remote address'
                    rules={[
                      {
                        whitespace: true,
                        required: false,
                        message: 'Please enter Remote Address'
                      }
                    ]}
                  >
                    <Input placeholder='Enter Remote Address (Platform)' />
                  </Form.Item>
                </Col>

                {!id && (
                  <>
                    {' '}

                    <Col lg={8} md={12} sm={12}>
                      <Form.Item
                        label='Password'
                        name='password'
                        rules={[
                          {
                            whitespace: true,
                            required: true,
                            message: 'Please enter password'
                          }
                        ]}
                        hasFeedback
                      >
                        <Input.Password
                          autoComplete='off'
                          name='password'
                          style={{ marginBottom: '0.5rem' }}
                          placeholder='Enter Password'
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={8} md={12} sm={12}>
                      <Form.Item
                        label='Confirm Password'
                        name='confirmPassword'
                        rules={[
                          {
                            required: true,
                            message: 'Please confirm your password'
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue('password') === value
                              ) {
                                return Promise.resolve()
                              }
                              return Promise.reject(
                                new Error(
                                  'The two passwords that you entered do not match!'
                                )
                              )
                            }
                          })
                        ]}
                        dependencies={['password']}
                        hasFeedback
                      >
                        <Input.Password
                          autoComplete='off'
                          name='confirmPassword'
                          style={{ marginBottom: '0.5rem' }}
                          placeholder='Enter Confirm Password'
                        />
                      </Form.Item>
                    </Col>{' '}

                  </>
                )}

                <Col xs={24} sm={24} md={24} lg={24} className="justify-end" style={{marginBottom: 10}}>

                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ marginLeft: '10px' }}>
                    Next
                  </Button>

                </Col>

              </Row>
            </Form>

          )}

          {/* Step2 --- User availability time input  */}

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
              <Row gutter={30}>

                <Col lg={12} md={12} sm={24}>
                  <Form.Item
                    label='Availability'
                    name='availability'
                    rules={[
                      {
                        required: false,
                        message: 'Please enter availability'
                      }
                    ]}
                  >
                    <TimePicker.RangePicker />
                  </Form.Item>
                </Col>

                <Col
                  lg={24}
                  md={24}
                  sm={24}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "auto"
                  }}
                >
                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option'>
                    Previous
                  </Button>

                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) {
                        setIsModalOpen(true);
                        setUpdateOptionActivate(true);
                      } else {
                        form.submit();
                      }
                    }}
                    className='user-update-option-button'
                    style={{ marginLeft: '10px' }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>

                  {id && (
                    <Button
                      type='primary'
                      onClick={() => { handleNextStep() }}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}

                </Col>

              </Row>

            </Form>
          )}

          {/* Step3 --- Institution assign option  */}

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
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <TableWithFilter
                    tableColumns={institutionColumn}
                    tableData={institutionOptions}
                    className="Institution-logs-table"
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
                      if (id) {
                        setIsModalOpen(true);
                        setUpdateOptionActivate(true);
                      } else {
                        form.submit();
                      }
                    }}
                    className='user-update-option-button'
                    style={{ marginLeft: '10px' }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>

                  {id && (
                    <Button
                      type='primary'
                      onClick={() => {
                        handleNextStep()
                      }}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          )}

          {/* Step4 --- User signature option  */}

          {currentStep === 3 && (
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
                <Col lg={12} xs={24}>
                  <div className='user-create-signature'>
                    {/* <UploadImage
                      values={value}
                      setValues={setValues}
                      imageFile={imageFile}
                      setImageFile={setImageFile}
                      imageURL={imageURL}
                    /> */}

                    <ImgCrop 
                      // rotationSlider
                      aspect={1}
                      minZoom={0.3}
                      zoom={1.5}            // Adjust initial zoom level if supported by ImgCrop
                    >
                      <Upload
                        action="https://file.io"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        onRemove={onRemove}
                        maxCount={1}
                      >
                        {fileList.length === 0 && '+ Upload'}
                      </Upload>
                    </ImgCrop>
                  </div>
                </Col>

                <Col
                  lg={24}
                  md={24}
                  sm={24}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option'>
                    Previous
                  </Button>

                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) {
                        setIsModalOpen(true);
                        setUpdateOptionActivate(true);
                      } else {
                        form.submit();
                      }
                    }}
                    className='user-update-option-button'
                    style={{ marginLeft: '10px' }}
                  >
                    {id ? 'Update' : 'Next'}
                  </Button>

                  {id && (
                    <Button
                      type='primary'
                      onClick={() => {
                        handleNextStep()
                      }}
                      style={{ marginLeft: '10px' }}
                    >
                      Next
                    </Button>
                  )}

                </Col>


              </Row>
            </Form>
          )}

          {/* Step5 --- User Modality access option  */}

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
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <TableWithFilter
                    tableColumns={columns}
                    tableData={tableData}
                    pagination
                  />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} className='justify-end mt'>
                  <Button
                    type='primary'
                    onClick={handlePrevStep}
                    style={{ marginRight: '10px' }}
                    className='update-button-option'
                  >
                    Previous
                  </Button>
                  <Popconfirm
                    title="Create user"
                    description="Are you sure you want to create user ?"
                    onConfirm={(e) => { e.preventDefault(); form.submit() }}
                  >
                    <Button type='primary' className='user-update-option-button'>
                      {id ? 'Update' : 'Submit'}
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Form>
          )}

        </Spin>

      </Card>

      {/* ==== Update details conformation model ====  */}

      <Modal
        centered
        title='Conformation'
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText='Update'
        className='user-details-update-conformation-modal'
      >
        <Spin spinning={isLoading}>
          <p className='conformation-description'>Are you sure you want to update this details?</p>
        </Spin>

      </Modal>
    </div>
  )
}

export default AddUsers
