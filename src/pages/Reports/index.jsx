import React, { useContext, useEffect, useState } from 'react'
import TableWithFilter from '../../components/TableWithFilter'
import EditActionIcon from '../../components/EditActionIcon'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { DeleteOutlined } from '@ant-design/icons'
import { getReportList } from '../../apis/studiesApi'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Button, Space, Popconfirm } from 'antd'
import { useNavigate } from 'react-router-dom'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import APIHandler from '../../apis/apiHandler'
import NotificationMessage from '../../components/NotificationMessage'
import { modifyDate } from '../../helpers/utils'

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
          const updatedData = modifyDate(res.data.data)
          setReportsData(updatedData)
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
    setIsLoading(false)
  }

  const editActionHandler = id => {
    navigate(`/reports/${id}/edit`)
  }

  const DeleteTemplateOptionHandler = async id => {
    setIsLoading(true)

    let responsePayload = { id: id }

    let responseData = await APIHandler(
      'POST',
      responsePayload,
      'report/v1/deleteReport'
    )

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed')
    } else if (responseData['status'] === true) {
      NotificationMessage('success', 'Successfully delete template')

      retrieveReportsData()
    } else {
      NotificationMessage(
        'warning',
        'Network request failed',
        responseData['message']
      )
    }
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

          {checkPermissionStatus('Delete template option') && (
                <DeleteActionIcon deleteActionHandler={() => DeleteTemplateOptionHandler(record.id)}/>
          )}
        </Space>
      )
    }
  ].filter(Boolean)

  return (
    <TableWithFilter
      tableData={reportsData}
      tableColumns={columns}
      loadingTableData={isLoading}
      setPagi={setPagi}
      totalRecords={totalPages}
      onPaginationChange={retrieveReportsData}
    />
  )
}

export default index
