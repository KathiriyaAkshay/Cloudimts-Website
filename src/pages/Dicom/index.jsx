import React, { useContext, useEffect, useState } from 'react'
import {
  Drawer,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Form,
  DatePicker,
  Row,
  Col,
  Select,
  Spin,
  Input,
  Switch
} from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, FileOutlined, PictureOutlined } from '@ant-design/icons'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import ChatMain from '../../components/Chat/ChatMain'
import EditStudy from '../../components/Studies/EditStudy'
import PatientDetails from '../../components/Studies/PatientDetails'
import StudyAudits from '../../components/Studies/StudyAudits'
import StudyReports from '../../components/Studies/StudyReports'
import ShareStudy from '../../components/Studies/ShareStudy' 

import {
  advanceSearchFilter,
  closeStudy,
  deleteStudy,
  filterStudyData,
  getAllStudyData,
  updateStudyStatus,
  updateStudyStatusReported, 
  getInstanceData
} from '../../apis/studiesApi'
import AssignStudy from '../../components/Studies/AssignStudy'
import QuickFilterModal from '../../components/QuickFilterModal'
import { BsChat, BsEyeFill } from 'react-icons/bs'
import { AiTwotoneEdit } from "react-icons/ai";
import { IoIosDocument, IoIosShareAlt } from 'react-icons/io'
import { MdOutlineHistory } from 'react-icons/md'
import { AuditOutlined } from '@ant-design/icons'
import EditActionIcon from '../../components/EditActionIcon'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import { StudyDataContext } from '../../hooks/studyDataContext'
import { StudyIdContext } from '../../hooks/studyIdContext'
import { filterDataContext } from '../../hooks/filterDataContext'
import {
  applyMainFilter,
  applySystemFilter
} from '../../helpers/studyDataFilter'
import { FilterSelectedContext } from '../../hooks/filterSelectedContext'
import AdvancedSearchModal from '../../components/AdvancedSearchModal'
import DeleteActionIcon from '../../components/DeleteActionIcon'
import NotificationMessage from '../../components/NotificationMessage'
import APIHandler from '../../apis/apiHandler'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import AssignStudyModified from '../../components/Studies/AssignStudyModified'
import EditSeriesId from '../../components/EditSeriesId'
import ImageDrawer from './ImageDrawer'
const BASE_URL = import.meta.env.VITE_APP_SOCKET_BASE_URL
const Dicom = () => {
  // Modal related useState
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isImageModalOpen,setImageDrawerOpen]=useState(false)
  const [isAssignModifiedModalOpen, setIsAssignModifiedModalOpen] = useState(true)
  const [isEditSeriesIdModifiedOpen, setIsEditSeriesIdModifiedOpen] = useState(false) ; 

  const [isShareStudyModalOpen, setIsShareStudyModalOpen] = useState(false)

  // Breadcumbs information
  const { changeBreadcrumbs } = useBreadcrumbs()

  // For Chatlayout
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [messages, setMessages] = useState([])

  // Pagination and Total page information handling
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: totalPages,
    search: '',
    order: 'desc'
  })

  // Loader
  const [isLoading, setIsLoading] = useState(false)

  // Permission information context
  const { permissionData } = useContext(UserPermissionContext)

  const { isStudyExportModalOpen, setIsStudyExportModalOpen, isQuickAssignStudyModalOpen, 
    setIsQuickAssignStudyModalOpen } = useContext(filterDataContext)

  // Modal passing attributes information

  const [studyID, setStudyID] = useState(null)
  const [seriesID, setSeriesID] = useState(null)
  const [personName, setPersonName] = useState(null)
  const [studyExportLoading, setStudyExportLoading] = useState(false)
  const [patientId, setPatientId] = useState('')
  const [patientName, setPatientName] = useState('')
  const [studyStatus, setStudyStatus] = useState('')
  const [urgentCase, setUrgentCase] = useState(false)  
  const [studyUID, setStudyUId] = useState(null) ; 
  const [studyImagesList, setStudyImagesList] = useState([]) ; 

  // Normal studies information, System filter and Main filter payload information

  const {
    studyData,
    setStudyData,
    studyDataPayload,
    setStudyDataPayload,
    systemFilterPayload,
    setSystemFilterPayload
  } = useContext(StudyDataContext)

  const { studyIdArray, setStudyIdArray } = useContext(StudyIdContext)
  const { isFilterSelected, isAdvanceSearchSelected } = useContext( FilterSelectedContext ) ; 

  const [quickFilterPayload, setQuickFilterPayload] = useState({})

  const [advanceSearchPayload, setAdvanceSearchPayload] = useState({})

  // Series id list for Instance count information
  const [seriesIdList, setSeriesIdList] = useState([])
  const [previousSeriesResponse, setPreviousSeriesResponse] = useState(null)

  const [notificationValue, setNotificationValue] = useState(0);  

  const SetupGenralChatNotification = () => {
    const ws = new WebSocket(`${BASE_URL}genralChat/`)

    ws.onopen = () => {
      console.log('Chat Websocket connected')
    }

    ws.onmessage = event => {
      try {
        const eventData = JSON.parse(event.data) ;        

        if (eventData.payload.status == "new-chat"){
          let ChatData = eventData.payload.data; 
          if ((localStorage.getItem("currentChatId") !== ChatData.room_name) || localStorage.getItem("currentChatId") == null){
            studyData.map((element) => {
              if (element.series_id === ChatData.room_name){
                
                if (ChatData.urgent_case){
                  NotificationMessage("important", 
                  "New chat message", `Message send by ${ChatData.sender_username} for Patient - ${element.name} and StudyId - ${element.id}`, 
                  5, 
                  "topLeft") ;  
                } else{
                  NotificationMessage("success", 
                  "New chat message", `Message send by ${ChatData.sender_username} for Patient - ${element.name} and StudyId - ${element.id}`, 
                  5, 
                  "topLeft") ; 
                }
              }
            })
          }
        } 

      } catch (error) {}
    }

    ws.onclose = () => {
      // NotificationMessage("warning", "Socket connection failed", "Chat socket conncetion failed" ) ; 
      console.log("Chat socket connecttion close");
    }

    return () => {
      ws.close()
    }
  }

  // APICall Reterive initial Studydata

  const retrieveStudyData = pagination => {
    setIsLoading(true)

    const currentPagination = pagination || pagi

    getAllStudyData({
      page_size: currentPagination.limit || 10,
      page_number: currentPagination.page,
      all_premission_id: JSON.parse(localStorage.getItem('all_permission_id')),
      all_assign_id: JSON.parse(localStorage.getItem('all_assign_id'))
    })
      .then(res => {
        if (res.data.status) {
          const modifiedData = res.data.data.map(data => {
            return {
              ...data,
              name: data.study.patient_name,
              institution: data.institution.name,
              patient_id: data?.study?.patient_id,
              study_id: data?.study?.id,
              key: data.id,
              count: 0,
              institution_id: data.institution.id
            }
          })

          const temp = res.data.data
            .map(data => data?.series_id)
            .filter(Boolean)

          // Set StudyData
          setStudyData(modifiedData)
          setTotalPages(res.data.total_object)

          // Set Studies series count for countinues Instance count
          setSeriesIdList([...temp])
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

    setIsLoading(false)
  }

  // ==== Setup Pagination and load initail study data ==== //

  useEffect(() => {
    setPagi(Pagination)

    if (
      !isFilterSelected &&
      Object.keys(systemFilterPayload).length === 0 &&
      Object.keys(studyDataPayload).length === 0 &&
      !isAdvanceSearchSelected
    ) {
      // If not selected any filter and Systemfilter, studyDatapayload length empty than call normal reterive stuydData API
      retrieveStudyData(Pagination)
    } else{
      retrieveStudyData(Pagination) ; 
    }
  }, [Pagination, isFilterSelected, studyDataPayload, systemFilterPayload])

  // ==== Setup Chat Notification socket connection ===== //

  useEffect(() => {
    if (!isLoading && studyData.length !== 0 && notificationValue === 0) {
      setNotificationValue(1)
      SetupGenralChatNotification()
    }
  }, [isLoading, studyData, notificationValue])

  useEffect(() => {

    setSystemFilterPayload({})
    setStudyDataPayload({})
    changeBreadcrumbs([{ name: `Study Data` }])
    setStudyIdArray([])
  }, [])

  // ==== Setup Instance count API Calling ==== //

  const FetchSeriesCountInformation = async () => {
    let requestPayload = {
      series_list: seriesIdList
    }

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'studies/v1/series_instance_count'
    )

    if (responseData === false) {
    } else if (responseData['status'] === true) {
      setStudyData(prev => {
        return prev.map(element => {
          let series_id = element.series_id
          let foundSeriesData = responseData['data'].find(
            serisData => serisData.series_id === series_id
          )
          if (foundSeriesData) {
            return { ...element, count: foundSeriesData.series_instance }
          }
          return element
        })
      })

      if (previousSeriesResponse != JSON.stringify(responseData['data'])) {
        setPreviousSeriesResponse(JSON.stringify(responseData['data']))
        // await FetchSeriesCountInformation() ;
      } else {
      }
    }
  }

  useEffect(() => {
    if (!isLoading && studyData.length !== 0) {
      // FetchSeriesCountInformation() ;
    }
  }, [isLoading, studyData])

  // ==== Pagination number of page change handler ==== //

  const onShowSizeChange = (current, pageSize) => {
    setLimit(pageSize)

    if (
      Object.keys(studyDataPayload).length === 0 &&
      Object.keys(systemFilterPayload).length === 0
    ) {
      setPagination(prev => ({ ...prev, page: current, limit: pageSize }))
    }
  }

  const quickFilterStudyData = (pagination, values = {}) => {
    setIsLoading(true)
    setQuickFilterPayload(values)

    filterStudyData({
      filter: values,
      page_size: pagination?.limit || 10,
      page_number: pagination?.page || 1,
      all_permission_id: JSON.parse(localStorage.getItem('all_permission_id')),
      all_assign_id: JSON.parse(localStorage.getItem('all_assign_id')),
      deleted_skip: false
    })
      .then(res => {
        if (res.data.status) {
          setIsLoading(false)

          const resData = res.data.data.map(data => ({
            ...data,
            name: data.study.patient_name,
            institution: data.institution.name,
            patient_id: data?.study?.patient_id,
            study_id: data?.study?.id,
            key: data.id,
            count: 0,
            institution_id: data.institution.id
          }))

          // Set Study data
          setStudyData(resData)
          setTotalPages(res.data.total_object)

          const temp = res.data.data
            .map(data => data?.series_id)
            .filter(Boolean)
          setSeriesIdList([...temp])
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

  const advanceSearchFilterData = (pagination, values = {}) => {
    setIsLoading(true)
    setAdvanceSearchPayload(values)

    advanceSearchFilter({
      ...values,
      page_size: pagination?.limit || 10,
      page_number: pagination?.page || 1,
      all_premission_id: JSON.parse(localStorage.getItem('all_permission_id')),
      all_assign_id: JSON.parse(localStorage.getItem('all_assign_id'))
    })
      .then(res => {
        if (res.data.status) {
          setIsLoading(false)

          const resData = res.data.data.map(data => ({
            ...data,
            name: data.study.patient_name,
            institution: data.institution.name,
            patient_id: data?.study?.patient_id,
            study_id: data?.study?.id,
            key: data.id,
            count: 0,
            institution_id: data.institution.id
          })) ; 

          // set StudyData
          setStudyData(resData);
          setTotalPages(res.data.total_object);
        
          const temp = res.data.data.map(data => data?.series_id).filter(Boolean);
        
          setSeriesIdList([...temp]) ; 

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
    setStudyID(id)
    setIsEditModalOpen(true)
  }

  const checkPermissionStatus = name => {
    const permission = permissionData['StudyTable view']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const studyStatusHandler = async () => {
    // Call API When study status Viewed or Assigned

    if (studyStatus === 'Viewed' || studyStatus === 'Assigned') {
      await updateStudyStatusReported({ id: studyID })
        .then(res => {
          if (res.data.status) {
            // NotificationMessage('success', res.data.message)
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err => NotificationMessage('warning', 'Network request failed', err.response.data.message))
    }
  }

  const PageNumberHandler = () => {
    let currentPageLimit = pagi?.limit
    localStorage.setItem('paginationLimit', currentPageLimit)
  }

  const studyCloseHandler = async () => {
    await closeStudy({ id: studyID })
      .then(res => {
        if (res.data.status) {
          setIsReportModalOpen(false)
          setStudyID(null)
          retrieveStudyData()
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed', err.response.data.message))
  }

  const deleteParticularStudy = async id => {
    await deleteStudy({ id: [id] })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Study deleted Successfully')
          if (isFilterSelected) {
            quickFilterStudyData({ page: Pagination.page }, quickFilterPayload)
          } else if (isAdvanceSearchSelected) {
            advanceSearchFilterData(
              { page: Pagination.page },
              advanceSearchPayload
            )
          } else if (Object.keys(studyDataPayload).length > 0) {
            applyMainFilter(
              {
                ...studyDataPayload,
                page_number: Pagination.page,
                page_size: limit
              },
              setStudyData
            )
          } else if (Object.keys(systemFilterPayload).length > 0) {
            applySystemFilter(
              {
                ...systemFilterPayload,
                page_number: Pagination.page,
                page_size: limit
              },
              setStudyData
            )
          } else {
            retrieveStudyData()
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
  }

  const columns = [
    {
      title: 'Images',
      dataIndex: 'images',
      width:"5%",
      render: (text, record) => (        
        <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
          <PictureOutlined
            className='action-icon action-icon-primary'
            onClick={() => ImageDrawerHandler(record)}
          />
        </Tooltip>
      ),
    },

    checkPermissionStatus('View Patient id') && {
      title: "Patient's Id",
      dataIndex: 'patient_id',
      className: `${
        checkPermissionStatus('View Patient id') ? '' : 'column-display-none'
      }`, 
      render: (text, record) => (        
        record.urgent_case ?<>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`} style={{color: "red"}}>
            <div style={{color: "red"}}>{text}</div>
          </Tooltip>
        </>:<>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
            {text}
          </Tooltip>
        
        </>
      ),
    },
    
    checkPermissionStatus('View Patient name') && {
      title: "Patient's Name",
      dataIndex: 'name',
      width:"12%",
      className: `${
        checkPermissionStatus('View Patient name') ? '' : 'column-display-none'
      }`, 
      render: (text, record) => (        
        record.urgent_case ?<>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`} style={{color: "red"}}>
            <div style={{color: "red"}}>{text}</div>
          </Tooltip>
        </>:<>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
            {text}
          </Tooltip>
        
        </>
      ),

    },
    
    checkPermissionStatus('Study id') && {
      title: 'Study Id',
      dataIndex: 'study_id',
      className: `${
        checkPermissionStatus('Study id')
          ? 'Study-count-column'
          : 'column-display-none'
      }`
    },

    {
      title: 'Status',
      dataIndex: 'status',
    width:"8rem",
      render: (text, record) => (
        <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
          <Tag
            color={
              text === 'New'
                ? 'success'
                : text === 'Assigned'
                ? 'blue'
                : text === 'Viewed'
                ? 'cyan'
                : text === 'ViewReport'
                ? 'lime'
                : text === 'InReporting'
                ? 'magenta'
                : text === 'ClosedStudy'
                ? 'red'
                : 'warning'
            }
            style={{ textAlign: 'center', fontWeight: '600' }}

            icon = {
              text === "ViewReport"?<CheckCircleOutlined></CheckCircleOutlined>:
              text === "ClosedStudy"?<CloseCircleOutlined></CloseCircleOutlined>:<></>
            }
          >
            {text}
          </Tag>
        </Tooltip>
      )
    },

    {
      title: 'Modality',
      dataIndex: 'modality',
      className: 'Study-count-column', 
      render: (text, record) => (
        <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
          {text}
        </Tooltip>
      ),
    },

    {
      title: 'Study date',
      dataIndex: 'created_at',
      width:"10%",
    },

    {
      title: 'Update at',
      dataIndex: 'updated_at',
      width:"10%",

    },

    checkPermissionStatus('View Institution name') && {
      title: 'Institution',
      dataIndex: 'institution',
      className: `${
        checkPermissionStatus('View Institution name')
          ? 'Study-count-column'
          : 'column-display-none'
      }`
    },
    
    checkPermissionStatus('View Study description') && {
      title: 'Description',
      dataIndex: 'study_description',
      className: `${
        checkPermissionStatus('View Study description')
          ? ''
          : 'column-display-none'
      }`, 
      render: (text, record) => (
        <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
          {text}
        </Tooltip>
      ),
    },
    
    {
      title: 'Count',
      dataIndex: 'count',
      className: 'Study-count-column'
    },
    
    checkPermissionStatus('Edit SeriesId option') && {
      title: 'Edit seriesid',
      dataIndex: 'chat',
      width:"5%",
      fixed: "right", 
      className: `${
        checkPermissionStatus('Edit SeriesId option') ? '' : 'column-display-none'
      }`,
      render: (text, record) => (
        <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
          <AiTwotoneEdit
            className='action-icon action-icon-primary'
            onClick={() => {
              setSeriesID(record.series_id)
              setStudyID(record.id)
              setIsEditSeriesIdModifiedOpen(true)``
            }}
          />
        </Tooltip>
      )
    },
    
    checkPermissionStatus('Study chat option') && {
      title: 'Chat',
      dataIndex: 'chat',
      fixed: "right", 
      width:"4%",
      className: `${
        checkPermissionStatus('Study chat option') ? '' : 'column-display-none'
      }`,
      render: (text, record) => (
        <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
          <BsChat
            className='action-icon action-icon-primary'
            onClick={() => {
              setSeriesID(record.series_id)
              setStudyID(record.id)
              setIsDrawerOpen(true)
              setPersonName(`${record.study.patient_id} | ${record.name}`) 
              setUrgentCase(record.urgent_case)
              localStorage.setItem("currentChatId", record.series_id)
            }}
          />
        </Tooltip>
      )
    },
    
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          {/* ==== Clinical History option ====  */}

          {checkPermissionStatus('Study clinical history option') && (
            <Tooltip title='Clinical History'>
              <MdOutlineHistory
                className='action-icon'
                onClick={() => {
                  setStudyID(record.id)
                  setIsAssignModalOpen(true)
                }}
              />
            </Tooltip>
          )}

          {/* ==== Study report option ====  */}

          {checkPermissionStatus('Study data option') && (
            <Tooltip title={'Study Report'}>
              <IoIosDocument
                className='action-icon'
                onClick={() => {
                  setStudyID(record.id)
                  setStudyStatus(record.status)
                  setIsReportModalOpen(true)
                  setPatientId(record.patient_id)
                  setPatientName(record.name) 
                  setStudyUId(record.study?.study_uid)
                }}
              />
            </Tooltip>
          )}

          {/* ==== Study more details option ====  */}

          {checkPermissionStatus('Study more details option') && (
            <Tooltip title={'More Details'}>
              <BsEyeFill
                className='action-icon'
                onClick={() => {
                  setStudyID(record.id)
                  setIsStudyModalOpen(true)
                }}
              />
            </Tooltip>
          )}

          {/* ==== Study edit option ====  */}

          {checkPermissionStatus('Study edit option') && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
          )}

          {/* ==== Study share option ====  */}

          {checkPermissionStatus('Study share option') && (
            <Tooltip title='Share Study'>
              <IoIosShareAlt
                className='action-icon action-icon-primary'
                onClick={() => {
                  setStudyID(record.id)
                  setSeriesID(record.series_id)
                  setIsShareStudyModalOpen(true)
                }}
              />
            </Tooltip>
          )}

          {/* ==== Study logs option ====  */}

          {checkPermissionStatus('Study logs option') && (
            <Tooltip title='Auditing'>
              <AuditOutlined
                className='action-icon action-icon-primary'
                onClick={() => {
                  setStudyID(record.id)
                  setIsModalOpen(true)
                }}
              />
            </Tooltip>
          )}

          {/* ==== Study delete option ====  */}

          {checkPermissionStatus('Study delete option') && (
            <DeleteActionIcon
              deleteActionHandler={() => deleteParticularStudy(record?.id)}
            />
          )}
        </Space>
      )
    }
  ].filter(Boolean)

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setStudyIdArray(prev => selectedRows?.map(data => data.id))
    },
    getCheckboxProps: record => ({
      id: record.id
    })
  }

  // ===== Study Export option Handling ====== //

  const StudyExportOptionHandler = async values => {
    let from_date = values?.from_date?.format('YYYY-MM-DD')
    let to_date = values?.to_date?.format('YYYY-MM-DD')

    setStudyExportLoading(true)

    let requestPayload = {
      start_date: from_date,
      end_date: to_date,
      all_premission_id: JSON.parse(localStorage.getItem('all_permission_id')),
      all_assign_id: JSON.parse(localStorage.getItem('all_assign_id'))
    }

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'studies/v1/study-export'
    )

    setStudyExportLoading(false)
    setIsStudyExportModalOpen(false)

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed')
    } else if (responseData['status'] === true) {
      let studyExportArrayData = []

      responseData['data'].map(element => {
        studyExportArrayData.push({
          'Patient id': element?.study?.patient_id,
          'Patient name': element?.study?.patient_name,
          Id: element?.id,
          Modality: element?.modality,
          'Study Description': element?.study_description,
          'Institution name': element?.institution?.name,
          Status: element?.status,
          'Urgent case': element?.urgent_case,
          'Study date': element?.created_at,
          'Updated at': element?.updated_at
        })
      })

      const workbook = XLSX.utils.book_new()
      const sheetName = `Study-export-${to_date}`

      const worksheet = XLSX.utils.json_to_sheet(studyExportArrayData)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

      const arrayBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })

      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const fileName = `Study-export-${from_date}-${to_date}.xlsx`

      saveAs(blob, fileName)
    }
  }

  // ==== Email Share option handling

  const [form] = Form.useForm()

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isWhatsappShareModelOpen,setIsWhatsappModalOpen]=useState(false);
  const [emailShareLoading, setEmailShareLoading] = useState(false)
  const [emailReportId, setEmailReportId] = useState(null)

  const [emailFrom] = Form.useForm()

  const EmailShareHandler = async values => {
    setEmailShareLoading(true)

    let requestPayload = {
      sender_email: values?.email,
      study_id: studyID,
      report_id: emailReportId
    }

    let responseData = await APIHandler(
      'POST',
      requestPayload,
      'email/v1/send-email'
    )
    setEmailShareLoading(false)
    setIsEmailModalOpen(false)

    if (responseData === false) {
      NotificationMessage('warning', 'Network request failed')
    } else if (responseData['status'] === true) {
      NotificationMessage('success', 'Email send successfully')
    } else {
      NotificationMessage('warning', responseData['message'])
    }
  }

  // Function === OnRow click handle

  const onRow = record => ({
    onDoubleClick: () => handleCellDoubleClick(record)
  })

  // Function ==== onRow doubleClick handler

  const handleCellDoubleClick = (record) => {
    if (record.status === 'Assigned' || record.status === 'InReporting') {
      updateStudyStatus({ id: record.id })
        .then(res => {
          if (res.data.status) {
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
  }

  // Function ==== Image Drawer handler 

  const ImageDrawerHandler = async (record) => {

    handleCellDoubleClick(record) ; 

    console.log("records id information");
    console.log(record);

    getInstanceData({ study_id: record.study.study_original_id })
      .then(res => {
        if (res.data.status) {

          setStudyImagesList([...res.data.data]) ; 
          setImageDrawerOpen(true) ; 

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

  }


  return (
    <>

      <Table
        className='Study-table'
        dataSource={studyData}
        columns={columns}
        scroll={{ y: 475, x: 2000 }}

        rowSelection={rowSelection}
        onRow={onRow}
        loading={isLoading}
        // Pagination handle
        pagination={{
          current: Pagination.page,
          pageSize: localStorage.getItem("pageSize")||Pagination.limit,
          total: totalPages,
          pageSizeOptions: [10, 25, 50, 100, 200, 500],
          showSizeChanger: totalPages > 10,
          onChange: (page = 1, pageSize = limit) => {
            localStorage.setItem("pageSize",pageSize)
            if (Object.keys(studyDataPayload).length > 0) {
              applyMainFilter(
                { ...studyDataPayload, page_number: page, page_size: pageSize },
                setStudyData
              )
            } else if (Object.keys(systemFilterPayload).length > 0) {
              applySystemFilter(
                {
                  ...systemFilterPayload,
                  page_number: page,
                  page_size: pageSize
                },
                setStudyData
              )
            } else if (isFilterSelected) {
              quickFilterStudyData(
                { page, limit: pageSize },
                quickFilterPayload
              )
            } else if (isAdvanceSearchSelected) {
              advanceSearchFilterData(
                { page, limit: pageSize },
                advanceSearchPayload
              )
            }
            setPagination({ ...Pagination, page, limit: pageSize })
          },
          onShowSizeChange: onShowSizeChange
        }}
      />
    
      {/* Edit Series Id popup */}
      <EditSeriesId
        isEditSeriesIdModifiedOpen={isEditSeriesIdModifiedOpen}
        setIsEditSeriesIdModifiedOpen={setIsEditSeriesIdModifiedOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        seriesId={seriesID}
        setPagination={setPagination}
      />


      {/* ==== Edit study details option modal =====  */}

      <EditStudy
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />

      {/* ==== Assign study option modal ====  */}

      <AssignStudy
        isAssignModalOpen={isAssignModalOpen} 
        setIsAssignModalOpen={setIsAssignModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />

      <StudyAudits
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />

      <StudyReports
        isReportModalOpen={isReportModalOpen}
        setIsReportModalOpen={setIsReportModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        studyStatus={studyStatus}
        setStudyStatus={setStudyStatus}
        studyStatusHandler={studyStatusHandler}
        studyCloseHandler={studyCloseHandler}
        pageNumberHandler={PageNumberHandler}
        isEmailShareModalOpen={setIsEmailModalOpen}
        isWhatsappShareModelOpen={setIsWhatsappModalOpen}
        setEmailReportId={setEmailReportId}
        patientId={patientId}
        patientName={patientName}
        studyUIDInformation = {studyUID}
      />

      <PatientDetails
        isStudyModalOpen={isStudyModalOpen}
        setIsStudyModalOpen={setIsStudyModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />

      <ShareStudy
        isShareStudyModalOpen={isShareStudyModalOpen}
        setIsShareStudyModalOpen={setIsShareStudyModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        seriesId={seriesID}
      />

      <Drawer
        title={null}
        placement='right'
        closeIcon={false}
        onClose={() => {
          setStudyID(null)
          setSeriesID(null)
          setIsDrawerOpen(false)
          setMessages([])
          setPersonName(null)
        }}
        open={isDrawerOpen}
        className='chat-drawer'
      >
        <ChatMain
          userId={studyID}
          orderId={seriesID}
          restaurantName={personName}
          messages={messages}
          setMessages={setMessages}
          drawerValue={true}
          urgentCase = {urgentCase}
        />
      </Drawer>

      {/* ==== Quick Filter option modal ====  */}

      <QuickFilterModal
        name={'Study Quick Filter'}
        retrieveStudyData={retrieveStudyData}
        setStudyData={setStudyData}
        quickFilterStudyData={quickFilterStudyData}
      />

      {/* ==== Advance filter option modal =====  */}

      <AdvancedSearchModal
        name={'Advance Search'}
        retrieveStudyData={retrieveStudyData}
        advanceSearchFilterData={advanceSearchFilterData}
      />

      {/* ==== Assign quick studies ====  */}

      <AssignStudyModified
        isAssignModifiedModalOpen={isQuickAssignStudyModalOpen}
        setIsAssignModifiedModalOpen={setIsQuickAssignStudyModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />


      {/* ==== Image Drawer==== */}
      <ImageDrawer 
        isDrawerOpen={isImageModalOpen} 
        setImageDrawerOpen={setImageDrawerOpen}
        imageList = {studyImagesList}
      />

      {/* ===== Study Export option modal ======  */}

      <Modal
        title='Study Export'
        centered
        open={isStudyExportModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsStudyExportModalOpen(false)}
        className='Study-export-option-modal'
      >
        <Spin spinning={studyExportLoading}>
          <Form form={form} onFinish={StudyExportOptionHandler}>
            <Row gutter={15}>
              <Col xs={24} lg={24} style={{ marginTop: '20px' }}>
                {/* ===== Study export from date selection ======= */}

                <Form.Item
                  name='from_date'
                  label='From Date'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter From Date'
                    }
                  ]}
                >
                  <DatePicker format={'YYYY-MM-DD'} />
                </Form.Item>
              </Col>

              {/* ==== Study export to date selection ====  */}

              <Col xs={24} lg={24}>
                <Form.Item
                  name='to_date'
                  label='To Date'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter to date'
                    }
                  ]}
                >
                  <DatePicker format={'YYYY-MM-DD'} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

      {/* ==== Report email share option modal ====  */}

      <Modal
        title='Email share'
        open={isEmailModalOpen}
        onOk={() => emailFrom.submit()}
        onCancel={() => setIsEmailModalOpen(false)}
        centered
        style={{ zIndex: 200 }}
        className='Report-email-share-option-modal'
      >
        
        <Spin spinning={emailShareLoading}>
          <Form
            labelCol={{
              span: 24
            }}
            wrapperCol={{
              span: 24
            }}
            form={emailFrom}
            onFinish={EmailShareHandler}
          >
            <Row gutter={15}>
              <Col xs={24} lg={24} style={{ marginTop: '20px' }}>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[
                    {
                      type: 'email',
                      required: true,
                      message: 'Please enter email'
                    }
                  ]}
                >
                  <Input placeholder='Enter Email address' />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

      {/* ==== Share Whatsapp modal ==== */}
      <Modal
        title='Whatsapp Report'
        centered
        open={isWhatsappShareModelOpen}
        onCancel={() => {
          form.resetFields()
          setIsWhatsappModalOpen(false)
        }}
        okText='Send'
        onOk={() => form.submit()}
      >
        <Spin spinning={studyExportLoading}>
          <Form
            labelCol={{
              span: 24
            }}
            wrapperCol={{
              span: 24
            }}
            form={form}
            className='mt'
          >
            <Row gutter={15}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item
                  name='contact'
                  label='Contact Details'
                  className='category-select'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter valid Contact Number'
                    }
                  ]}
                >
                  <Input
                    placeholder='Enter Whatsapp Number'
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name='attach_dicom'
                  label='Attach Dicom Images'
                  valuePropName='checked'
                  initialValue={false}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

    </>
  )
}

export default Dicom
