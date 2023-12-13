import { Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  createNewFilter,
  getInstitutionList,
  getModalityList,
  getParticularFilter,
  getRadiologistList,
  updateFilterData
} from '../apis/studiesApi'
import NotificationMessage from './NotificationMessage'
import dayjs from 'dayjs'

const StudyFilterModal = ({
  isFilterModalOpen,
  setIsFilterModalOpen,
  filterID,
  setFilterID,
  retrieveFilterOptions
}) => {
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
  const [form] = Form.useForm()

  useEffect(() => {
    retrieveInstitutionData()
    retrieveModalityData()
    retrieveRadiologistData()
  }, [])

  useEffect(() => {
    if (filterID) {
      retrieveFilterData(filterID)
    }
  }, [filterID])

  const retrieveFilterData = id => {
    getParticularFilter({ id })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            ...data,
            institution_name: data?.institution_name?.data,
            assigned_user: data?.assigned_user?.data,
            modality: data?.modality?.data,
            study_status: data?.study_status?.data,
            from_date: data.from_date && dayjs(data.from_date, 'YYYY-MM-DD'),
            to_date: data.to_date && dayjs(data.to_date, 'YYYY-MM-DD')
          }))
          form.setFieldsValue(resData[0])
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

  const retrieveInstitutionData = () => {
    getInstitutionList()
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            value: data.id,
            label: data.name
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
      .catch(err =>
        NotificationMessage(
          'warning',
          'Network request failed',
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
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err =>
        cNotificationMessage(
          'warning',
          'Network request failed',
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

  const submitHandler = values => {
    const modifiedObj = {
      ...values,
      from_date: values?.from_date
        ? values?.from_date?.format('YYYY-MM-DD')
        : '',
      to_date: values?.to_date ? values?.to_date?.format('YYYY-MM-DD') : '',
      study_status: values?.study_status ? values?.study_status : [],
      patient_id: values?.patient_id ? values?.patient_id : '',
      patient_name: values?.patient_name ? values?.patient_name : '',
      modality: values?.modality ? values?.modality : [],
      assigned_user: values?.assigned_user ? values?.assigned_user : [],
      institution_name: values?.institution_name ? values?.institution_name : []
    }
    if (filterID) {
      updateFilterData({ ...modifiedObj, id: filterID }).then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Filter Updated Successfully')
          setIsFilterModalOpen(false)
          form.resetFields()
          setFilterID(null)
          retrieveFilterOptions()
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
    } else {
      createNewFilter(modifiedObj)
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', 'New Filter Created Successfully')
            setIsFilterModalOpen(false)
            form.resetFields()
            retrieveFilterOptions()
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err => NotificationMessage('warning', err.response.data.message))
    }
  }

  return (
    <div>
      <Modal
        width={800}
        title={filterID ? 'Edit Filter' : 'Add Filter'}
        centered
        open={isFilterModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsFilterModalOpen(false)
          filterID && setFilterID(null)
        }}
      >
        <Form
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 24
          }}
          form={form}
          onFinish={submitHandler}
          autoComplete={'off'}
          style={{marginTop: "12px"}}
        >
          <Row gutter={15}>
            <Col xs={24} lg={12}>
              <Form.Item
                name='filter_name'
                label='Filter Name'
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please enter Filter Name'
                  }
                ]}
              >
                <Input placeholder='Enter Filter Name' />
              </Form.Item>
            </Col>
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
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  showSearch
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>
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
                  placeholder='Select Radiologist'
                  options={radiologistOptions}
                  showSearch
                  mode='multiple'
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='modality'
                label='Modality'
                rules={[
                  {
                    required: false,
                    message: 'Please enter modality'
                  }
                ]}
              >
                <Select
                  placeholder='Select modality'
                  options={modalityOptions}
                  showSearch
                  mode='multiple'
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='from_date'
                label='From Date'
                rules={[
                  {
                    required: false,
                    message: 'Please enter From Date'
                  }
                ]}
              >
                <DatePicker format={'YYYY-MM-DD'} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='to_date'
                label='To Date'
                rules={[
                  {
                    required: false,
                    message: 'Please enter to date'
                  }
                ]}
              >
                <DatePicker format={'YYYY-MM-DD'} />
              </Form.Item>
            </Col>
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
                <Input placeholder='Enter Patient Name' />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name='patient_id'
                label='Patient ID'
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: 'Please enter Patient ID'
                  }
                ]}
              >
                <Input placeholder='Enter Patient ID' />
              </Form.Item>
            </Col>
            {/* <Col xs={24} lg={12}>
              <Form.Item
                name="accession_number"
                label="Accession Number"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter Accession Number",
                  },
                ]}
              >
                <Input placeholder="Enter Accession Number" />
              </Form.Item>
            </Col> */}
            <Col xs={24} lg={12}>
              <Form.Item
                name='study_description'
                label='Study Description'
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: 'Please enter Study Description'
                  }
                ]}
              >
                <Input placeholder='Enter Study Description' />
              </Form.Item>
            </Col>
            {/* <Col xs={24} lg={12}>
              <Form.Item
                name="referring_physician"
                label="Referring Physician"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter Referring Physician",
                  },
                ]}
              >
                <Input placeholder="Enter Referring Physician" />
              </Form.Item>
            </Col> */}
            {/* <Col xs={24} lg={12}>
              <Form.Item
                name="performing_physician"
                label="Performing Physician"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter Performing Physician",
                  },
                ]}
              >
                <Input placeholder="Enter Performing Physician" />
              </Form.Item>
            </Col> */}
            <Col xs={24} lg={12}>
              <Form.Item
                name='study_status'
                label='Study Status'
                rules={[
                  {
                    required: false,
                    message: 'Please enter Study Status'
                  }
                ]}
              >
                <Select
                  placeholder='Select Status'
                  options={statusOptions}
                  showSearch
                  mode='multiple'
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default StudyFilterModal
