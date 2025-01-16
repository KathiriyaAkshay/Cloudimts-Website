import React, { useContext, useEffect, useState } from 'react'
import SupportModal from '../../components/SupportModal'
import TableWithFilter from '../../components/TableWithFilter'
import { Space, Switch, Tag } from 'antd'
import EditActionIcon from '../../components/EditActionIcon'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { deleteSupport, fetchSupport } from '../../apis/studiesApi'
import NotificationMessage from '../../components/NotificationMessage'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import { filterDataContext } from '../../hooks/filterDataContext'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import APIHandler from '../../apis/apiHandler'

const index = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { permissionData } = useContext(UserPermissionContext)
  const [supportId, setSupportId] = useState(null)
  
  const { setIsSupportModalOpen,emailSupportOption, phoneSupportOption } =useContext(filterDataContext)
  const { changeBreadcrumbs } = useBreadcrumbs()

  const [supportTableColumn, setSupportTableColumn] = useState([]) ; 
  const [emailTableData, setEmailTableData] = useState([]) ; 
  const [phoneTableData, setPhoneTableData] = useState([]) ; 
  const [tableData, setTableData] = useState([]) ; 

  // ** Permission handler ** // 

  const checkPermissionStatus = name => {
    const permission = permissionData['Support premission']?.find(
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
          setTableData(res?.data?.data) ; 
          // let emailtemp = [] ; 
          // let phonetemp = [] ; 

          // res.data.data.map((element) => {
          //   if (element.option === 1){
          //     emailtemp.push(element) ; 
          //   } else{
          //     phonetemp.push(element) ; 
          //   }
          // })

          // setEmailTableData([...emailtemp]) ;
          // setPhoneTableData([...phonetemp]) ;  

          // if (emailSupportOption){
          //   setTableData([...emailtemp]) ; 
          // } else {
          //   setTableData([...phonetemp]) ; 
          // }

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

  // Handle support details on show in top related handler 
  const handleShowInTopHandle = async (value, record) => {
    setIsLoading(true) ; 
    let requestPayload = {
      "id": record?.id, 
      "show_in_top": value
    }
    let responseData = await APIHandler("POST", requestPayload, `support/v1/support-details-show-in-top`) ; 
    setIsLoading(false) ; 

    if (responseData == false){
      NotificationMessage("warning", "Network request failed") ; 
    } else if (responseData?.status){
      NotificationMessage("success", "Support details updated successfully") ; 
      retrieveSupportData() ; 
    } else {
      NotificationMessage("warning", responseData?.message)
    }
  } 

  // ==== Support table column ==== // 
  const tableColumns = [
    {
      title: "ID", 
      width: 90,
      render: (text, record, index) => {
        return(
          <div>
            {index + 1}
          </div>
        )
      }
    }, 
    {
      title: "Type", 
      render: (text, record) => {
        if (record?.option == 1){
          return(
            <div>
              <Tag color='purple'>Email</Tag>
            </div>
          )
        } else {
          return(
            <div>
              <Tag color='blue'>Phone</Tag>
            </div>
          )
        }
      }
    },
    {
      title: 'Email/Phone',
      dataIndex: 'option_value',
      render: (text, record) => (record?.option === 1 ? text : '-')
    },
    {
      title: 'Description',
      dataIndex: 'option_description'
    },

    {
      title: "Show in top", 
      dataIndex: "show_in_top", 
      render: (text, record) => {
        return(
          <div>
            <Switch
              defaultChecked = {text}
              onChange={async(checked) => {
                handleShowInTopHandle(checked, record)
              }}
            />
          </div>
        )
      }
    },

    (checkPermissionStatus('Support details')) && {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (

        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        
          {checkPermissionStatus('Support details') && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
          )}
        
          {checkPermissionStatus('Support details') && (
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



  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={tableColumns}
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
