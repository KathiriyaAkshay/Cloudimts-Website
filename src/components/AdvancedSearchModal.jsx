import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { filterDataContext } from '../hooks/filterDataContext'
import { FilterSelectedContext } from '../hooks/filterSelectedContext'
import { getModalityList, getRadiologistList } from '../apis/studiesApi'
import API from '../apis/getApi';
import NotificationMessage from './NotificationMessage';
import APIHandler from '../apis/apiHandler'

const AdvancedSearchModal = ({ name, retrieveStudyData, advanceSearchFilterData, quickFilterform }) => {

  const { isAdvancedSearchModalOpen, setIsAdvancedSearchModalOpen, setIsStudyQuickFilterModalOpen } = useContext(filterDataContext);
  const { setIsFilterSelected, setIsAdvanceSearchSelected } = useContext(FilterSelectedContext);
  const [patientNameOptions, setPatientNameOptions] = useState([]) ; 
  const [form] = Form.useForm();

  const [institutionOptions, setInstitutionOptions] = useState([])
  const [radiologistOptions, setRadiologistOptions] = useState([])
  const [modalityOptions, setModalityOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([
    {
      label: 'New',
      value: 'New'
    },
    {
      label: 'Viewed',
      value: 'Viewed'
    },
    {
      label: 'Assigned',
      value: 'Assigned'
    },
    {
      label: 'InReporting',
      value: 'InReporting'
    },
    {
      label: 'Reported',
      value: 'Reported'
    },
    {
      label: 'ViewReport',
      value: 'ViewReport'
    },
    {
      label: 'ClosedStudy',
      value: 'ClosedStudy'
    }
  ])

  const handleSubmit = values => {
    const modifiedValues = {
      ...values,
      institution_name: values?.institution_name
        ? values?.institution_name
        : [],
      assigned_user: values?.assigned_user ? values?.assigned_user : [],
      modality: values?.modality ? values?.modality : [],
      study_status: values?.study_status ? values?.study_status : [],
      patient_name: values?.patient_name ? values?.patient_name : '',
      patient_id: values?.patient_id ? values?.patient_id : '',
      from_date: values?.from_date
        ? values?.from_date.format('YYYY-MM-DD')
        : '',
      to_date: values?.to_date ? values?.to_date.format('YYYY-MM-DD') : ''
    }

    advanceSearchFilterData({ page: 1 }, modifiedValues)
    setIsAdvancedSearchModalOpen(false)
    setIsFilterSelected(false)
    setIsAdvanceSearchSelected(true)
    setIsStudyQuickFilterModalOpen(false);
    quickFilterform.resetFields();
  }

  const retrieveInstitutionData = async () => {
    const token = localStorage.getItem('token');
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
          setInstitutionOptions(resData);
        } else {
          NotificationMessage(
            'warning',
            'Advanced Search',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Advanced Search',
          err.response.data.message
        )
      )
  }

  const retrieveRadiologistData = () => {
    getRadiologistList({ role_id: localStorage.getItem('role_id') })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            label: data.name,
            value: data.id
          }))
          setRadiologistOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Advanced Search',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Advanced Search',
          err.response.data.message
        )
      )
  }

  const retrieveModalityData = () => {
    getModalityList()
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            label: data.name,
            value: data.name
          }))
          setModalityOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Advanced Search',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Advanced Search',
          err.response.data.message
        )
      )
  }
  const AllPatientNameFetch = async () => {

    let responseData = await APIHandler("POST", {}, "studies/v1/all_patient_name") ; 

    if (responseData === false){
      NotificationMessage("warning", "Network request failed") ; 
    
    } else if (responseData?.status){
      const resData = [] 
      responseData?.data.map((element) => {
        resData.push({
          label: element, 
          value: element
        })
      })
      setPatientNameOptions(resData) ; 

    } else {
      NotificationMessage("warning", "Network request failed", responseData?.message) ; 
    }
  }


  useEffect(() => {
    if (isAdvancedSearchModalOpen) {
      retrieveInstitutionData()
      retrieveModalityData()
      retrieveRadiologistData()
      AllPatientNameFetch() ; 

      form.resetFields();
    }
  }, [isAdvancedSearchModalOpen]);


  return (
    <Modal
      centered
      width={'75%'}
      title={name}
      open={isAdvancedSearchModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setIsAdvancedSearchModalOpen(false)
      }}
      className='Advance-search-modal'
      footer={[
        // Cancel option button
        <Button
          key='back'
          onClick={() => {
            setIsAdvancedSearchModalOpen(false)
          }}
        >
          Cancel
        </Button>,

        // Clear filter option button
        <Button
          key='submit'
          type='primary'
          onClick={() => {
            form.resetFields()
            // setIsAdvancedSearchModalOpen(false)
            retrieveStudyData()
            setIsFilterSelected(false)
            setIsAdvanceSearchSelected(false)
          }}
        >
          Clear Filter
        </Button>,

        // Apply filter option button
        <Button key='submit' type='primary' onClick={() => form.submit()}>
          Apply
        </Button>
      ]}
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
        autoComplete={'off'}
      >
        <Row gutter={15}>
          {/* ===== Patient name ====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='patient_name'
              label='Patient Name'
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: 'Please enter Patient Name'
                }
              ]}
            >

                <Select
                  placeholder="Patient name"
                  options={[...patientNameOptions]}
                  showSearch
                  // onChange={() => { form.submit() }}
                />
            </Form.Item>
          </Col>

          {/* ==== Patient id =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='patient_id'
              label='Patient Id'
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: 'Please enter Patient Id'
                }
              ]}
            >
              <Input placeholder='Enter Patient Id' />
            </Form.Item>
          </Col>

          {/* ===== Institution name =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='institution_name'
              label='Institution Name'
              rules={[
                {
                  required: false,
                  message: 'Please enter Institution Name'
                }
              ]}
            >
              <Select
                placeholder='Select Institution'
                options={institutionOptions}
                mode='multiple'
              />
            </Form.Item>
          </Col>

          {/* ===== Assigned user ======  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='assigned_user'
              label='Assigned User'
              rules={[
                {
                  required: false,
                  message: 'Please enter Assigned User'
                }
              ]}
            >
              <Select
                placeholder='Select Assigned User'
                options={radiologistOptions}
                mode='multiple'
              />
            </Form.Item>
          </Col>

          {/* ===== Modality ======  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='modality'
              label='Modality'
              rules={[
                {
                  required: false,
                  message: 'Please enter Modality'
                }
              ]}
            >
              <Select
                placeholder='Select Modality'
                options={modalityOptions}
                mode='multiple'
              />
            </Form.Item>
          </Col>

          {/* ===== Study status =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='study_status'
              label='Status'
              rules={[
                {
                  required: false,
                  message: 'Please enter Status'
                }
              ]}
            >
              <Select
                placeholder='Select Status'
                options={statusOptions}
                mode='multiple'
              />
            </Form.Item>
          </Col>

          {/* ===== From date =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='from_date'
              label='From Date'
              rules={[
                {
                  required: false,
                  message: 'Please enter date'
                }
              ]}
            >
              <DatePicker format={'DD-MM-YYYY'} />
            </Form.Item>
          </Col>

          {/* ==== To date =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name='to_date'
              label='To Date'
              rules={[
                {
                  required: false,
                  message: 'Please enter date'
                }
              ]}
            >
              <DatePicker format={'DD-MM-YYYY'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AdvancedSearchModal
