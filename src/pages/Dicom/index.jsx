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
  Spin,
  Input,
  Switch,
  Statistic,
  Button,
  Select
} from 'antd'
import { CheckCircleOutlined, ClearOutlined, CloseCircleOutlined, FileOutlined, PictureOutlined } from '@ant-design/icons'
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
import { BsChat, BsEyeFill } from 'react-icons/bs'
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
import { convertToDDMMYYYY } from '../../helpers/utils'
import OHIFViewer from "../../assets/images/menu.png";
import WeasisViewer from "../../assets/images/Weasis.png";
import API from '../../apis/getApi'

const BASE_URL = import.meta.env.VITE_APP_SOCKET_BASE_URL
const Dicom = () => {

  const [isLoading, setIsLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isImageModalOpen, setImageDrawerOpen] = useState(false)
  const [isShareStudyModalOpen, setIsShareStudyModalOpen] = useState(false)

  // Breadcumbs information 
  const { changeBreadcrumbs } = useBreadcrumbs()

  // Chat related useState
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [messages, setMessages] = useState([])

  // Pagination related useState information
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(localStorage.getItem("pageSize") || 10)
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: totalPages,
    search: '',
    order: 'desc'
  })


  // Permission information context
  const { permissionData } = useContext(UserPermissionContext)

  // Particular model related useContext information
  const {
    isStudyExportModalOpen,
    setIsStudyExportModalOpen,
    isQuickAssignStudyModalOpen,
    setIsQuickAssignStudyModalOpen,
    isStudyQuickFilterModalOpen,
    setIsStudyQuickFilterModalOpen,
    chatNotificationData,
    setChatNotificationData } = useContext(filterDataContext)

  // Normal studies information, System filter and Main filter payload information
  const {
    studyData,
    setStudyData,
    studyDataPayload,
    setStudyDataPayload,
    systemFilterPayload,
    setSystemFilterPayload
  } = useContext(StudyDataContext)

  const { setStudyIdArray, setStudyReferenceIdArray } = useContext(StudyIdContext)
  const { isFilterSelected, isAdvanceSearchSelected, setIsAdvanceSearchSelected } = useContext(FilterSelectedContext);

  // Modal passing attributes information
  const [studyID, setStudyID] = useState(null);
  const [studyReferenceId, setStudyReferenceId] = useState(null);
  const [seriesID, setSeriesID] = useState(null)
  const [personName, setPersonName] = useState(null)
  const [studyExportLoading, setStudyExportLoading] = useState(false)
  const [patientId, setPatientId] = useState('')
  const [patientName, setPatientName] = useState('')
  const [studyStatus, setStudyStatus] = useState('')
  const [urgentCase, setUrgentCase] = useState(false)
  const [studyUID, setStudyUId] = useState(null);
  const [studyImagesList, setStudyImagesList] = useState([]);

  const [quickFilterPayload, setQuickFilterPayload] = useState({})
  const [advanceSearchPayload, setAdvanceSearchPayload] = useState({})

  // SeriesId list information 
  const [seriesIdList, setSeriesIdList] = useState([]);
  const [previousSeriesResponse, setPreviousSeriesResponse] = useState(null);

  const [notificationValue, setNotificationValue] = useState(0);

  const checkPermissionStatus = name => {
    const permission = permissionData['StudyTable view']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }


  // **** Setup Chat notification socket connection **** // 
  const SetupGenralChatNotification = () => {

    const ws = new WebSocket(`${BASE_URL}genralChat/`)

    ws.onopen = () => {
      console.log('Chat Websocket connected')
    }

    ws.onmessage = event => {
      try {
        const eventData = JSON.parse(event.data);

        if (eventData.payload.status == "new-chat") {

          let ChatData = eventData.payload.data;

          if ((localStorage.getItem("currentChatId") !== ChatData.room_name) || localStorage.getItem("currentChatId") == null) {

            studyData.map((element) => {
              if (element.series_id === ChatData.room_name) {

                let chatnotificationData = localStorage.getItem("chat-data");

                if (chatnotificationData === null) {
                  localStorage.setItem("chat-data", JSON.stringify([]));
                }

                let chatdata = localStorage.getItem("chat-data");
                chatdata = JSON.parse(chatdata);

                chatdata.push(
                  {
                    'message': `Message send by ${ChatData.sender_username} for Patient - ${element.name}`,
                    "Patientid": element?.refernce_id
                  }
                )

                localStorage.setItem("chat-data", JSON.stringify(chatdata));

                if (ChatData.urgent_case) {
                  setChatNotificationData([...chatNotificationData,
                  { message: `Message send by ${ChatData.sender_username} for Patient - ${element.name}`, "Patientid": element?.refernce_id }]);
                  NotificationMessage("important",
                    "New chat message", `Message send by ${ChatData.sender_username} for Patient - ${element.name} and Patient Id - ${element.refernce_id}`,
                    6,
                    "topLeft");

                } else {
                  setChatNotificationData([...chatNotificationData,
                  { message: `Message send by ${ChatData.sender_username} for Patient - ${element.name}`, "Patientid": element?.refernce_id }]);
                  NotificationMessage("success",
                    "New chat message", `Message send by ${ChatData.sender_username} for Patient - ${element.name} and Patient Id - ${element.refernce_id}`,
                    6,
                    "topLeft");
                }
              }
            })
          }
        }

      } catch (error) { }
    }

    ws.onclose = () => {
      console.log("Chat socket connecttion close");
    }

    return () => {
      ws.close()
    }
  }

  // **** Reterive table study data **** // 
  const retrieveStudyData = pagination => {

    setIsLoading(true);

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
            .map(data => data?.study?.study_original_id)
            .filter(Boolean); temp

          const uniqueItem = [...new Set(temp)];

          // Set StudyData
          setStudyData(modifiedData)
          setTotalPages(res.data.total_object)

          // Set Studies series count for countinues Instance count
          setSeriesIdList([...uniqueItem]);
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


  // **** Retervice particular study series and instance count information **** // 
  const FetchSeriesCountInformation = async (previousValue) => {
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

      // Update Study data
      setStudyData(prev => {
        return prev.map(element => {
          let study_id = element.study?.study_original_id;

          if (Object.keys(responseData?.data).includes(study_id)) {
            return { ...element, count: `${responseData?.data[study_id]?.series_count}/${responseData?.data[study_id]?.instance_count}` }
          } else {
            console.log("Not match study id");
            return { ...element, count: `0/0` }
          }

        })
      });

      if (previousValue !== JSON.stringify(responseData['data'])) {
        setPreviousSeriesResponse(JSON.stringify(responseData['data']));
        await FetchSeriesCountInformation(JSON.stringify(responseData?.data));
      } else {
      }
    }
  }

  const onShowSizeChange = (current, pageSize) => {
    setLimit(pageSize)

    if (
      Object.keys(studyDataPayload).length === 0 &&
      Object.keys(systemFilterPayload).length === 0
    ) {
      setPagination(prev => ({ ...prev, page: current, limit: pageSize }))
    }
  }

  const PageNumberHandler = () => {
    let currentPageLimit = pagi?.limit
    localStorage.setItem('paginationLimit', currentPageLimit)
  }


  useEffect(() => {
    setPagi(Pagination)

    if (
      !isFilterSelected && Object.keys(systemFilterPayload).length === 0 && Object.keys(studyDataPayload).length === 0 && !isAdvanceSearchSelected) {
      retrieveStudyData(Pagination)
    }
  }, [Pagination, isFilterSelected, studyDataPayload, systemFilterPayload])

  useEffect(() => {
    FetchSeriesCountInformation(null);
  }, [seriesIdList])

  useEffect(() => {
    if (!isLoading && studyData.length !== 0 && notificationValue === 0) {
      setNotificationValue(1)
      SetupGenralChatNotification()
    }
  }, [isLoading, studyData, notificationValue])

  useEffect(() => {

    changeBreadcrumbs([{ name: `Study` }])

    setSystemFilterPayload({})

    setStudyDataPayload({})

    setStudyIdArray([])

  }, [])


  // **** Study quick filter option handler **** // 
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

          // Setup Series id list 
          const temp = res.data.data
            .map(data => data?.study?.study_original_id)
            .filter(Boolean);

          const uniqueItem = [...new Set(temp)];
          setSeriesIdList([...uniqueItem]);

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

  // **** Study advanced filter option handler **** //  
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
          }));

          // set StudyData
          setStudyData(resData);
          setTotalPages(res.data.total_object);

          // Setup temp series id list 
          const temp = res.data.data.map(data => data?.study?.study_original_id).filter(Boolean);
          const uniqueItem = [...new Set(temp)];
          setSeriesIdList([...uniqueItem]);

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

  // **** Edit study details option handler **** // 
  const editActionHandler = (id, referenceId) => {
    setStudyID(id)
    setStudyReferenceId(referenceId);
    setIsEditModalOpen(true)
  }


  // **** Study status = Reporting update handler **** // 
  const studyStatusHandler = async () => {

    if (studyStatus === 'Viewed' || studyStatus === 'Assigned') {
      await updateStudyStatusReported({ id: studyID })
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
        .catch(err => NotificationMessage('warning', 'Network request failed', err.response.data.message))
    }
  }

  // **** Study status = ClosedStudy status handler **** // 
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

  // **** Study status = Viewd status handler **** // 
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

  // **** Delete particular study handler **** // 
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

  // **** Study export option handler **** // 
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


  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      width: "7%",
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

            icon={
              text === "ViewReport" ? <CheckCircleOutlined></CheckCircleOutlined> :
                text === "ClosedStudy" ? <CloseCircleOutlined></CloseCircleOutlined> : <></>
            }
          >
            {text}
          </Tag>
        </Tooltip>
      )
    },
    checkPermissionStatus('Study id') && {
      title: "Reference Id",
      dataIndex: 'refernce_id',
      width: "7%",
      className: `${checkPermissionStatus('View Patient id') ? '' : 'column-display-none'}`,
      render: (text, record) => (
        record.urgent_case ? <>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`} style={{ color: "red" }}>
            <div style={{ color: "red" }}>{text}</div>
          </Tooltip>
        </> : <>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
            {text}
          </Tooltip>

        </>
      ),
    },
    {
      title: "Patient Id",
      dataIndex: 'patient_id',
      width: "7%",
      className: `${checkPermissionStatus('View Patient id') ? '' : 'column-display-none'}`,
      render: (text, record) => (
        record.urgent_case ? <>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`} style={{ color: "red" }}>
            <div style={{ color: "red" }}>{text}</div>
          </Tooltip>
        </> : <>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
            {text}
          </Tooltip>

        </>
      ),
    },

    checkPermissionStatus('View Patient name') && {
      title: "Patient's Name",
      dataIndex: 'name',
      width: "14%",
      className: `${checkPermissionStatus('View Patient name') ? '' : 'column-display-none'}`,
      render: (text, record) => (
        record.urgent_case ? <>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`} style={{ color: "red" }}>
            <div style={{ color: "red" }}>{text}</div>
          </Tooltip>
        </> : <>
          <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
            {text}
          </Tooltip>

        </>
      ),

    },

    {
      title: 'Mod',
      dataIndex: 'modality',
      width: "7%",
      className: 'Study-count-column',
      render: (text, record) => (
        <Tooltip title={`${record.patient_id} | ${record.created_at}`}>
          {text}
        </Tooltip>
      ),
    },

    checkPermissionStatus('View Study description') && {
      title: 'Description',
      dataIndex: 'study_description',
      width: "15%",
      className: `${checkPermissionStatus('View Study description')
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
      title: 'Study date',
      dataIndex: 'created_at',
      width: "12%",
      render: (text, record) => convertToDDMMYYYY(record?.created_at)
    },

    checkPermissionStatus('View Institution name') && {
      title: 'Institution',
      dataIndex: 'institution',
      width: "10%",
      className: `${checkPermissionStatus('View Institution name')
        ? 'Study-count-column'
        : 'column-display-none'
        }`
    },

    {
      title: 'Count',
      dataIndex: 'count',
      width: "7%",
      className: 'Study-count-column',
      render: (text, record) => (
        <Statistic value={record?.count} style={{ fontSize: "1.4rem" }} />
      ),
    },

    {
      title: "Opt..",
      dataIndex: "chat",
      width: "6%",
      render: (text, record) => (
        <>
          <div>
            <div>

              <Tooltip title={`Study series`}>
                <PictureOutlined
                  className='action-icon'
                  style={{ width: "max-content" }}
                  onClick={() => ImageDrawerHandler(record)}
                />
              </Tooltip>

              {checkPermissionStatus('Study share option') && (
                <Tooltip title={`${record?.assign_user !== null ? `${record?.assign_user} =>` : ""} Share Study`}>
                  <IoIosShareAlt
                    className='action-icon action-icon-primary'
                    style={{ width: "max-content" }}

                    onClick={() => {
                      setStudyID(record.id)
                      setSeriesID(record.series_id)
                      setIsShareStudyModalOpen(true)
                      setStudyReferenceId(record?.refernce_id)
                    }}
                  />
                </Tooltip>
              )}

              <Tooltip title={`Chat`}>
                <BsChat
                  className='action-icon action-icon-primary study-table-chat-option'
                  onClick={() => {
                    setStudyReferenceId(record?.refernce_id)
                    setSeriesID(record.series_id)
                    setStudyID(record.id)
                    setIsDrawerOpen(true)
                    setPersonName(`${record.study.patient_id} | ${record.name}`)
                    setUrgentCase(record.urgent_case)
                    localStorage.setItem("currentChatId", record.series_id)
                  }}
                />
              </Tooltip>

              {checkPermissionStatus('Study delete option') && (
                <DeleteActionIcon
                  assign_user={record?.assign_user}
                  deleteActionHandler={() => deleteParticularStudy(record?.id)}
                />
              )}

            </div>
          </div>

        </>
      )
    },

    {
      title: "Report",
      dataIndex: "chat",
      width: "9%",
      render: (text, record) => (
        <>
          <div>
            <div>
              {checkPermissionStatus('Study clinical history option') && (
                <Tooltip title={`${record?.assign_user !== null ? `${record?.assign_user} =>` : ""} Clinical History`}>
                  <MdOutlineHistory
                    className='action-icon'
                    onClick={() => {
                      setStudyID(record.id)
                      setIsAssignModalOpen(true)
                      setStudyReferenceId(record?.refernce_id)
                    }}
                  />
                </Tooltip>
              )}

              {checkPermissionStatus('Study data option') && (
                <Tooltip title={`${record?.assign_user !== null ? `${record?.assign_user} =>` : ""} Study Report`}>
                  <IoIosDocument
                    className='action-icon'
                    onClick={() => {
                      setStudyID(record.id)
                      setStudyStatus(record.status)
                      setIsReportModalOpen(true)
                      setPatientId(record.patient_id)
                      setPatientName(record.name)
                      setStudyUId(record.study?.study_uid)
                      setStudyReferenceId(record?.refernce_id)
                      localStorage.setItem("studyUIDValue", record.study?.study_uid);
                    }}
                  />
                </Tooltip>
              )}

              {checkPermissionStatus('Study more details option') && (
                <Tooltip title={`${record?.assign_user !== null ? `${record?.assign_user} =>` : ""} More Details`}>
                  <BsEyeFill
                    className='action-icon action-icon-primary'
                    onClick={() => {
                      setStudyID(record.id)
                      setIsStudyModalOpen(true)
                      setStudyReferenceId(record?.refernce_id)
                    }}
                  />
                </Tooltip>
              )}

              {checkPermissionStatus('Study logs option') && (
                <Tooltip title={`${record?.assign_user !== null ? `${record?.assign_user} =>` : ""} Auditing`}>
                  <AuditOutlined
                    className='action-icon action-icon-primary'
                    onClick={() => {
                      setStudyID(record.id)
                      setIsModalOpen(true)
                      setStudyReferenceId(record?.refernce_id)
                    }}
                  />
                </Tooltip>
              )}

              {checkPermissionStatus('Study edit option') && (
                <EditActionIcon
                  assign_user={record?.assign_user}
                  editActionHandler={() => editActionHandler(
                    record?.id,
                    record?.refernce_id)}
                />
              )}
            </div>
          </div>
        </>
      )
    },

    {
      title: "Viewer",
      dataIndex: "chat",
      width: "7%",
      render: (text, record) => (
        <>
          <div>
            <div>

              <Tooltip title={`${record?.assign_user !== null ? `${record?.assign_user} =>` : ""} OHIF Viewer`}>
                <img src={OHIFViewer}
                  style={{ cursor: "pointer" }}
                  className='ohif-viwer-option-icon'
                  onClick={() => {
                    handleCellDoubleClick(record);
                    window.open(`https://viewer.cloudimts.com/viewer/${record?.study?.study_uid}`, "_blank");
                  }} />
              </Tooltip>

              <Tooltip title={`${record?.assign_user !== null ? `${record?.assign_user} =>` : ""} Weasis Viewer`}>
                <img
                  src={WeasisViewer}
                  className='Weasis-viewer-option-icon'
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleCellDoubleClick(record);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </>
      )
    },

  ].filter(Boolean)

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setStudyIdArray(prev => selectedRows?.map(data => data.id));
      setStudyReferenceIdArray(prev => selectedRows?.map(data => data?.refernce_id));
    },
    getCheckboxProps: record => ({
      id: record.id
    })
  }


  // **** Email share option handler **** // 

  const [form] = Form.useForm()

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isWhatsappShareModelOpen, setIsWhatsappModalOpen] = useState(false);
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


  // **** Image drawer option handler **** // 
  const ImageDrawerHandler = async (record) => {

    handleCellDoubleClick(record);

    getInstanceData({ study_id: record.study.study_original_id })
      .then(res => {
        if (res.data.status) {

          setStudyImagesList([...res.data.data]);
          setImageDrawerOpen(true);

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

  // **** Retervie institution list for quick filter **** // 
  const [institutionOptions, setInstitutionOptions] = useState([])

  const retrieveInstitutionData = async () => {
    const token = localStorage.getItem('token');
    await API.get('/user/v1/fetch-institution-list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            // ...item,
            label: item.name,
            value: item.name
          }))
          setInstitutionOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Quick Filter',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Quick Filter',
          err.response.data.message
        )
      )
  }

  useEffect(() => {
    retrieveInstitutionData(0);
  }, []);


  const [quickForm] = Form.useForm();

  // **** Apply quick filter option handler **** // 
  const HandleQuickFormSubmit = (value) => {
    quickFilterStudyData({ page: 1 }, value);
    setIsStudyQuickFilterModalOpen(true);
    setIsAdvanceSearchSelected(false);
  }

  // **** Quick filter reset option handler **** //
  const QuickFilterReset = () => {
    quickForm.resetFields();
    retrieveStudyData();
    setIsStudyQuickFilterModalOpen(false);

  }

  const SelectStatusOption = [
    {
      label: "New",
      value: "New"
    },
    {
      label: "Viewed",
      value: "Viewed"
    },
    {
      label: "Assigned",
      value: "Assigned"
    },
    {
      label: "InReporting",
      value: "InReporting"
    },
    {
      label: "Reported",
      value: "Reported"
    },
    {
      label: "ViewReport",
      value: "ViewReport"
    },
    {
      label: "ClosedStudy",
      value: "ClosedStudy"
    }
  ]

  return (
    <>

      {/* ==== Study Quick filter option ====  */}

      <div>

        <Form
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={quickForm}
          onFinish={HandleQuickFormSubmit}
          autoComplete={"off"}
          className='study-quick-filter-form'
          style={{ paddingLeft: "0.2rem" }}
        >
          <Row gutter={15}>
            
            <Col span={3}>
              <Form.Item
                name="study__patient_id__icontains"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter Patient Id",
                  },
                ]}
              >
                <Input placeholder="Patient Id" />
              </Form.Item>
            </Col>

            {/* ==== Patient id input ====  */}
            <Col span={3}>

              <Form.Item
                name="refernce_id"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter Reference Id",
                  },
                ]}
              >
                <Input placeholder="Reference Id" />
              </Form.Item>
            </Col>

            {/* ==== Patient name input ====  */}
            <Col span={3}>

              <Form.Item
                name="study__patient_name__icontains"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter Patient Name",
                  },
                ]}
              >
                <Input placeholder="Enter Patient Name" />
              </Form.Item>
            </Col>

            {/* ==== Modality ====  */}
            <Col span={3}>

              <Form.Item
                name="modality__icontains"
                className='quick-filter-input'
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter Modality",
                  },
                ]}
              >
                <Input placeholder="Enter Modality" />
              </Form.Item>
            </Col>

            {/* ==== Study status ====  */}
            <Form.Item
              name="status"
              className='quick-filter-input'
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Status",
                },
              ]}
            >
              <Select
                placeholder="Select Status"
                id='quick-filter-institution-selection'
                options={SelectStatusOption}
                style={{ width: "9rem" }}
              />
            </Form.Item>

            {/* ==== Institution ====  */}
            <Form.Item
              name="institution__name"
              className='quick-filter-input'
              rules={[
                {
                  required: false,
                  message: "Please enter Institution Name",
                },
              ]}
            >
              <Select
                placeholder='Select Institution'
                id='quick-filter-institution-selection'
                options={institutionOptions}
                style={{ width: "10rem" }}
              />
            </Form.Item>

            {/* ==== Study date ====  */}
            <Col span="3">
              <Form.Item
                name="created_at__startswith"
                className='quick-filter-date-picker'
                rules={[
                  {
                    required: false,
                    message: "Please enter date",
                  },
                ]}
              >
                <DatePicker format={"DD-MM-YYYY"} />

              </Form.Item>
              {/* ==== Clear filter option button ====  */}
            </Col>
            
            <Button key="submit"
              style={{ marginTop: "0.5rem", marginRight: "1rem", marginLeft:"0.5rem" }}
              type="primary"
              onClick={() => { quickForm.submit() }}
            >
              Apply
            </Button>

            {/* ==== Apply filter option button ====  */}

            <Button key="submit"
              danger
              style={{ marginTop: "0.5rem", marginLeft: "0.1rem" }}
              onClick={() => { QuickFilterReset() }}
              className={isStudyQuickFilterModalOpen ? 'quick-filter-selected' : ""}
            >
              <ClearOutlined/>
            </Button>

          </Row>
        </Form>

      </div>

      {/* ==== Study data table ====  */}

      <Table
        className='Study-table'
        dataSource={studyData}
        columns={columns}
        scroll={{ y: "calc(100vh - 305px)", x: "100%" }}
        key={studyData.map(o => o.key)}

        rowSelection={rowSelection}
        loading={isLoading}
        // Pagination handle
        pagination={{
          current: Pagination.page,
          pageSize: localStorage.getItem("pageSize") || Pagination.limit,
          total: totalPages,
          pageSizeOptions: [10, 25, 50, 100, 200, 500],
          showSizeChanger: totalPages > 10,
          onChange: (page = 1, pageSize = limit) => {
            localStorage.setItem("pageSize", pageSize)
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

      {/* ==== Edit study option ====  */}

      <EditStudy
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        referenceId={studyReferenceId}
      />

      {/* ==== Assign study modal ==== */}

      <AssignStudy
        isAssignModalOpen={isAssignModalOpen}
        setIsAssignModalOpen={setIsAssignModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        studyReference={studyReferenceId}
      />

      {/* ==== Study auditing modal ====  */}

      <StudyAudits
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        referenceId={studyReferenceId}
      />

      {/* ==== Study report modal ====  */}

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
        studyUIDInformation={studyUID}
        referenceId={studyReferenceId}
      />

      {/* ==== Study more details option ====  */}

      <PatientDetails
        isStudyModalOpen={isStudyModalOpen}
        setIsStudyModalOpen={setIsStudyModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        referenceId={studyReferenceId}
      />

      {/* ==== Study share option ====  */}

      <ShareStudy
        isShareStudyModalOpen={isShareStudyModalOpen}
        setIsShareStudyModalOpen={setIsShareStudyModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        seriesId={seriesID}
        referenceId={studyReferenceId}
      />

      {/* ==== Study chat option drawer ====  */}

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
          localStorage.removeItem("currentChatId")
        }}
        open={isDrawerOpen}
        className='chat-drawer'
      >
        <ChatMain
          referenceid={studyReferenceId}
          userId={studyID}
          orderId={seriesID}
          restaurantName={personName}
          messages={messages}
          setMessages={setMessages}
          drawerValue={true}
          urgentCase={urgentCase}
        />
      </Drawer>


      {/* ==== Advanced search option ====  */}

      <AdvancedSearchModal
        name={'Advanced Search'}
        retrieveStudyData={retrieveStudyData}
        advanceSearchFilterData={advanceSearchFilterData}
        quickFilterform={quickForm}
      />


      {/* ==== Quick assign study option ====  */}

      {isQuickAssignStudyModalOpen && (

        <AssignStudyModified
          isAssignModifiedModalOpen={isQuickAssignStudyModalOpen}
          setIsAssignModifiedModalOpen={setIsQuickAssignStudyModalOpen}
          studyID={studyID}
          setStudyID={setStudyID}
        />

      )}

      {/* ==== Study image drawer ====  */}

      <ImageDrawer
        isDrawerOpen={isImageModalOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        imageList={studyImagesList}
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
                  <DatePicker format={'DD-MM-YYYY'} />
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
                  <DatePicker format={'DD-MM-YYYY'} />
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
                  initialValue={true}
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
