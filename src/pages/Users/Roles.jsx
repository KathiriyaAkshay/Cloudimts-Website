import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Modal, Space, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TableWithFilter from '../../components/TableWithFilter'
import EditActionIcon from '../../components/EditActionIcon'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import API from '../../apis/getApi'
import NotificationMessage from '../../components/NotificationMessage'
import { TbLockAccess } from 'react-icons/tb'
import { UserRoleContext } from '../../hooks/usersRolesContext'

const Roles = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { isRoleModalOpen, setIsRoleModalOpen } = useContext(UserRoleContext)
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [roleID, setRoleID] = useState(null)
  const [form] = Form.useForm()
  const recordsPage = 10
  const lastIndex = currentPage * recordsPage
  const firstIndex = lastIndex - recordsPage
  const records = tableData.slice(firstIndex, lastIndex)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const { changeBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Roles' }])
    retrieveRoleData()
  }, [])

  const editActionHandler = record => {
    form.setFieldsValue(record)
    setRoleID(record.id)
    setIsRoleModalOpen(true)
  }


  const retrieveRoleData = async () => {
    setIsLoading(true)
    await API.post(
      '/role/v1/fetch_role_list',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => {
        if (res.data.status) {
          setTableData(res.data.data)
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
    setIsLoading(false)
  }

  const columns = [

    {
      title: 'Role Name',
      dataIndex: 'role_name'
    },
    
    {
      title: 'Created At',
      dataIndex: 'role_created_at'
    },
    
    {
      title: 'Last Updated',
      dataIndex: 'role_updated_at'
    },
    
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>

          <EditActionIcon editActionHandler={() => editActionHandler(record)} />
    
          <Tooltip title={'Add Permissions'}>
            <TbLockAccess
              className='action-icon'
              style={{ fontSize: '24px' }}
              onClick={() => navigate(`/users/roles/${record.id}/permissions`)}
            />
          </Tooltip>
    
        </Space>
      )
    }
  ]

  const handleSubmit = async values => {

    setIsLoading(true)
    
    if (!roleID) {
    
      await API.post('/role/v1/create_role', values, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', 'Role Created Successfully')
            setIsRoleModalOpen(false)
            form.resetFields()
            retrieveRoleData()
            setRoleID(null)
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err => NotificationMessage('warning', "Network request failed")) 
    } else if (roleID) {

      await API.post(
        '/role/v1/update_user_role_name',
        {
          update_role_name: values.role_name,
          role_id: roleID
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then(res => {
          if (res.data.status) {

            NotificationMessage('success', 'Role Updated Successfully')
            setIsRoleModalOpen(false)
            form.resetFields() ; 
            retrieveRoleData() ; 
            setRoleID(null) ; 
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err => {
          console.log("Call this function");
          NotificationMessage('warning', "Network request failed")
        })
    }
    setIsLoading(false)
  }

  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        loadingTableData={isLoading}
      />

      {/* === Add new role option modal ===  */}

      <Modal
        title='Add New Role'
        centered
        open={isRoleModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsRoleModalOpen(false)
          setRoleID(null)
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
          style={{marginTop: "12px"}}
        >
          <Form.Item
            name='role_name'
            label='Role Name'
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please enter role name'
              }
            ]}
          >
            <Input
              style={{ marginBottom: '0.5rem' }}
              placeholder='Enter Role'
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Roles
