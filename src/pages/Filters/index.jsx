import React, { useEffect, useState, useContext } from 'react'
import TableWithFilter from '../../components/TableWithFilter'
import { getFilterList } from '../../apis/studiesApi'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Space, Button, Tooltip, Popconfirm } from 'antd'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import EditActionIcon from '../../components/EditActionIcon'
import StudyFilterModal from '../../components/StudyFilterModal'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import NotificationMessage from '../../components/NotificationMessage'
import APIHandler from '../../apis/apiHandler'

const index = () => {
  const [filterData, setFilterData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filterID, setFilterID] = useState(null)
  const { changeBreadcrumbs } = useBreadcrumbs()
  const { permissionData } = useContext(UserPermissionContext)

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Filters' }])
    retrieveFilterOptions()
  }, []) ; 

  const checkPermissionStatus = name => {
    const permission = permissionData['FilterTable View'].find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const retrieveFilterOptions = () => {
    getFilterList()
      .then(res => {
        if (res.data.status) {
          setFilterData(res.data.data)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => {
        NotificationMessage('warning', 'Network request failed', err.response.data.message)
      })
  }

  const editActionHandler = id => {
    setFilterID(id)
    setIsFilterModalOpen(true)
  } 

  const DeleteFilterOptionHandler = async (id) => {
    setIsLoading(true) ; 
    let responseData = await APIHandler("POST", {"id" : id}, "studies/v1/delete-filter") ; 
    setIsLoading(false) ; 
    
    if (responseData === false){
      NotificationMessage("warning", "Network request failed") ; 
    } else if (responseData['status'] === true){
      NotificationMessage("success", "Delete filter successfully") ; 
      retrieveFilterOptions() ; 
    } else{
      NotificationMessage("warning", "Network request failed", responseData['message']) ; 
    }
  }


  const columns = [

    {
      title: 'Filter Name',
      dataIndex: 'filter_name'
    },
    
    {
      title: 'Created At',
      dataIndex: 'created_at'
    },
    
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>

          {checkPermissionStatus("Edit Filter") && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
          )}
    
          {checkPermissionStatus("Delete Filter") && (
            // <EditActionIcon
            //   deleteActionHandler={() => deleteActionHandler(record.id)}
            // />

            <Popconfirm 
              title  = "Delete Filter"
              description = "Are you sure you want delete this filter ?"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: 'red',
                  }}
                />
              }
              onConfirm={() => DeleteFilterOptionHandler(record.id)}>
              <DeleteActionIcon
                deleteActionHandler={() => deleteParticularStudy(record?.id)}
                />

            </Popconfirm>
          )}
        </Space>
      )
    }
    
  ]

  return (
    <div>

      <TableWithFilter
        tableData={filterData}
        tableColumns={columns}
        loadingTableData={isLoading}
      />

      <StudyFilterModal
        isFilterModalOpen={isFilterModalOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        filterID={filterID}
        setFilterID={setFilterID}
        retrieveFilterOptions={retrieveFilterOptions}
      />

    </div>
  )
}

export default index
