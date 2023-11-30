import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Drawer, Popconfirm, Progress, Space, Switch, Tag, Tooltip } from 'antd'
import { EyeFilled, PlusOutlined } from '@ant-design/icons'
import TableWithFilter from '../../components/TableWithFilter'
import EditActionIcon from '../../components/EditActionIcon'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import FilterModal from '../../components/FilterModal'
import {
  disableInstitution,
  enableInstitution,
  filterInstitutionData,
  getInstitutionLogs
} from '../../apis/studiesApi'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import NotificationMessage from '../../components/NotificationMessage'
import APIHandler from '../../apis/apiHandler'

const Institution = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [institutionData, setInstitutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(0);
  const [logsData, setLogsData] = useState([]);
  const navigate = useNavigate();
  const { permissionData } = useContext(UserPermissionContext);
  const [institutionName, setInstitutionName] = useState("") ; 

  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    // Set initial breadcrumb when the component mounts
    changeBreadcrumbs([{ name: 'Institution' }])
    retrieveInstitutionData()
  }, [])

  // Function to retrieve institution data
  const retrieveInstitutionData = async (pagination, values = {}) => {
    setIsLoading(true)

    const currentPagination = pagination || pagi

    // Filter institution data API call
    filterInstitutionData({
      filter: values,
      condition: 'and',
      page_number: currentPagination.page,
      page_size: currentPagination.limit || 10
    })
      .then(res => {
        // Check if the response status is true
        if (res.data.status) {
        setTotalPages(res.data.total_object)
        setInstitutionData(res.data.data)
         } else {
            // Display a warning notification if the response status is false
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

  const editActionHandler = id => {
    navigate(`/institutions/${id}/edit`)
  }

  const deleteActionHandler = async element => {
    setIsLoading(true)

    let requestPayload = {
      id: element.id
    }

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'institute/v1/institution-delete'
    )

    setIsLoading(false)
    
    if (responseData === false) {
      NotificationMessage("warning", "Network request failed") ; 

    } else if (responseData['status'] === true) {
      
      NotificationMessage('success', 'Institution delete successfully')
      retrieveInstitutionData()
    
    } else {

      NotificationMessage('warning', "Network request failed", responseData['message']) ; 
    }
  }

  const retrieveLogsData = (id, name) => {
    setInstitutionName(`${name} institution logs`)
    getInstitutionLogs({ id: id })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            ...data,
            institution: data.institution.name,
            username: data.user_info.username
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
        NotificationMessage('warning', 'Network request failed', err?.response?.data?.message)
      })
  }

  const checkPermissionStatus = name => {
    const permission = permissionData['InstitutionTable view']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const statusChangeHandler = async (status, id) => {
    if (status) {
      await enableInstitution({ id })
        .then(res => {
          if (res.data.status) {
          NotificationMessage(
            'success',
            'Institution Status Updated Successfully'
          )
          retrieveInstitutionData()
            } else {
        NotificationMessage(
          'warning',
          'Network request failed',
          res.data.message
        )
      }
        })
        .catch(err =>
          NotificationMessage('warning', "Network reqeust failed", err?.response?.data?.message)
        )
    } else {
      await disableInstitution({ id })
        .then(res => {
          if (res.data.status) {
          NotificationMessage(
            'success',
            'Institution Status Updated Successfully'
          )
          retrieveInstitutionData()
            } else {
        NotificationMessage(
          'warning',
          'Network request failed',
          res.data.message
        )
      }
        })
        .catch(err =>
          NotificationMessage('warning', "Network request failed", err?.response?.data?.message)
        )
  }
  }

  // Columns definition for the institution table
  const columns = [
    // Actions column
    checkPermissionStatus('View Institution name') && {
      title: 'Institution Name',
      dataIndex: 'name',
      className: `${
        checkPermissionStatus('View Institution name')
          ? ''
          : 'column-display-none'
      }`
    },

    checkPermissionStatus('View Institution email') && {
      title: 'Email',
      dataIndex: 'email',
      className: `${
        checkPermissionStatus('View Institution email')
          ? ''
          : 'column-display-none'
      }`,
      width: 200
    },

    checkPermissionStatus('View Institution contact number') && {
      title: 'Contact Number',
      dataIndex: 'contact',
      className: `${
        checkPermissionStatus('View Institution contact number')
          ? ''
          : 'column-display-none'
      }`
    },

    checkPermissionStatus('View Institution City') && {
      title: 'City',
      dataIndex: 'city',
      className: `${
        checkPermissionStatus('View Institution City')
          ? ''
          : 'column-display-none'
      }`
    },
    checkPermissionStatus('View Institution State') && {
      title: 'State',
      dataIndex: 'state',
      className: `${
        checkPermissionStatus('View Institution State')
          ? ''
          : 'column-display-none'
      }`
    },
    
    {
      title: 'Country',
      dataIndex: 'country'
    },
    
    {
      title: 'Allocated Storage',
      dataIndex: 'allocated_storage'
    },

    checkPermissionStatus('View Institution space usage') && {
      title: 'Usage',
      dataIndex: 'institution_space_usage',
      className: `${
        checkPermissionStatus('View Institution space usage')
          ? ''
          : 'column-display-none'
      }`,
      render: (text, record) => {
        let Calculate_usaeg_permission = parseFloat(parseFloat(record.space_usage / record.allocated_storage)*100).toFixed(2); 
        return <Progress percent={Calculate_usaeg_permission} style={{width: 30}} />;
      }
      
    },

    checkPermissionStatus('View Institution created at') && {
      title: 'Created At',
      dataIndex: 'created_at',
      className: `${
        checkPermissionStatus('View Institution created at')
          ? ''
          : 'column-display-none'
      }`
    },

    checkPermissionStatus('View Institution last updated at') && {
      title: 'Updated At',
      dataIndex: 'updated_at',
      className: `${
        checkPermissionStatus('View Institution last updated at')
          ? ''
          : 'column-display-none'
      }`
    },

    checkPermissionStatus('View Disable/Enable Institution option') && {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        return {
          children: (
            <Popconfirm
              title='Are you sure to update status?'
              onConfirm={() => statusChangeHandler(record?.disable, record.id)}
            >
              <Switch
                checkedChildren='Enable'
                checked={!record?.disable}
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
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <EditActionIcon
            editActionHandler={() => editActionHandler(record.id)}
          />
          <Tooltip title={"View Logs"}>
            <EyeFilled
              className="action-icon action-icon-primary"
              onClick={() => retrieveLogsData(record.id, record.name)}
            />
          </Tooltip>

          <DeleteActionIcon
            deleteActionHandler={() => deleteActionHandler(record)}
          />

        </Space>
      )
    }
  ].filter(Boolean)

  // Columns definition for the logs table
  const logsColumn = [
    {
      title: "Perform User",
      dataIndex: "username",
      width: 20
    },

    {
      title: 'Event',
      dataIndex: 'event_info',
      width: 60,
      render: text => (
        <Tag
          color={
            text.includes('User login')
              ? 'blue'
              : text.includes('create')
              ? 'green'
              : text.includes('basic details update')
              ? 'warning'
              : text.includes('modality charge update')
              ? 'orange'
              : text.includes('studyID setting update')
              ? 'magenta'
              : text.includes('report settings update')
              ? 'lime'
              : text.includes(' Signature image')
              ? 'cyan'
              : text.includes(' blocked user details update')
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
      width: 25
    }
  ]

  return (
    <>
      <TableWithFilter
        tableData={institutionData}
        tableColumns={columns}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveInstitutionData}
        loadingTableData={isLoading}
      />

      <FilterModal
        name='Institution Filter'
        setInstitutionData={setInstitutionData}
        retrieveInstitutionData={retrieveInstitutionData}
      />

      <Drawer
        title={institutionName}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={800}
        className='Institution-logs-table'
      >
        <TableWithFilter tableData={logsData} tableColumns={logsColumn} />
      </Drawer>
    </>
  )
}

export default Institution
