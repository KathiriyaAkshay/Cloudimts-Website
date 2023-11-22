import React, { useContext, useEffect, useState } from 'react'
import TableWithFilter from '../../components/TableWithFilter'
import EditActionIcon from '../../components/EditActionIcon'
import { getReportList } from '../../apis/studiesApi'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserPermissionContext } from '../../hooks/userPermissionContext'

const index = () => {
  const [reportsData, setReportsData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagi, setPagi] = useState({ page: 1 })
  const [totalPages, setTotalPages] = useState(0)
  const { changeBreadcrumbs } = useBreadcrumbs()
  const navigate = useNavigate()
  const { permissionData } = useContext(UserPermissionContext)

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Reports' }])
    retrieveReportsData()
  }, [])

  const retrieveReportsData = pagination => {
    setIsLoading(true)
    const currentPagination = pagination || pagi
    getReportList({ page_number: currentPagination.page, page_limit: 10 })
      .then(res => {
        if (res.data.status) {
          setReportsData(res.data.data)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed', err.response.data.message))
    setIsLoading(false)
  }

  const editActionHandler = id => {
    navigate(`/reports/${id}/edit`)
  }

  const checkPermissionStatus = name => {
    const permission = permissionData['TemplateTable view'].find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'name'
      // className: `${
      //   checkPermissionStatus("View Full name") ? "" : "column-display-none"
      // }`,
    },
    checkPermissionStatus('View created at') && {
      title: 'Created At',
      dataIndex: 'created_at',
      className: `${
        checkPermissionStatus('View created at') ? '' : 'column-display-none'
      }`
    },
    checkPermissionStatus('View last updated at') && {
      title: 'Updated At',
      dataIndex: 'updated_at',
      className: `${
        checkPermissionStatus('View last updated at')
          ? ''
          : 'column-display-none'
      }`
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          {checkPermissionStatus('Edit template option') && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
          )}
        </Space>
      )
    }
  ].filter(Boolean)

  return (
    <TableWithFilter
      tableData={reportsData}
      tableColumns={columns}
      // rowSelection={rowSelection}
      loadingTableData={isLoading}
      setPagi={setPagi}
      totalRecords={totalPages}
      onPaginationChange={retrieveReportsData}
    />
  )
}

export default index
