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
  Modal,
  Empty,
  Table,
  Divider
} from 'antd';

import { useNavigate, useParams } from 'react-router-dom'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import TableWithFilter from '../../components/TableWithFilter'
import API from '../../apis/getApi'
import NotificationMessage from '../../components/NotificationMessage'
import dayjs from 'dayjs'
import { cities } from '../../helpers/utils';
import { states } from '../../helpers/utils';
import {
  getRadiologistList,
  updateBlockUsers,
  updateInHouseUser
} from '../../apis/studiesApi'
import CustomReportHeaderGenerator from './Popup'

const { Step } = Steps;

const AddInstitution = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token')
  const { id } = useParams();
  const { changeBreadcrumbs } = useBreadcrumbs()
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [ctModalistyList, setCtModalityList] = useState([
    { id: "BRAIN", reporting_charge: 0, communication_charge: 0 },
    { id: "PNS", reporting_charge: 150, communication_charge: 50 },
    { id: "TEMPORAL BONE", reporting_charge: 150, communication_charge: 50 },
    { id: "FACIAL BONE", reporting_charge: 150, communication_charge: 50 },
    { id: "CERVICAL SPINE", reporting_charge: 150, communication_charge: 50 },
    { id: "DORSOL SPINE", reporting_charge: 150, communication_charge: 50 },
    { id: "LUMBAR SPINE", reporting_charge: 150, communication_charge: 50 },
    { id: "NECK", reporting_charge: 150, communication_charge: 50 },
    { id: "CHEST", reporting_charge: 150, communication_charge: 50 },
    { id: "ABDOMEN", reporting_charge: 150, communication_charge: 50 },
    { id: "KUB", reporting_charge: 150, communication_charge: 50 },
    { id: "UROGRAM", reporting_charge: 150, communication_charge: 50 },
    { id: "PELVIS", reporting_charge: 150, communication_charge: 50 },
    { id: "HIP JOINT", reporting_charge: 150, communication_charge: 50 },
    { id: "FEMUR", reporting_charge: 150, communication_charge: 50 },
    { id: "KNEE", reporting_charge: 150, communication_charge: 50 },
    { id: "LEG", reporting_charge: 150, communication_charge: 50 },
    { id: "ANKLE", reporting_charge: 150, communication_charge: 50 },
    { id: "FOOT", reporting_charge: 150, communication_charge: 50 },
    { id: "SHOULDER", reporting_charge: 150, communication_charge: 50 },
    { id: "HUMERUS", reporting_charge: 150, communication_charge: 50 },
    { id: "ELBOW", reporting_charge: 150, communication_charge: 50 },
    { id: "FOREARM", reporting_charge: 150, communication_charge: 50 },
    { id: "WRIST", reporting_charge: 150, communication_charge: 50 },
    { id: "HAND", reporting_charge: 150, communication_charge: 50 },
    { id: "CEREBRAL ANGIO", reporting_charge: 150, communication_charge: 50 },
    { id: "NECK AND CEREBRAL ANGIO", reporting_charge: 150, communication_charge: 50 },
    { id: "PULMONARY ANGIO", reporting_charge: 150, communication_charge: 50 },
    { id: "CORONARY ANGIO", reporting_charge: 150, communication_charge: 50 },
    { id: "RENAL ANGIO", reporting_charge: 150, communication_charge: 50 },
    { id: "ABDOMINAL ANGIO", reporting_charge: 150, communication_charge: 50 },
    { id: "PERIPHERAL ANGIO", reporting_charge: 150, communication_charge: 50 },
    { id: "AORTOGRAM", reporting_charge: 150, communication_charge: 50 },
    { id: "VENOGRAM", reporting_charge: 150, communication_charge: 50 },
    { id: "CYSTOGRAM", reporting_charge: 150, communication_charge: 50 },
    { id: "MYELOGRAM", reporting_charge: 150, communication_charge: 50 },
    { id: "ENTEROGRAPHY", reporting_charge: 150, communication_charge: 50 },
    { id: "SIALOGRAM", reporting_charge: 150, communication_charge: 50 },
    { id: "SINOGRAM", reporting_charge: 150, communication_charge: 50 }]
  ) ; 

  const [mrModalityList, setMrModalityList] = useState([
    { id: "BRAIN", reporting_charge: 200, communication_charge: 50 },
    { id: "BRAIN", reporting_charge: 200, communication_charge: 50 },
    { id: "BRAIN ANGIOGRAM", reporting_charge: 200, communication_charge: 50 },
    { id: "BRAIN VENOGRAM", reporting_charge: 200, communication_charge: 50 },
    { id: "BRAIN SEIZURE", reporting_charge: 200, communication_charge: 50 },
    { id: "INNER EAR", reporting_charge: 200, communication_charge: 50 },
    { id: "SELLA", reporting_charge: 200, communication_charge: 50 },
    { id: "ORBIT", reporting_charge: 200, communication_charge: 50 },
    { id: "FACE", reporting_charge: 200, communication_charge: 50 },
    { id: "PNS", reporting_charge: 200, communication_charge: 50 },
    { id: "NECK", reporting_charge: 200, communication_charge: 50 },
    { id: "THORACIC", reporting_charge: 200, communication_charge: 50 },
    { id: "STERNO CLAVICULAR JOINT", reporting_charge: 200, communication_charge: 50 },
    { id: "CERVICAL SPINE", reporting_charge: 200, communication_charge: 50 },
    { id: "DORSOL SPINE", reporting_charge: 200, communication_charge: 50 },
    { id: "WHOLE SPINE", reporting_charge: 200, communication_charge: 50 },
    { id: "BRACHIAL PLEXUX", reporting_charge: 200, communication_charge: 50 },
    { id: "LUMBAR PLEXUX", reporting_charge: 200, communication_charge: 50 },
    { id: "SHOULDER", reporting_charge: 200, communication_charge: 50 },
    { id: "HUMEROUS", reporting_charge: 200, communication_charge: 50 },
    { id: "ELBOW", reporting_charge: 200, communication_charge: 50 },
    { id: "FOREARM", reporting_charge: 200, communication_charge: 50 },
    { id: "WRIST", reporting_charge: 200, communication_charge: 50 },
    { id: "HAND", reporting_charge: 200, communication_charge: 50 },
    { id: "FINGER", reporting_charge: 200, communication_charge: 50 },
    { id: "UPPER ABDOMEN", reporting_charge: 200, communication_charge: 50 },
    { id: "MRCP", reporting_charge: 200, communication_charge: 50 },
    { id: "PELVIS", reporting_charge: 200, communication_charge: 50 },
    { id: "PROSTATE", reporting_charge: 200, communication_charge: 50 },
    { id: "PERINEUM", reporting_charge: 200, communication_charge: 50 },
    { id: "HIP JOINT", reporting_charge: 200, communication_charge: 50 },
    { id: "THIGH", reporting_charge: 200, communication_charge: 50 },
    { id: "KNEE JOINT", reporting_charge: 200, communication_charge: 50 },
    { id: "LEG", reporting_charge: 200, communication_charge: 50 },
    { id: "ANKLE", reporting_charge: 200, communication_charge: 50 },
    { id: "FOOT", reporting_charge: 200, communication_charge: 50 },
    { id: "CSF FLOW STUDY", reporting_charge: 200, communication_charge: 50 },
    { id: "CISTERNOGRAM", reporting_charge: 200, communication_charge: 50 },
    { id: "SAILOGRAM", reporting_charge: 200, communication_charge: 50 },
    { id: "SPECTROSCOPY", reporting_charge: 200, communication_charge: 50 },
    { id: "PERFUSION", reporting_charge: 200, communication_charge: 50 },
    { id: "ENTEROGRAPHY", reporting_charge: 200, communication_charge: 50 },
    { id: "FISTULOGRAM", reporting_charge: 200, communication_charge: 50 },
    { id: "SLEEP STUDY", reporting_charge: 200, communication_charge: 50 },
    { id: "CARDIAC", reporting_charge: 200, communication_charge: 50 }
  ]) ; 

  const [crModalityList, setCrModalityList] = useState([
    { id: "CR", reporting_charge: 20, communication_charge: 10 }
  ]);

  const [otherModalityList, setOtherModalityList] = useState([
    {id: "Other", reporting_charge: 100, communication_charge: 100}
  ]) ; 

  const [chargesName, setChargesName] = useState("");
  const [payload, setPayload] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [radiologistOptions, setRadiologistOptions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [reportSettingModal, setReportSettingModal] = useState(false)
  const [institutionId, setInstitutionId] = useState(null)

  const [selectedRadiologists, setSelectedRadiologists] = useState([]);


  const handleChange = (selectedValues) => {
    setSelectedRadiologists(selectedValues);
  };


  // **** Reterive particualr institution details information **** // 
  const retrieveInstitutionData = async () => {
    setIsLoading(true)

    await API.post(
      '/institute/v1/institute-particular-details-fetch',
      { id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (res.data.status) {

          // Set Moality charges information
          let ctTempData = [];
          let mriTempData = []; 
          let crTempData = [];
          let otherTempData = [] ;

          for (let key in res?.data?.data?.modality) {
            if (key?.includes("CT")){
              ctTempData.push({
                id: key,
                reporting_charge: res?.data?.data?.modality[key]?.reporting_charge,
                communication_charge: res?.data?.data?.modality[key]?.communication_charge
              })
            } else if (key?.includes("MRI")){
              mriTempData.push({
                id: key,
                reporting_charge: res?.data?.data?.modality[key]?.reporting_charge,
                communication_charge: res?.data?.data?.modality[key]?.communication_charge
              })
            } else if (key == "CR"){
              crTempData.push({
                id: key,
                reporting_charge: res?.data?.data?.modality[key]?.reporting_charge,
                communication_charge: res?.data?.data?.modality[key]?.communication_charge
              })
            } else{
              otherTempData.push({
                id: key,
                reporting_charge: res?.data?.data?.modality[key]?.reporting_charge,
                communication_charge: res?.data?.data?.modality[key]?.communication_charge
              })
            }
          }
          setCtModalityList([...ctTempData]) ;
          setMrModalityList([...mriTempData]);
          setCrModalityList([...crTempData]) ; 
          setOtherModalityList([...otherTempData]) ;

          const formData = {
            ...res.data.data,
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
          };
          form.setFieldsValue(formData);
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

  // **** Reterive all radiologist user data **** // 
  const retrieveRadiologistData = () => {
    getRadiologistList({ role_id: localStorage.getItem('role_id') }).then(
      res => {
        if (res.data.status) {

          const resData = res.data.data.map(data => ({
            label: data.name,
            value: data.id
          }))
          setRadiologistOptions(resData);

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

  useEffect(() => {
    const crumbs = [{ name: <span style={{ color: "#0052c6" }}>Institution</span>, to: '/institutions' }]
    crumbs.push({
      name: id ? 'Edit' : 'Add'
    });
    changeBreadcrumbs(crumbs)

    if (id) {
      retrieveInstitutionData()
      retrieveRadiologistData()
    } else {
      retrieveRadiologistData()
    }
  }, [])

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(prevStep => prevStep - 1)
  }

  const OpenInstitutionReportSettingModal = () => {
    setInstitutionId(id)
    setReportSettingModal(true)
  }

  const AddModalityDataHandler = () => {

    if (chargesName != "") {
      let alreadInsert = 0;
      otherModalityList .map((element) => {
        if (element?.id === chargesName) {
          NotificationMessage(
            "warning",
            "Already insert this modality charge"
          );
          alreadInsert = 1;
        }
      })

      if (alreadInsert == 0) {
        setOtherModalityList([
          ...otherModalityList,
        {
          id: chargesName,
          reporting_charge: 0,
          communication_charge: 0
        }])

      }

    } else {

      NotificationMessage("warning", "Please, Enter modality name");
    }


  }

  const [updateOptionActivate, setUpdateOptionActivate] = useState(false);

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
      };

      if (resData?.website == undefined) {
        resData["website"] = "-"
      }

      setPayload(resData)

      if (id) {
        setIsLoading(true);

        await API.post(
          '/institute/v1/institute-details-update',
          { ...resData, id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', "Institution basic details updated successfully")
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

      if (updateOptionActivate) {
        setUpdateOptionActivate(false);
      } else {
        handleNextStep();
      }


    } else if (currentStep === 1) {

      let modality_details = {};

      ctModalistyList.map((element) => {
        modality_details[`CT ${element?.id}`] = {
          'reporting_charge': values[`ct_${element?.id}_reporting_charge`],
          "communication_charge": values[`ct_${element?.id}_communication_charge`]
        }
      });

      mrModalityList.map((element) => {
        modality_details[`MRI ${element?.id}`] = {
          'reporting_charge': values[`mri_${element?.id}_reporting_charge`],
          "communication_charge": values[`mri_${element?.id}_communication_charge`]
        }
      })
      
      crModalityList.map((element) => {
        modality_details[`${element?.id}`] = {
          'reporting_charge': values[`${element?.id}_reporting_charge`],
          "communication_charge": values[`${element?.id}_communication_charge`]
        }
      })

      otherModalityList.map((element) => {
        modality_details[`${element?.id}`] = {
          'reporting_charge': values[`${element?.id}_reporting_charge`],
          "communication_charge": values[`${element?.id}_communication_charge`]
        }
      })

      setPayload(prev => ({ ...prev, modality: modality_details }))

      if (id) {

        setIsLoading(true)
        await API.post(
          '/institute/v1/institute-modality-update',
          {
            id: id,
            modality_details: modality_details
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then(res => {
            if (res.data.status) {
              NotificationMessage('success', 'Institution modality charge updated successfully')
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


        if (updateOptionActivate) {
          setUpdateOptionActivate(false);
        } else {
          handleNextStep();
        }

      } else {
        if (updateOptionActivate) {
          setUpdateOptionActivate(false);
        } else {
          handleNextStep();
        }
      }


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
              NotificationMessage('success', "Institution report settings updated successfully")
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

      if (updateOptionActivate) {
        setUpdateOptionActivate(false);
      } else {
        handleNextStep();
      }

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

      if (updateOptionActivate) {
        setUpdateOptionActivate(false);
      } else {
        handleNextStep();
      }
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
              NotificationMessage('success', "Institution blocked user updated successfully")
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

      if (updateOptionActivate) {
        setUpdateOptionActivate(false);
      } else {
        handleNextStep();
      }
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
              NotificationMessage('success', 'Institution in-house radiologist updated successfully')
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
              NotificationMessage('success', 'Institution created successfully')
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

  // Institution report setting column 
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

  // Institution report column data
  const reportTableData = [
    {
      report_option: 'Attach institution info to report header',
      report_option_value: false,
      value_field: 'switch',
      report_value: 'institution_info_header'
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

  // Institution upload setting column information 
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

  // Institution upload setting column data 
  const uploadSettingsData = [
    {
      upload_option: 'Modify Study seriesId for Re-upload ',
      value: false
    }
  ]

  // Institution modality related table column
  const ctModalityColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <div style={{textAlign: "left", paddingLeft: 4}}>{text}</div>
      )
    },
    {
      title: 'Reporting Charge',
      dataIndex: 'reporting_charge',
      key: 'reporting_charge',
      render: (text, record) => (
        <Form.Item
          name={`ct_${record.id}_reporting_charge`}
          initialValue={text}
        >
          <Input type="number" />
        </Form.Item>
      )
    },
    {
      title: 'Communication Charge',
      dataIndex: 'communication_charge',
      key: 'communication_charge',
      render: (text, record) => (
        <Form.Item
          name={`ct_${record.id}_communication_charge`}
          initialValue={text}
        >
          <Input type="number" />
        </Form.Item>
      )
    } 
  ];
  
  const mriModalityColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <div style={{textAlign: "left", paddingLeft: 4}}>{text}</div>
      )
    },
    {
      title: 'Reporting Charge',
      dataIndex: 'reporting_charge',
      key: 'reporting_charge',
      render: (text, record) => (
        <Form.Item
          name={`mri_${record.id}_reporting_charge`}
          initialValue={text}
        >
          <Input type="number" />
        </Form.Item>
      )
    },
    {
      title: 'Communication Charge',
      dataIndex: 'communication_charge',
      key: 'communication_charge',
      render: (text, record) => (
        <Form.Item
          name={`mri_${record.id}_communication_charge`}
          initialValue={text}
        >
          <Input type="number" />
        </Form.Item>
      )
    } 
  ];

  const otherModalityColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <div>
          {text}
        </div>
      )
    },
    {
      title: 'Reporting Charge',
      dataIndex: 'reporting_charge',
      key: 'reporting_charge',
      render: (text, record) => (
        <Form.Item
          name={`${record.id}_reporting_charge`}
          initialValue={text}
        >
          <Input type="number" />
        </Form.Item>
      )
    },
    {
      title: 'Communication Charge',
      dataIndex: 'communication_charge',
      key: 'communication_charge',
      render: (text, record) => (
        <Form.Item
          name={`${record.id}_communication_charge`}
          initialValue={text}
        >
          <Input type="number" />
        </Form.Item>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          style={{ width: "100%" }}
          danger
          onClick={() => { ModalityDelete(record.id) }}
        >
          Delete
        </Button>
      )
    }
  ];

  const ModalityDelete = (modalityname) => {
    setOtherModalityList(otherModalityList.filter(element => element?.id !== modalityname));
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

          {id && (
            <div
              className='skip-to-last-option'
              onClick={() => { if (currentStep == 5) { setCurrentStep(0); } else { setCurrentStep(5); } }}>
              {currentStep == 5 ? "Skip To First" : "Skip To Last"}
            </div>
          )}


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

          {/* Step1 --- Institution details  */}

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
              style={{ marginTop: "25px" }}
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
                      },

                      {
                        validator: (rule, value) => {
                          if (!value) {
                            return Promise.resolve(); // No validation if value is not provided
                          }
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
                    <DatePicker format={"DD-MM-YYYY"} />
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
                    {/* <Select
                      placeholder="City"
                      options={[...cities]}
                      showSearch
                    // onChange={() => { form.submit() }}
                    /> */}
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
                    {/* <Select
                      placeholder="states"
                      options={[...states]}
                      showSearch
                    // onChange={() => { form.submit() }}
                    /> */}
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
                        required: false,
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
                        message: 'Enter storage allocated Limit'
                      }
                    ]}
                  >
                    <InputNumber placeholder='Enter storage allocated Limit' type='number' />
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
                <Col xs={24} sm={24} md={24} lg={24} className='justify-end'>
                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) {
                        setUpdateOptionActivate(true);
                        setIsModalOpen(true);
                      }
                      else form.submit()
                    }}
                    className='user-update-option-button'
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

          {/* Step2 --- Institution modality charge  */}

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

                {/* Customize modality related option  */}
                <div className='Add_institution_charge_input_layout'>
                  <Col span={16}>
                    <Input placeholder='Enter Charges Name'
                      value={chargesName} onChange={(e) => { setChargesName(e.target.value) }} />
                  </Col>
                  <Button style={{ marginLeft: "0.80rem" }} onClick={() => AddModalityDataHandler()}>+ Add Charge</Button>

                </div>

                <Col xs={24} sm={24} md={24} lg={24}>

                  <div className='modality-card-wrapper'>

                    {ctModalistyList?.length === 0 ? <>
                      <Empty
                        description="Not found any modality charges"
                      />
                    </> : <>

                      {/* ============ CT Modality and MRI Modality ============ */}
                      
                      <div style={{
                        display: "flex", 
                        flexDirection: "row", 
                        gap: 15, 
                        padding: 5, 
                        paddingBottom: 20
                      }}>

                        <div style={{
                          width: "50%"
                        }}>
                          <div style={{ 
                            fontWeight: 600, 
                            marginTop: 10,
                            paddingLeft: 10,
                            paddingBottom: 5 
                          }}>CT Modality</div>
                          <Divider style={{ marginTop: 5 }} />

                          <Table
                            columns={ctModalityColumns}
                            dataSource={ctModalistyList}
                            rowKey={"id"}
                            pagination={false}
                            className='institution-modality-table'
                          />
                        </div>

                        <div style={{
                          width: "50%"
                        }}>
                          <div style={{ 
                            fontWeight: 600, 
                            marginTop: 10,
                            paddingLeft: 10,
                            paddingBottom: 5 
                          }}>MRI Modality</div>
                          <Divider style={{ marginTop: 5 }} />

                          <Table
                            columns={mriModalityColumns}
                            dataSource={mrModalityList}
                            rowKey={"id"}
                            pagination={false}
                            className='institution-modality-table'
                          />
                        </div>

                      </div>
                        
                      {/* ========== CR Modality and Other Modality  ==========  */}

                      <div style={{
                        display: "flex", 
                        flexDirection: "row", 
                        gap: 15, 
                        padding: 5, 
                        paddingBottom: 20, 
                        borderTop: "1px solid rgb(157, 157, 157)"
                      }}>

                        <div style={{
                          width: "50%"
                        }}>
                          <div style={{ 
                            fontWeight: 600, 
                            marginTop: 10,
                            paddingLeft: 10,
                            paddingBottom: 5 
                          }}>CR Modality</div>
                          <Divider style={{ marginTop: 5 }} />

                          <Table
                            columns={otherModalityColumns}
                            dataSource={crModalityList}
                            rowKey={"id"}
                            pagination={false}
                            className='institution-modality-table'
                          />
                        </div>

                        <div style={{
                          width: "50%"
                        }}>
                          <div style={{ 
                            fontWeight: 600, 
                            marginTop: 10,
                            paddingLeft: 10,
                            paddingBottom: 5 
                          }}>Others</div>
                          <Divider style={{ marginTop: 5 }} />

                          <Table
                            columns={otherModalityColumns}
                            dataSource={otherModalityList}
                            rowKey={"id"}
                            pagination={false}
                            className='institution-modality-table'
                          />
                        </div>
                        
                      </div>

                    </>}

                  </div>
                </Col>

                {/* Previous, Update and Next Button  */}
                <Col xs={24} sm={24} md={24} lg={24} className='justify-end mt'>

                  <Button type='primary' onClick={handlePrevStep}
                    className='update-button-option'>
                    Previous
                  </Button>

                  <Button
                    type='primary'
                    onClick={() => {
                      if (id) {
                        setUpdateOptionActivate(true);
                        setIsModalOpen(true);
                      }
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                    className='user-update-option-button'
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

          {/* Step3 --- Institution report setting input  */}

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
                  <Table
                    columns={reportColumns}
                    dataSource={reportTableData}
                    pagination = {false}
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
                        setUpdateOptionActivate(true);
                        setIsModalOpen(true);
                      }
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                    className='user-update-option-button'
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

          {/* Step4 --- Institution upload setting option input  */}

          {currentStep === 3 && (
            <Form
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={30}>
                <Col lg={24} md={24} sm={24}>
                  <Table
                    columns={uploadSettingsColumns}
                    dataSource={uploadSettingsData}
                    pagination = {false}
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
                        setUpdateOptionActivate(true);
                        setIsModalOpen(true);
                      }
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                    className='user-update-option-button'
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

          {/* Step5 --- Institution blocked user option  */}
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
                      showSearch
                      mode='multiple'
                      options={radiologistOptions}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      value={selectedRadiologists}
                      onChange={handleChange}
                    >
                    </Select>
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
                      if (id) {
                        setUpdateOptionActivate(true);
                        setIsModalOpen(true);
                      }
                      else form.submit()
                    }}
                    style={{ marginLeft: '10px' }}
                    className='user-update-option-button'
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

          {/* Step6 ---- Institution inhouse radiologist option  */}
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
                      className='update-button-option' style={{ marginRight: "0.4rem" }}>
                      Previous
                    </Button>
                    <Button type='primary' htmlType='submit' className='user-update-option-button'>
                      Submit
                    </Button>
                  </div>

                </Col>
              </Row>
            </Form>
          )}

        </Spin>

      </Card>

      {/* ==== Update details conformation model ====  */}
      <Modal
        centered
        title='Confirmation'
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        okText='Update'
        className='user-details-update-conformation-modal'
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
