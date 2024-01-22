import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
  Tag,
  Tooltip
} from 'antd'
import { EyeFilled } from '@ant-design/icons'
import TableWithFilter from '../../components/TableWithFilter'
import EditActionIcon from '../../components/EditActionIcon'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { TbLockAccess } from 'react-icons/tb'
import UserFilterModal from '../../components/UserFilterModal'
import {
  disableUser,
  enableUser,
  filterUserData,
  getParticularUsersLogs,
  updateUserPassword
} from '../../apis/studiesApi'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import NotificationMessage from '../../components/NotificationMessage'
import APIHandler from "../../apis/apiHandler" ; 
import { modifyDate } from '../../helpers/utils'

const Users = () => {
  
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [logsData, setLogsData] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { permissionData } = useContext(UserPermissionContext)
  const [userTablePermission, setUserTablePermission] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [userID, setUserID] = useState(null) 

  const [logsUsername, setLogsUsername] = useState(null) ; 

  const navigate = useNavigate()

  const { changeBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setUserTablePermission(permissionData['UserTable view'])
  }, [permissionData])

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Users' }])
  }, [])

  const retrieveUsersData = async (pagination, values = {}) => {
    setIsLoading(true)
    const currentPagination = pagination || pagi
    filterUserData({
      filter: values,
      condition: 'and',
      page_number: currentPagination.page,
      page_size: currentPagination.limit || 10
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            ...item,
            role_name: item.role.role_name,
            institute_name: item.institute.name,
            username: item.user.username,
            email: item.user.email
          }))
          const data = modifyDate(resData)
          setTableData(data)
          setTotalPages(res.data.total_object)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => {
        NotificationMessage('warning', 'Network request failed',  err?.response?.data?.message)
      })
    setIsLoading(false)
  }

  const editActionHandler = id => {
    navigate(`/users/${id}/edit`)
  }

  const deleteActionHandler = async (id) => {

    setIsLoading(true) ;
    
    let responseData = await APIHandler("POST", {"id": id}, "user/v1/delete-user") ; 
    
    setIsLoading(false) ;

    if (responseData === false){

      NotificationMessage("warning", "Network request failed") ; 
    
    } else if (responseData['status'] === true){

      NotificationMessage("success", "Delete user successfully") ; 
      retrieveUsersData() ; 
    
    } else {

      NotificationMessage("warning", "Network request failed", responseData['message']) ; 
    }

  }

  const retrieveLogsData = (id, username) => {

    setLogsUsername(username) ; 

    getParticularUsersLogs({ id: id })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            ...data,
            perform_user: data?.perfrom_user?.username,
            target_user: data?.target_user?.username
          }))
          setLogsData(resData)
          setIsDrawerOpen(true)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => {
        NotificationMessage('warning', 'Network request failed',  err?.response?.data?.message)
      })
  }

  const checkPermissionStatus = name => {
    const permission = userTablePermission.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const statusChangeHandler = async (status, id) => {
    if (status) {
      await enableUser({ id })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', 'User Status Updated Successfully')
            retrieveUsersData()
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err =>
          NotificationMessage('warning',"Network request failed" , err.response.data.message)
        )
    
    } else {
      await disableUser({ id })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', 'User Status Updated Successfully')
            retrieveUsersData()
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err =>
          NotificationMessage('warning', "Network request failed" , err.response.data.message)
        )
    
    }
  }

  const columns = [
    checkPermissionStatus('View Username') && {
      title: 'Username',
      dataIndex: 'username',
      className: `${
        checkPermissionStatus('View Username') ? '' : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View Email') && {
      title: 'Email',
      dataIndex: 'email',
      className: `${
        checkPermissionStatus('View Email') ? '' : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View contact number') && {
      title: 'Contact Number',
      dataIndex: 'contact',
      className: `${
        checkPermissionStatus('View contact number')
          ? ''
          : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View Role name') && {
      title: 'Role',
      dataIndex: 'role_name',
      className: `${
        checkPermissionStatus('View Role name') ? '' : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View Institution name') && {
      title: 'Institute',
      dataIndex: 'institute_name',
      className: `${
        checkPermissionStatus('View Institution name')
          ? ''
          : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View Created time') && {
      title: 'Created At',
      dataIndex: 'created_at',
      className: `${
        checkPermissionStatus('View Created time') ? '' : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View last updated time') && {
      title: 'Updated At',
      dataIndex: 'updated_at',
      className: `${
        checkPermissionStatus('View last updated time')
          ? ''
          : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View Disable/Enable user option') && {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        return {
          children: (
            <Popconfirm
              title='Are you sure to update status?'
              onConfirm={() =>
                statusChangeHandler(!record?.user?.is_active, record.id)
              }
            >
              <Switch
                checkedChildren='Enable'
                checked={record?.user?.is_active}
                unCheckedChildren='Disable'
                className='table-switch'
              />
            </Popconfirm>
          )
        }
      }
    },
    
    checkPermissionStatus('Actions option access') && {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      className: `${
        checkPermissionStatus('Actions option access')
          ? ''
          : 'column-display-none'
      }`,
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>

          <EditActionIcon
            editActionHandler={() => editActionHandler(record.id)}
          />
          
          <Tooltip title={'Reset Password'}>
            <TbLockAccess
              className='action-icon'
              style={{ fontSize: '24px' }}
              onClick={() => {
                setUserID(record.id)
                setIsModalOpen(true)
              }}
            />
          </Tooltip>
          

          <Tooltip title={'View Logs'}>
            <EyeFilled
              className='action-icon action-icon-primary'
              onClick={() => retrieveLogsData(record.id, record.username)}
            />
          </Tooltip>

          <DeleteActionIcon
            deleteActionHandler={() => deleteActionHandler(record.id)}
          />

        </Space>
      )
    }
  ].filter(Boolean)

  const logsColumn = [
    {
      title: 'Perform User',
      dataIndex: 'perform_user', 
      width: 30
    },

    {
      title: 'Event',
      dataIndex: 'logs_id',
      width: 50, 
      render: text => (
        <Tag
          color={
            text.includes('User login')
              ? 'blue'
              : text.includes('create')
              ? 'green'
              : text.includes('basic details update')
              ? 'warning'
              : text.includes('modality details update')
              ? 'orange'
              : text.includes('institution details update')
              ? 'magenta'
              : text.includes('password update')
              ? 'lime'
              : text.includes(' Signature image')
              ? 'cyan'
              : text.includes('User disable')
              ? 'red'
              : 'purple'
          }
          className='event-type-tag'
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Time',
      dataIndex: 'time', 
      width: 30
    }
  ]

  const submitHandler = async values => {
    setIsLoading(true)
    await updateUserPassword({
      update_password: values.update_password,
      target_id: userID
    })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'User Password Updated Successfully')
          setUserID(null)
          setIsModalOpen(false)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', "Network request failed" ,err.response.data.message))
    setIsLoading(false)
  }

  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        // rowSelection={rowSelection}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveUsersData}
        loadingTableData={isLoading}
      />

      <UserFilterModal
        retrieveUsersData={retrieveUsersData}
        name={'User Filter'}
      />

      <Drawer
        title= {`${logsUsername} user logs`}
        placement='right'
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={600}
      >
        <TableWithFilter 
          tableData={logsData} 
          tableColumns={logsColumn} 
        />
      
      </Drawer>

      <Modal
        width={500}
        title={'Reset Password'}
        centered
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields()
          setIsModalOpen(false)
          setUserID(null)
        }}
      >
        {' '}
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
        
            <Col xs={24} lg={24}>
              <Form.Item
                label='New Password'
                name='update_password'
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
                  name='update_password'
                  style={{ marginBottom: '0.5rem' }}
                  placeholder='Enter Password'
                />
              </Form.Item>
            </Col>
        
            <Col xs={24} lg={24}>
              <Form.Item
                label='Confirm Password'
                name='confirmPassword'
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password'
                  },
                  ({ getFieldValue }) => ({
                    validator (_, value) {
                      if (
                        !value ||
                        getFieldValue('update_password') === value
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
                dependencies={['update_password']}
                hasFeedback
              >
                <Input.Password
                  autoComplete='off'
                  name='confirmPassword'
                  style={{ marginBottom: '0.5rem' }}
                  placeholder='Enter Confirm Password'
                />
              </Form.Item>
            </Col>

          </Row>
        
        </Form>
      </Modal>
    </>
  )
}

export default Users
