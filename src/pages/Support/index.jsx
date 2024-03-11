import React, { useContext, useEffect, useState } from 'react'
import SupportModal from '../../components/SupportModal'
import TableWithFilter from '../../components/TableWithFilter'
import { Space } from 'antd'
import EditActionIcon from '../../components/EditActionIcon'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { deleteSupport, fetchSupport } from '../../apis/studiesApi'
import NotificationMessage from '../../components/NotificationMessage'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import { filterDataContext } from '../../hooks/filterDataContext'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'

const index = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { permissionData } = useContext(UserPermissionContext)
  const [supportId, setSupportId] = useState(null)
  
  const { setIsSupportModalOpen,emailSupportOption, phoneSupportOption, 
    setEmailSupportOption, setPhoneSupportOption  } =useContext(filterDataContext)
  const { changeBreadcrumbs } = useBreadcrumbs()

  const [supportTableColumn, setSupportTableColumn] = useState([]) ; 
  const [emailTableData, setEmailTableData] = useState([]) ; 
  const [phoneTableData, setPhoneTableData] = useState([]) ; 
  const [tableData, setTableData] = useState([]) ; 

  // ** Permission handler ** // 

  const checkPermissionStatus = name => {
    const permission = permissionData['Support permission']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  // **** Fetch support table data **** // 
  const retrieveSupportData = async () => {
    setIsLoading(true)
    await fetchSupport()
      .then(res => {
        if (res.data.status) {

          let emailtemp = [] ; 
          let phonetemp = [] ; 

          res.data.data.map((element) => {
            if (element.option === 1){
              emailtemp.push(element) ; 
            } else{
              phonetemp.push(element) ; 
            }
          })

          setEmailTableData([...emailtemp]) ;
          setPhoneTableData([...phonetemp]) ;  

          if (emailSupportOption){
            setTableData([...emailtemp]) ; 
          } else {
            setTableData([...phonetemp]) ; 
          }

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

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Support' }])
    retrieveSupportData()
  }, [])


  const editActionHandler = id => {
    setSupportId(id)
    setIsSupportModalOpen(true)
  }

  // **** Study data delete option handler **** // 

  const deleteActionHandler = async id => {
    await deleteSupport({ id })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Successfully deleted support details')
          retrieveSupportData()
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning','Network request failed', err.response.data.message))
  }

  // ==== Support table column ==== // 

  const emailColumn = [
    {
      title: 'Email',
      dataIndex: 'option_value',
      render: (text, record) => (record?.option === 1 ? text : '-')
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
              title = "Delete support"
              description = "Are you sure you want to delete this Support details?"
              deleteActionHandler={() => deleteActionHandler(record.id)}
            />
          )}
        
        </Space>
      )
    }
  ].filter(Boolean) ; 

  const phoneColumn = [
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
              title = "Are you sure you want to delete this Support details?"
              deleteActionHandler={() => deleteActionHandler(record.id)}
            />
          )}
        
        </Space>
      )
    }
  ].filter(Boolean) ; 

  useEffect(() => {
    if (emailSupportOption){
      setSupportTableColumn([...emailColumn]) ; 
      setTableData([...emailTableData]) ; 
    } else {
      setSupportTableColumn([...phoneColumn]) ; 
      setTableData([...phoneTableData])
    }
  }, [emailSupportOption, phoneSupportOption])

  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={supportTableColumn}
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
