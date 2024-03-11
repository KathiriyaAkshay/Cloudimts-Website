import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Modal, Select, Space, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TableWithFilter from '../../components/TableWithFilter'
import EditActionIcon from '../../components/EditActionIcon'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import API from '../../apis/getApi'
import NotificationMessage from '../../components/NotificationMessage'
import { UserEmailContext } from '../../hooks/userEmailContext'
import EmailFilterModal from '../../components/EmailFilterModal'
import { deleteEmail, emailFilterData } from '../../apis/studiesApi'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import { modifyDate } from '../../helpers/utils'

const Email = () => {
  const [emailData, setEmailData] = useState([])
  const { isEmailModalOpen, setIsEmailModalOpen } = useContext(UserEmailContext)
  const [form] = Form.useForm()
  const [roleOptions, setRoleOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem('token')
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [emailID, setEmailID] = useState(null)
  const { permissionData } = useContext(UserPermissionContext)

  const { changeBreadcrumbs } = useBreadcrumbs() 

  // **** Reterive email table data **** // 

  const retrieveEmailData = async (pagination, values = {}) => {
    const currentPagination = pagination || pagi
    setIsLoading(true)
    emailFilterData({
      filter: values,
      condition: 'and',
      page_number: currentPagination.page,
      page_size: currentPagination.limit || 10
    })
      .then(res => {
        if (res.data.status) {
          const updatedData = modifyDate(res.data.data)
          setEmailData(updatedData)
          setTotalPages(res.data.total_object)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed'))
    setIsLoading(false)
  }

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Email' }])
    retrieveRoleOptions()
  }, [])


  const editActionHandler = async id => {
    setEmailID(id)
    await API.post(
      '/email/v1/fetch-particular-email',
      { id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (res.data.status) {
          form.setFieldsValue(res.data.datat)
          setIsEmailModalOpen(true)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => {
        NotificationMessage('warning', 'Network request failed')
      })
  }

  const deleteActionHandler = async id => {
    await deleteEmail({ id })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Email deleted successfully')
          retrieveEmailData()
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed'))
  }

  // **** Retervie role list for insert email **** // 

  const retrieveRoleOptions = async () => {
    setIsLoading(true)
    await API.get('/email/v1/role-fetch', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(role => ({
            label: role.role_name,
            value: role.id
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
      .catch(err => NotificationMessage('warning', 'Network request failed'))
    setIsLoading(false)
  }

  const checkPermissionStatus = name => {
    const permission = permissionData['EmailTable view'].find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  // Email column 
  const columns = [

    checkPermissionStatus('View Full name') && {
      title: 'Full Name',
      dataIndex: 'full_name',
      className: `${checkPermissionStatus('View Full name') ? '' : 'column-display-none'
        }`
    },

    {
      title: 'Email',
      dataIndex: 'email'
    },

    checkPermissionStatus('Active status') && {
      title: 'Status',
      dataIndex: 'active_status',
      className: `${checkPermissionStatus('Active status') ? '' : 'column-display-none'
        }`,
      render: (text, record) => `${text ? 'Active' : 'Inactive'}`
    },

    checkPermissionStatus('View User Role') && {
      title: 'Role',
      dataIndex: 'role',
      className: `${checkPermissionStatus('View User Role') ? '' : 'column-display-none'
        }`,
      render: (text, record) => `${record?.role?.role_name}`
    },

    {
      title: 'Contact',
      dataIndex: 'contact'
    },

    {
      title: 'Created At',
      dataIndex: 'created_at'
    },

    {
      title: 'Updated At',
      dataIndex: 'updated_at'
    },

    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>

          {checkPermissionStatus('Edit option') && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
          )}

          {checkPermissionStatus('Delete option') && (
            <DeleteActionIcon
              title = {"Delete email"}
              description={"Are you sure you want to delete this email?"}
              deleteActionHandler={() => deleteActionHandler(record.id)}
            />
          )}

        </Space>
      )
    }
  ].filter(Boolean)

  // ==== Insert and Edit email address handler ==== // 

  const handleSubmit = async (values) => {

    if (values.active_status === undefined) {
      values.active_status = false
    }

    setIsLoading(true)
    if (!emailID) {
      await API.post('/email/v1/insert-email', values, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', 'Email added successfully')
            form.resetFields()
            setIsEmailModalOpen(false)
            retrieveEmailData()
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err => { NotificationMessage('warning', "Network request failed", err?.response?.data?.message) })
    } else {

      await API.post(
        '/email/v1/edit-email',
        { ...values, id: emailID },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', 'Email updated successfully')
            form.resetFields()
            setIsEmailModalOpen(false)
            retrieveEmailData()
            setEmailID(null)
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err => NotificationMessage('warning', "Network request failed"))
    }
    setIsLoading(false)
  }

  return (
    <>

      <TableWithFilter
        tableData={emailData}
        tableColumns={columns}
        loadingTableData={isLoading}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveEmailData}
      />

      {/* === Add new email modal ====  */}

      <Modal
        title='Email address'
        open={isEmailModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsEmailModalOpen(false)
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
          onFinish={handleSubmit}
          style={{ marginTop: "12px" }}
        >
          <Form.Item
            name='full_name'
            label='Full Name'
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please enter full name'
              }
            ]}
          >
            <Input placeholder='Enter Full Name' />
          </Form.Item>

          <Form.Item
            name='email'
            label='Email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please enter email address'
              }
            ]}
          >
            <Input placeholder='Enter Email' />
          </Form.Item>

          <Form.Item
            name='contact'
            label='Contact'
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please enter contact number'
              },
              {
                validator: (rule, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

                  const indianPhoneNumberRegex = /^[6-9]\d{9}$/;

                  if (indianPhoneNumberRegex.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Invalid contact number");
                  }
                },
              },
            ]}
          >
            <Input placeholder='Enter Contact Number' />
          </Form.Item>

          <Form.Item
            label='Role'
            name='role_id'
            className='category-select'
            rules={[
              {
                required: true,
                message: 'Please select role'
              }
            ]}
          >
            <Select
              placeholder='Select Role'
              options={roleOptions}
              showSearch
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name='active_status'
            label='Active'
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>

        </Form>

      </Modal>

      <EmailFilterModal
        retrieveEmailData={retrieveEmailData}
        name={'Email Filter'}
      />
    </>
  )
}

export default Email
