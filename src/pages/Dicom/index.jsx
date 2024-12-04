import React, { useContext, useEffect, useState, useRef } from 'react'
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
  Select, 
  Image, 
  notification
} from 'antd'; 
import { CheckCircleOutlined, ClearOutlined, CloseCircleOutlined, CloseOutlined, PictureOutlined } from '@ant-design/icons'
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
import { BsChat } from 'react-icons/bs'
import {  IoIosShareAlt } from 'react-icons/io'
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
import ImageDrawer from './ImageDrawer'
import { convertToDDMMYYYY, modifyDate, removeNullValues } from '../../helpers/utils'
import  OHIFViewer from "../../assets/images/menu.png";
import WeasisViewer from "../../assets/images/Weasis.png";
import API from '../../apis/getApi' 
import StudyReportIcon from "../../assets/images/study-report.png"
import { RoomDataContext } from '../../hooks/roomDataContext'; 
import ReUploadStudyModel from '../../components/Studies/reloadUpload'; 
import ReUploadIcon from "../../assets/images/reupload.png" ; 
import ManulImageDrawer from './manulImageDrawer'
import moment from 'moment';

const BASE_URL = import.meta.env.VITE_APP_SOCKET_BASE_URL
let timeOut = null ; 
const Dicom = () => {

  const [isLoading, setIsLoading] = useState(false)
  const { setStudyIdArray, setStudyReferenceIdArray,studyReferenceIdArray, setSeriesIdList, totalPages, setTotalPages, studyCountInforamtion, setStudyCountInformation, studyIdArray} = useContext(StudyIdContext)
  const { isFilterSelected, isAdvanceSearchSelected, setIsAdvanceSearchSelected } = useContext(FilterSelectedContext);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isImageModalOpen, setImageDrawerOpen] = useState(false)
  const [isShareStudyModalOpen, setIsShareStudyModalOpen] = useState(false) ; 
  const [api, contextHolder] = notification.useNotification();

  // Breadcumbs information 
  const { changeBreadcrumbs } = useBreadcrumbs()

  // Chat related useState
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [messages, setMessages] = useState([])

  // Pagination related useState information
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  // const [totalPages, setTotalPages] = useState(0)
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
    setSystemFilterPayload,
    chatStudyData, 
    setChatStudyData
  } = useContext(StudyDataContext)


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

  const [notificationValue, setNotificationValue] = useState(0);

  const [reUploadOptionModel, setReUploadOptionModel] = useState(false) ; 
  const [reuploadStudyData, setReuploadStudyData] = useState({}) ; 

  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Store the selected row keys

  const checkPermissionStatus = name => {
    const permission = permissionData['StudyTable view']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const otherPremissionStatus = (title, permission_name) => {
    const permission = permissionData[title]?.find(
      data => data.permission === permission_name
    )?.permission_value
    return permission
  }

  const { setRoomID } = useContext(RoomDataContext)


  // **** Setup Chat notification socket connection **** // 
  const [chatConnection, setChatConnection] = useState(null) ; 
  const SetupGenralChatNotification = () => {
    if (chatConnection && chatConnection.readyState === WebSocket.OPEN) {
      return; // Exit the function if the connection is already open
    }

    const ws = new WebSocket(`${BASE_URL}genralChat/`); 
    setChatConnection(ws) ; 

    ws.onopen = () => {
      console.log('Chat Websocket connected')
    }

    ws.onmessage = event => {
      try {
        const eventData = JSON.parse(event.data);

        if (eventData.payload.status == "new-chat") {
          let ChatData = eventData.payload.data; // Chat data related information 

          if ((localStorage.getItem("currentChatId") !== ChatData.room_name) || localStorage.getItem("currentChatId") == null) {
            studyData.map((element) => {
              if (element.series_id === ChatData.room_name) {
                
                // Store chat data for all notification related information ---- Start 
                let chatnotificationData = localStorage.getItem("chat-data");
                console.log(ChatData.sender_username);
                
                if (chatnotificationData === null) {
                  localStorage.setItem("chat-data", JSON.stringify([]));
                }
                let chatdata = localStorage.getItem("chat-data");
                chatdata = JSON.parse(chatdata);
                chatdata.push(
                  {
                    sender: ChatData.sender_username,
                    'message': `Message send by ${ChatData.sender_username} for Study Reference id - ${element?.refernce_id}`,
                    "Patientid": element?.refernce_id, 
                    ...element, 
                  }
                )
                localStorage.setItem("chat-data", JSON.stringify(chatdata));
                // Store chat data for all notification related information ---- End 

                if (ChatData.urgent_case) {
                  setChatNotificationData([
                    ...chatNotificationData,
                    { message: 
                      `Message send by ${ChatData.sender_username} for Study Reference id - ${element?.refernce_id}`, 
                      "Patientid": element?.refernce_id, 
                      ...element, 
                      sender: ChatData.sender_username
                    }]);
                  // NotificationMessage("important",
                  //   "New chat message", `Message send by ${ChatData.sender_username} for Patient - ${element.name} and Patient Id - ${element.refernce_id}`,
                  //   2,
                  //   "topLeft");
                } else {

                  setChatNotificationData([
                    ...chatNotificationData,
                    { message: 
                      `Message send by ${ChatData.sender_username} for Study Reference id - ${element?.refernce_id}`, 
                      "Patientid": element?.refernce_id, 
                      ...element, 
                      sender: ChatData.sender_username
                    }]);
                  
                  // NotificationMessage("success",
                  //   "New chat message", `Message send by ${ChatData.sender_username} for Patient - ${element.name} and Patient Id - ${element.refernce_id}`,
                  //   2,
                  //   "topLeft");
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

  const [reloadValue, setReloadValue] = useState(0) ; 
  const visibilityChangeHandler = async () => {
    if (document.visibilityState == "visible"){
      setReloadValue((prev) => prev + 1) ; 
    }
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", visibilityChangeHandler)
  },[]) ; 

  useEffect(() => {
    setPagi(Pagination)
    if ( !isFilterSelected && Object.keys(systemFilterPayload).length === 0 && Object.keys(studyDataPayload).length === 0 && !isAdvanceSearchSelected) {
      retrieveStudyData(Pagination)
    }
  }, [Pagination, isFilterSelected, studyDataPayload, systemFilterPayload, reloadValue]) ; 


  const [series_remove_id, set_series_remove_id] = useState([]) ; 
  const startTime = useRef(new Date().getTime());
  const seriesCountTimeOut = useRef(null);

  useEffect(() => {
    clearTimeout(seriesCountTimeOut) ;
    let temp = [] ;  
    studyData.map((data) => {
      if (!series_remove_id.includes(data?.id)){
        temp.push({
          "series_id": data?.study?.study_original_id, 
          "id": data?.id, 
          "manual_series": data?.manual_upload
        })
      }
    });
    // fetchSeriesCountInformation(temp);
  }, [series_remove_id]) ; 

  // ******** Fetch series information count related api ********** // 4
  async function fetchSeriesCountInformation(series_list) {
    if (series_list?.length !== 0 && window?.location?.pathname == "/studies") {
      let remove_series_id = [...series_remove_id];
      const requestPayload = { series_list };
      try {
        const responseData = await APIHandler(
          'POST',
          requestPayload,
          'studies/v1/series_instance_count'
        );

        if (responseData?.status) {
          if (Object.keys(responseData?.data).length !== 0) {
            setStudyCountInformation(prev => ({ ...prev, ...responseData?.data }));
            remove_series_id = responseData?.remove_id;
            set_series_remove_id([...series_remove_id, ...remove_series_id]);
          }
        }
      } catch (error) {
        console.error('Error fetching series count information:', error);
      }

      clearTimeout(seriesCountTimeOut.current); // Cleartime out value 

      seriesCountTimeOut.current = setTimeout(async () => {
        const currentTime = new Date().getTime();

        // Check if 5 minutes have passed
        if (currentTime - startTime.current < 6 * 60 * 1000) {
          const temp = studyData
            .filter((data) => !remove_series_id.includes(data?.id))
            .map((data) => ({
              series_id: data?.study?.study_original_id,
              id: data?.id,
              manual_series: data?.manual_upload,
            }));

          await fetchSeriesCountInformation(temp); // Ensure studyData is updated before recursive call
        } else {
          clearTimeout(seriesCountTimeOut.current);
        }
      }, 3000);

    }
  }

  const initiatePolling = async () => {
    const temp = studyData.map((data) => ({
      series_id: data?.study?.study_original_id,
      id: data?.id,
      manual_series: data?.manual_upload,
    }));

    startTime.current = new Date().getTime(); // Reset startTime if studyData changes
    await fetchSeriesCountInformation(temp);
  };
  
  useEffect(() => {
    clearTimeout(seriesCountTimeOut.current);
    initiatePolling();
    return () => {
      clearTimeout(seriesCountTimeOut.current); // Cleanup timeout on component unmount
    };
    
  }, [studyData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setReloadValue(prev => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [document.visibilityState]);

  useEffect(() => {
    if (!isLoading && studyData.length !== 0 && notificationValue === 0) {
      setNotificationValue(1)
      SetupGenralChatNotification()
    }
  }, [isLoading, 
    studyData, 
    notificationValue, 
    reloadValue
  ]) ; 

  useEffect(() => {
    changeBreadcrumbs([{ name: `Study` }])
    setSystemFilterPayload({})
    setStudyDataPayload({})
    setStudyIdArray([])
  }, []); 

  // **** Study quick filter option handler **** // 
  const quickFilterStudyData = (pagination, values = {}) => {

    setIsLoading(true)
    setQuickFilterPayload(values)

    filterStudyData({
      filter: removeNullValues(values),
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
  const editActionHandler = (id, erenceId) => {
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

  const handleCellClick = (record) => {
    const newSelectedRowKeys = [...selectedRowKeys];
    
    const index = newSelectedRowKeys.indexOf(record.id);
    if (index > -1) {
      newSelectedRowKeys.splice(index, 1);
    } else {
      newSelectedRowKeys.push(record.id);
    }
    setSelectedRowKeys(newSelectedRowKeys); // Update the selected row keys
  
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      width: "10%",
      render: (text, record) => (
        <Tooltip title={`${record?.assign_user?.assign_user !== undefined ? `${record?.assign_user?.perform_user} => ${record?.assign_user?.assign_user}` : "Study status"} `}>
          <Tag
            color={
              text === 'New'
                ? '#000000'
                : (text === 'Assigned' && record?.top_assign == 0)
                  ? '#3d5a80' 
                : (text === 'Assigned' && record?.top_assign == 1)
                  ? '#D22B2B' 
                  : text === 'Viewed'
                    ? '#e3dc02'
                    : text === 'ViewReport'
                      ? 'lime'
                      : text === 'InReporting'
                        ? '#795695'
                        : text === 'ClosedStudy'
                          ? '#097969'
                          : text == "Draft"
                            ?"#B8860B":'blue'
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
      ),
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },
    checkPermissionStatus('View Institution name') && {
      title: 'Institution',
      dataIndex: 'institution',
      width: "10%",
      className: `${checkPermissionStatus('View Institution name')
        ? 'Study-count-column '
        : 'column-display-none'
        }`, 
      render: (text, record) => (
        record.urgent_case?<>
          <Tag color='red'>
            <span style={{fontWeight: 600}}>{text}</span>
          </Tag>
        </>:<>
          <Tag color='blue'>
            <span style={{fontWeight: 600}}>{text}</span>
          </Tag>
        </>
      ), 
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },
    checkPermissionStatus('Study id') && {
      title: "Reference Id",
      dataIndex: 'refernce_id',
      width: "8%",
      className: `${checkPermissionStatus('View Patient id') ? '' : 'column-display-none'}`,
      render: (text, record) => (
        record.urgent_case ? <>
            <span style={{fontWeight: 500, color: "red"}}>{text}</span>
        </> : <>
            <span style={{fontWeight: 500}}>{text}</span>
        </>
      ),
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },
    {
      title: "Patient Id",
      dataIndex: 'patient_id',
      width: "7%",
      className: `${checkPermissionStatus('View Patient id') ? '' : 'column-display-none'}`,
      render: (text, record) => (
        <span style={{fontWeight: 500}}>{text}</span>
      ),
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },
    checkPermissionStatus('View Patient name') && {
      title: "Patient's Name",
      dataIndex: 'name',
      ellipsis:true,
      width: "17%",
      className: `${checkPermissionStatus('View Patient name') ? '' : 'column-display-none'}`,
      render: (text, record) => (
        record.urgent_case ? <>
          <span style={{maxWidth: "100%", whiteSpace: "normal", fontWeight: 500, color: "red"}}>{text}</span>
        </> : <>
          <span style={{maxWidth: "100%", whiteSpace: "normal", fontWeight: 500}}>{text}</span>
        </>
      ),
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },
    {
      title: 'Mod',
      dataIndex: 'modality',
      width: "7%",
      className: 'Study-count-column',
      render: (text, record) => (
        <span style={{fontWeight: 600}}>{text}</span>
      ),
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
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
        <span style={{
          fontWeight: 500
        }}>{text}</span>
      ),
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },
    {
      title: 'Study date',
      dataIndex: 'created_at',
      width: "12%",
      render: (text, record) => <span style={{fontWeight: 500}}>{convertToDDMMYYYY(record?.created_at)}</span>, 
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },
    {
      title: 'Count',
      dataIndex: 'count',
      width: "6%",
      className: 'Study-count-column',
      render: (text, record) => (
        <Statistic value={studyCountInforamtion[record?.study?.study_original_id] !== undefined ?`${studyCountInforamtion[record?.study?.study_original_id]['series_count']}/${studyCountInforamtion[record?.study?.study_original_id]['instance_count']}`:"0/0"} 
          style={{ fontSize: "1.4rem", fontWeight: 500 }} />
      ),
      onCell: (record) => ({
        onClick: () => handleCellClick(record)
      })
    },

    {
      title: "Report",
      dataIndex: "chat",
      width: "9%",
      className: "highlight-study-column", 
      render: (text, record) => (
        <>
          <div>
            <div>
              {checkPermissionStatus('Study clinical history option') && (
                <Tooltip title={`Clinical History`}>
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
                <Tooltip title={`Study Report`}>
                  <img src={StudyReportIcon}
                    className='action-icon study-report-icon'
                    onClick={() => {
                      setStudyID(record.id)
                      setStudyStatus(record.status)
                      setIsReportModalOpen(true)
                      setPatientId(record.patient_id)
                      setPatientName(record.name)
                      setStudyUId(record.study?.study_original_id)
                      setStudyReferenceId(record?.refernce_id)
                      localStorage.setItem("studyUIDValue", record.study?.study_original_id);
                    }}
                  />
                </Tooltip>
              )}

              {checkPermissionStatus('Study logs option') && (
                <Tooltip title={`Auditing`}>
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
      title: "Others",
      dataIndex: "chat",
      width: "8%",
      render: (text, record) => (
        <>
          <div>
            <div>
              {!record?.manual_upload && (
                <Tooltip title={`Study series`}>
                  <PictureOutlined
                    className='action-icon'
                    style={{ width: "max-content" }}
                    onClick={() => {
                      setStudyUId(record.study?.study_original_id); 

                      if (record?.manual_upload){
                        SeriesImagesFetchHandler(record?.id)
                      } else {
                        ImageDrawerHandler(record)
                      }
                    }}
                  />
                </Tooltip>
              )}
              
              {checkPermissionStatus('Study share option') && (
                <Tooltip title={`Share Study`}>
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
                    setRoomID(record?.series_id)
                    setStudyReferenceId(record?.refernce_id)
                    setSeriesID(record.series_id)
                    setStudyID(record.id)
                    setIsDrawerOpen(true)
                    // setPersonName(`${record.study.patient_id} | ${record.name}`)
                    setPersonName({
                      "patient_id": record?.study.patient_id, 
                      "patient_name": record?.study?.patient_name,
                      "reference_id": record?.refernce_id
                    })
                    setUrgentCase(record.urgent_case)
                    localStorage.setItem("currentChatId", record.series_id)
                  }}
                />
              </Tooltip>

              {checkPermissionStatus('Study delete option') && (
                <DeleteActionIcon
                  title = "Delete study"
                  description={"are you sure you want to delete this study?"}
                  assign_user={record?.assign_user}
                  deleteActionHandler={() => deleteParticularStudy(record?.id)}
                />
              )}
              
              {checkPermissionStatus("Reupload Option") && (
                <Tooltip title={`ReUpload study`}>
                  <img onClick={() => {setReUploadOptionModel(true); setReuploadStudyData({...record})}} src = {ReUploadIcon} className='reupload-option-icon' />
                </Tooltip>
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
      render: (text, record) => {
        return !record?.manual_upload?(
          <>
            <div>
              <div>
  
                <Tooltip title={`OHIF Viewer`}>
                  <img src={OHIFViewer}
                    style={{ cursor: "pointer" }}
                    className='ohif-viwer-option-icon'
                    onClick={() => {
                      handleCellDoubleClick(record);
                      window.open(`https://viewer.cloudimts.com/ohif/viewer?url=../studies/${record?.study?.study_original_id}/ohif-dicom-json`, "_blank");
                    }} />
                </Tooltip>
  
                <Tooltip title={`Weasis Viewer`}>
                  <img
                    src={WeasisViewer}
                    className='Weasis-viewer-option-icon'
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleCellDoubleClick(record);
                      WeasisViewerHandler(record?.patient_id)
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </>
        ):<Tooltip title={`Study series`}>
          <PictureOutlined
            className='action-icon'
            style={{ width: "max-content" }}
            onClick={() => {
              setStudyUId(record.study?.study_original_id); 

              if (record?.manual_upload){
                SeriesImagesFetchHandler(record?.id)
              } else {
                ImageDrawerHandler(record)
              }
            }}
        />
      </Tooltip>
      }
    },

  ].filter(Boolean)

  const rowSelection =otherPremissionStatus("Studies permission", "Study Checkbox")?{
    selectedRowKeys: selectedRowKeys, // Track selected row keys
    onChange: (selectedRowKeys, selectedRows) => {
      setStudyIdArray(prev => selectedRows?.map(data => data.id));
      setStudyReferenceIdArray(prev => selectedRows?.map(data => data));
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: record => ({
      id: record.id
    })
  } : false

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
    // handleCellDoubleClick(record);
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

  // *** Get series images inforamtion **** // 
  const [manulDrawerOpen, setManulDrawerOpen] = useState(false) ; 
  const SeriesImagesFetchHandler = async (id) => {
    let responseData = await APIHandler("POST", {id:id}, "studies/v1/fetch_series_image") ; 
    if (responseData === false){
      NotificationMessage("warning", "Network request failed") ; 
    } else if (responseData?.status){
      setStudyImagesList([...responseData?.data]);
      setManulDrawerOpen(true);
    } else {
      NotificationMessage("warning", responseData?.message) ; 
    }
    
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
    retrieveInstitutionData();
  }, [reloadValue]);


  const [quickForm] = Form.useForm();

  // **** Reterive all patient name information **** // 
  const [patientNameOptions, setPatientNameOptions] = useState([]) ; 

  const AllPatientNameFetch = async () => {

    let responseData = await APIHandler("POST", {}, "studies/v1/all_patient_name") ; 

    if (responseData === false){
      NotificationMessage("warning", "Network request failed") ; 
    
    } else if (responseData?.status){
      const resData = [] 
      responseData?.data.map((element) => {
        resData.push({
          label: element, 
          value: element
        })
      })
      setPatientNameOptions(resData) ; 

    } else {
      NotificationMessage("warning", "Network request failed", responseData?.message) ; 
    }
  }

  useEffect(() => {
    AllPatientNameFetch() ; 
  }, [reloadValue]) ; 


  // **** Apply quick filter option handler **** // 
  const HandleQuickFormSubmit = (value) => {
    
    if (value.refernce_id === "") {
      value.refernce_id = undefined;
    }

    if (value.study__patient_id__icontains === ""){
      value.study__patient_id__icontains = undefined ; 
    }

    if (value.modality__icontains === ""){
      value.modality__icontains = undefined ; 
    }

    if (value.study__patient_name__icontains ===  ""){
      value.study__patient_name__icontains = undefined ; 
    }

    quickFilterStudyData({ page: 1 }, value);
    setIsStudyQuickFilterModalOpen(true);
    setIsAdvanceSearchSelected(false);
  }

  // *** Set Patient id change value **** // 
  const HandlePatientIdChange = (value) => {

    if (timeOut) clearTimeout(timeOut) ; 

    timeOut = setTimeout(() => {
      quickForm.submit() ; 
    }, 500) ;
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
      label: "Un-Assigned",
      value: "Un-Assigned"
    },
    // {
    //   label: "InReporting",
    //   value: "InReporting"
    // },
    {
      label: "Reported",
      value: "Reported"
    },
    // {
    //   label: "ViewReport",
    //   value: "ViewReport"
    // },
    {
      label: "ClosedStudy",
      value: "ClosedStudy"
    },
    {
      label: "Draft",
      value: "Draft"
    }
  ]

  // **** Notification message click option handler **** // 

  useEffect(() => {
    if (chatStudyData !== null){ 
      let studyMatch = 0;

      studyData.map((element) => {
        if (element?.refernce_id == chatStudyData){
          studyMatch = 1 ; 
          setChatStudyData(null) ;  
          setStudyReferenceId(chatStudyData) ; 
          setSeriesID(element?.series_id) ; 
          setStudyID(element?.id) ; 
          setIsDrawerOpen(true) ; 
          // setPersonName(`${element.study.patient_id} | ${element.name}`) 
          setPersonName({
            "patient_id": element?.study.patient_id, 
            "patient_name": element?.study?.patient_name,
            "reference_id": element?.refernce_id
          })
          setUrgentCase(element?.urgent_case)
          localStorage.setItem("currentChatId", element?.series_id)
        }
      })

      if (studyMatch == 0){
        NotificationMessage("warning", "Not available any study in your study page") ;
      }
    }
  }, [chatStudyData]) ; 

  // Weasis viewer option handler 
  const WeasisViewerHandler = (patientId) => {

    const originalString = `$dicom:rs --url "https://viewer.cloudimts.com/dicomweb" -r "patientID=${patientId}"`;
    let encodedString = encodeURIComponent(originalString);
    encodedString = "weasis://" + encodedString;
    window.open(encodedString, "_blank");
  }

  // =================== Chat Notification related Functionality Handler ==================== //
  
  const ChatMessageClickHandler = (reference_id) => {
    setChatStudyData(reference_id)
  }

  useEffect(() => {
    // Handle visibility change for notifications
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        let tempData = localStorage.getItem("chat-data");
        let view_notification = localStorage.getItem("view-notification");
        
        view_notification = view_notification !== null ? JSON.parse(view_notification) : [];
  
        if (tempData !== null && studyData?.length > 0) {
          tempData = JSON.parse(tempData);
  
          tempData.forEach((element) => {
            if (!view_notification?.includes(element?.id)) {
              view_notification.push(element?.id);
              if (element?.urgent_case) {
                api.error({
                  message: `Message from ${element?.sender}`,
                  description: (
                    <span>
                      <strong>Ref ID:</strong> {element?.refernce_id}, <strong>Patient:</strong> {element?.name}. Please review.
                    </span>
                  ),
                  duration: 0,
                  placement: "bottomLeft",
                  className: "chat-notification-div",
                });
              } else {
                api.info({
                  message: `Message from ${element?.sender}`,
                  description: (
                    <span>
                      <strong>Ref ID:</strong> {element?.refernce_id}, <strong>Patient:</strong> {element?.name}. Please review.
                    </span>
                  ),
                  duration: 0,
                  placement: "bottomLeft",
                  className: "chat-notification-div",
                  onClick: () => {
                    
                    // Update localstorage "chat-data" start ================
                    let chat_data = localStorage.getItem("chat-data");
                    chat_data = chat_data !== null?JSON.parse(chat_data):[] ; 

                    chat_data = chat_data.filter(item => item?.id !== element?.id) ; 
                    localStorage.setItem("chat-data", JSON.stringify(chat_data)); 

                    // Update localstorage "chat-data" end ==================

                    // Update localstorage "view-notification" start ===========
                    let view_notification = localStorage.getItem("view-notification") ; 
                    view_notification = view_notification !== null?JSON.parse(view_notification):[] ; 
                    view_notification = view_notification.filter(item => item != element?.id) ; 
                    localStorage.setItem("view-notification", JSON.stringify(view_notification)) ; 

                    // Update localstorage "view-notification" end =============
                    setChatNotificationData((prevData) => {
                      return prevData.filter(item => item?.id !== element?.id);
                    });

                    ChatMessageClickHandler(element?.refernce_id);
                    api.destroy(element?.refernce_id) ; 
                  },
                  key: element?.refernce_id
                });                
              }
            }
          });
  
          localStorage.setItem("view-notification", JSON.stringify(view_notification));
        }
      }
    };
  
    // Clear notifications on page reload
    const clearViewNotification = () => {
      localStorage.setItem("view-notification", JSON.stringify([]));
    };
  
    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", clearViewNotification);
  
    return () => {
      // Cleanup event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", clearViewNotification);
    };
  }, [chatNotificationData, studyData]);

  return (
    <>
      {contextHolder}

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
          style={{ paddingLeft: "0.2rem", marginTop: "-1rem" }}
        >
          <Row gutter={15}>

            <div>
              <p className='total_page_info_title'>Total Studies <br/>{totalPages}</p>
            </div>
            
            {/* ===== Reference id  input =====  */}

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
                <Input 
                  onPressEnter={() => {quickForm.submit()}}
                  placeholder="Reference Id" 
                  onChange={(e) => {
                    HandlePatientIdChange(e.target.value)
                  }}
                  style={{
                  }}
                  className='dicom-quick-filter'
                />
              </Form.Item>
            </Col>
            <Col span={3}>

              {/* ===== Patient id input ======  */}
              
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
                <Input 
                  onPressEnter={() => {quickForm.submit()}}   
                  onChange={(e) => {
                    HandlePatientIdChange(e.target.value)
                  }}
                  placeholder="Patient Id" 
                />

              </Form.Item>
            </Col>


            {/* ===== Patient name selection option ======  */}

            <Col span={3}>

              <Form.Item
                name="study__patient_name__icontains"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Patient Name",
                  },
                ]}
              >
                <Select
                  placeholder = "Patient name"
                  options={[...patientNameOptions]}
                  showSearch
                  onChange={() => {quickForm.submit()}}
                  allowClear
                />
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
                <Input 
                  onPressEnter={() => {quickForm.submit()}}
                  placeholder="Modality" 
                />
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
                onChange={() => {quickForm.submit()}}
                allowClear
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
                onChange={() => {quickForm.submit()}}
                allowClear
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
                <DatePicker 
                  onChange={() => {quickForm.submit()}}
                  format={"DD-MM-YYYY"} 
                  allowClear
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />

              </Form.Item>
            </Col>

            {/* ==== Apply filter option button ====  */}

            <Button key="submit"
              danger
              style={{ marginTop: "0.5rem", marginLeft: "1rem" }}
              onClick={() => { QuickFilterReset() }}
              className={isStudyQuickFilterModalOpen ? 'quick-filter-selected' : ""}
            >
              <Tooltip title = "Clea">
                <ClearOutlined/>
              </Tooltip>
            </Button>

          </Row>
        </Form>

      </div>

      {/* ==== Study data table ====  */}

      <Table
        className='Study-table'
        dataSource={studyData}
        columns={columns}
        scroll={{ y: "calc(100vh - 275px)", x: "100%" }}
        key={studyData.map(o => o.key)}
        rowSelection={rowSelection}        
        loading={isLoading}
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
        width={400}
        open={isDrawerOpen}
        className='chat-drawer'
      >
        <div style={{
          position:"absolute",
          right:"0.5rem",
          top:"1rem",
          zIndex:"999",
          paddingRight: 10
        }}>
          <CloseOutlined 
            style={{fontSize:"1.3rem",cursor:"pointer"}} onClick={() => {
              setStudyID(null)
              setSeriesID(null)
              setIsDrawerOpen(false)
              setMessages([])
              setPersonName(null)
              localStorage.removeItem("currentChatId")
            }
          }/>
        </div>
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
        studyUID={studyUID}
      />

      {/* ==== Manual study image drawer information ====  */}
      <ManulImageDrawer
        isDrawerOpen={manulDrawerOpen}
        setImageDrawerOpen={setManulDrawerOpen}
        imageList={studyImagesList}
        studyUID={studyUID}
      />

      {/* ===== Study Export option modal ======  */}

      <Modal
        title='Study Export'
        centered
        open={isStudyExportModalOpen}
        onOk={() => form.submit()}
        okText = "Export"
        onCancel={() => setIsStudyExportModalOpen(false)}
        className='Study-export-option-modal'
      >
        <Spin spinning={studyExportLoading}>
          <Form 
          form={form} 
          onFinish={StudyExportOptionHandler} 
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          >
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
                  <DatePicker format={'DD/MM/YYYY'}/>
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
                  <DatePicker format={'DD/MM/YYYY'}/>
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

      {/* ==== ReUpload Study option module ====  */}
      <ReUploadStudyModel
        isModalOpen = {reUploadOptionModel}
        setIsModalOpen = {setReUploadOptionModel}
        studyData = {reuploadStudyData}
      />

    </>
  )
}

export default Dicom
