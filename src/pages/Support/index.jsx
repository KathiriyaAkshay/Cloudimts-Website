import React, { useContext, useEffect, useState } from 'react'
import SupportModal from '../../components/SupportModal'
import TableWithFilter from '../../components/TableWithFilter'
import { Space } from 'antd'
import EditActionIcon from '../../components/EditActionIcon'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { deleteStudy, deleteSupport, fetchSupport } from '../../apis/studiesApi'
import NotificationMessage from '../../components/NotificationMessage'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import { filterDataContext } from '../../hooks/filterDataContext'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'

const index = () => {
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { permissionData } = useContext(UserPermissionContext)
  const [supportId, setSupportId] = useState(null)
  const { isSupportModalOpen, setIsSupportModalOpen } =
    useContext(filterDataContext)

  const { changeBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Support' }])
    retrieveSupportData()
  }, [])

  const retrieveSupportData = async () => {
    setIsLoading(true)
    await fetchSupport()
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
      .catch(err => NotificationMessage('warning', 'Network request failed'))
    setIsLoading(false)
  }

  const editActionHandler = id => {
    setSupportId(id)
    setIsSupportModalOpen(true)
  }

  const deleteActionHandler = async id => {
    await deleteSupport({ id })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Support deleted Successfully')
          retrieveSupportData()
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

  const checkPermissionStatus = name => {
    const permission = permissionData['Support permission']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'option_value',
      render: (text, record) => (record?.option === 1 ? text : '-')
    },
    {
      title: 'Phone Number',
      dataIndex: 'option_value',
      render: (text, record) => (record?.option === 2 ? text : '-')
    },
    {
      title: 'Description',
      dataIndex: 'option_description'
    },
    (checkPermissionStatus('Edit Support details') ||
      checkPermissionStatus('Delete Support details')) && {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          {checkPermissionStatus('Edit Support details') && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
          )}
          {checkPermissionStatus('Delete Support details') && (
            <DeleteActionIcon
              deleteActionHandler={() => deleteActionHandler(record.id)}
            />
          )}
        </Space>
      )
    }
  ].filter(Boolean)
  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        loadingTableData={isLoading}
      />
      <SupportModal
        retrieveSupportData={retrieveSupportData}
        setSupportId={setSupportId}
        supportId={supportId}
      />
    </>
  )
}

export default index
