import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Menu,
  Popover,
  Select,
  Popconfirm,
  Badge,
  Avatar, 
  List
} from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRoleContext } from '../hooks/usersRolesContext'
import { UserEmailContext } from '../hooks/userEmailContext'
import { filterDataContext } from '../hooks/filterDataContext'
import { ReportDataContext } from '../hooks/reportDataContext'
import { UserPermissionContext } from '../hooks/userPermissionContext'
import { SiMicrosoftexcel } from 'react-icons/si'
import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExportOutlined,
  NotificationOutlined
} from '@ant-design/icons'
import { handleDownloadPDF, handleExport } from '../helpers/billingTemplate'
import { BillingDataContext } from '../hooks/billingDataContext'
import { StudyIdContext } from '../hooks/studyIdContext'
import NotificationMessage from './NotificationMessage'
import { deleteStudy, getReportList } from '../apis/studiesApi'
import { FilterSelectedContext } from '../hooks/filterSelectedContext'
import { AiOutlineFilter, AiOutlinePlus } from 'react-icons/ai'
import StudyFilterModal from './StudyFilterModal'
import { StudyDataContext } from '../hooks/studyDataContext'
import {
  applyMainFilter,
  applySystemFilter,
  retrieveSystemFilters
} from '../helpers/studyDataFilter'
import APIHandler from '../apis/apiHandler'

const HeaderButton = ({
  id,
  filterOptions,
  retrieveFilterOptions
}) => {
  const navigate = useNavigate()

  const { permissionData } = useContext(UserPermissionContext)
  const { setIsRoleModalOpen } = useContext(UserRoleContext)
  const {
    isFilterSelected,
    isAdvanceSearchSelected,
    setIsAdvanceSearchSelected
  } = useContext(FilterSelectedContext)
  const { setIsEmailModalOpen } = useContext(UserEmailContext)
  const {
    setIsFilterModalOpen,
    setIsUserFilterModalOpen,
    setIsEmailFilterModalOpen,
    setIsBillingFilterModalOpen,
    setIsRoleLogsFilterModalOpen,
    setIsInstitutionLogsFilterModalOpen,
    setIsUserLogsFilterModalOpen,
    setIsSupportModalOpen,
    setIsAdvancedSearchModalOpen,
    setIsStudyExportModalOpen,
    setIsQuickAssignStudyModalOpen,
    templateOption,
    setEmailSupportOption,
    setPhoneSupportOption, 
    chatNotificationData, 
    setChatNotificationData
  } = useContext(filterDataContext)

  const { setSelectedItem } = useContext(ReportDataContext)
  const { billingFilterData, setBillingFilterData } =
    useContext(BillingDataContext)
  const { studyIdArray, setStudyIdArray } = useContext(StudyIdContext)
  const [templateOptions, setTemplateOptions] = useState([])
  const [isAddFilterModalOpen, setIsAddFilterModalOpen] = useState(false)
  const {
    setStudyDataPayload,
    setStudyData,
    setSystemFilterPayload,
    studyDataPayload,
    systemFilterPayload,
    studyData
  } = useContext(StudyDataContext)
  const [systemFilters, setSystemsFilters] = useState([])
  const [isFilterCollapseOpen, setIsFilterCollapseOpen] = useState(false)
  const [isFilterChecked, setIsFilterChecked] = useState(null)
  const [isSystemFilterChecked, setIsSystemFilterChecked] = useState(null)

  const checkPermissionStatus = name => {
    const permission = permissionData['Menu Permission']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  // **** Reterive templates list for Study report page **** //

  const retrieveTemplateOptions = async () => {

    let requestPayload = {
      "page_number": 1,
      "page_limit": 200,
      "modality": templateOption
    };

    let responseData = await APIHandler("POST", requestPayload, "report/v1/submitReportlist")

    if (responseData === false) {
      NotificationMessage(
        "warning",
        "Network request failed"
      )

    } else if (responseData?.status === true) {

      const resData = responseData?.data.map((data) => ({
        label: data?.name,
        value: data?.id
      }))

      setTemplateOptions([...resData]);

    } else {

      NotificationMessage(
        "warning",
        responseData?.message,
        "Network request failed"
      )
    }

  }

  useEffect(() => {

    if (window.location.pathname === `/reports/${id}`) {
      retrieveTemplateOptions();
    }

  }, [window.location.pathname, templateOption])

  // **** Reterive system filter list for Study page **** // 

  const fetchSystemFilter = async () => {

    const response = await retrieveSystemFilters()

    const modifiedOptions = response.map(data => ({
      label: data.name,
      value: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      key: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      details: data.filter_data
    }))

    setSystemsFilters(modifiedOptions);
  }

  useEffect(() => {
    if (window.location.pathname === '/studies') {
      fetchSystemFilter()
    }
  }, [window.location.pathname])


  // **** Delete study option for Study page **** // 

  const deleteStudyData = async () => {

    if (studyIdArray.length > 0) {
      deleteStudy({ id: studyIdArray })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', "Study delete successfully");
            setStudyIdArray([]);
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
    } else {
      NotificationMessage('warning', 'Please select study for delete')
    }
  }

  // **** Reload option handler for Study page **** // 

  const ReloadOptionHandler = () => {
    window.location.reload();
  }

  // **** Quick assign study option handler for Study page **** // 

  const QuickAssignStudyModalHandler = () => {
    if (studyIdArray.length === 0) {
      NotificationMessage("warning", "Please, Select study for assign");
    } else {
      setIsQuickAssignStudyModalOpen(true);
    }
  }

  // ==== Study page filter dropdown ===== //   

  const content = (

    <Collapse
      bordered={true}
      expandIconPosition='end'
      className='setting-main-div'
      accordion
    >

      {/* ===== System filter list =====  */}

      <Collapse.Panel
        header='Normal filter'
        key='2'
        className='setting-panel mb-0  normal-filter-option-list'
      >
        {systemFilters?.map(data => (
          <div key={data?.key}>
            <Checkbox
              name={data?.label}
              key={data?.key}
              checked={isSystemFilterChecked === data?.key}
              onClick={() => {
                setIsFilterChecked(null)
                setIsSystemFilterChecked(data?.key)
                if (data?.key === isSystemFilterChecked) {
                  setIsSystemFilterChecked(null)
                  setSystemFilterPayload({})
                } else {
                  const option = data?.key?.split(' ')[0]
                  const filterOption = data?.key?.split(' ')[1]
                  setSystemFilterPayload({
                    option,
                    page_number: 1,
                    page_size: 10,
                    deleted_skip: false,
                    filter:
                      filterOption !== 'undefined'
                        ? {
                          status__icontains: filterOption
                        }
                        : {},
                    all_premission_id: JSON.parse(
                      localStorage.getItem('all_permission_id')
                    ),
                    all_assign_id: JSON.parse(
                      localStorage.getItem('all_assign_id')
                    )
                  })
                  applySystemFilter(
                    {
                      option,
                      page_number: 1,
                      page_size: 10,
                      deleted_skip: false,
                      filter:
                        filterOption !== 'undefined'
                          ? {
                            status__icontains: filterOption
                          }
                          : {},
                      all_premission_id: JSON.parse(
                        localStorage.getItem('all_permission_id')
                      ),
                      all_assign_id: JSON.parse(
                        localStorage.getItem('all_assign_id')
                      )
                    },
                    setStudyData
                  )
                }
                setStudyDataPayload({})
                setIsAdvanceSearchSelected(false)
              }}
            >
              {data?.label}
            </Checkbox>
          </div>
        ))}

      </Collapse.Panel>

      {/* ===== Owner added filter list ======  */}

      <Collapse.Panel
        style={{ marginTop: "0.60rem" }}
        header='Other filters'
        key='1'
        className='setting-panel mb-0 mt-3 admin-panel-filter-option-list'
      >
        {filterOptions?.map(data => (
          <div
            key={data?.key}
          >
            <Checkbox
              name={data?.label}
              key={data?.key}
              checked={isFilterChecked === data?.key}
              onClick={() => {
                setIsSystemFilterChecked(null)
                if (data?.key === isFilterChecked) {
                  setIsFilterChecked(null)
                  setStudyDataPayload({})
                } else {
                  setIsFilterChecked(data?.key)
                  setStudyDataPayload({
                    id: data.key,
                    page_number: 1,
                    page_size: 10,
                    deleted_skip: false,
                    all_premission_id: JSON.parse(
                      localStorage.getItem('all_permission_id')
                    ),
                    all_assign_id: JSON.parse(
                      localStorage.getItem('all_assign_id')
                    )
                  })
                  applyMainFilter(
                    {
                      id: data.key,
                      page_number: 1,
                      page_size: 10,
                      deleted_skip: false,
                      all_premission_id: JSON.parse(
                        localStorage.getItem('all_permission_id')
                      ),
                      all_assign_id: JSON.parse(
                        localStorage.getItem('all_assign_id')
                      )
                    },
                    setStudyData
                  )
                }
                setSystemFilterPayload({})
                setIsAdvanceSearchSelected(false)
              }}
            >
              {data?.label}
            </Checkbox>
          </div>
        ))}

        {checkPermissionStatus('Show Filter option') && (
          <>
            <Divider style={{ margin: '10px 0px' }} />
            <div
              onClick={() => setIsAddFilterModalOpen(true)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '500'
              }}
            >
              <AiOutlinePlus /> Add Filter
            </div>
          </>
        )}
      </Collapse.Panel>
    </Collapse>

  )

  // **** Chat notification data handle **** // 

  const [chatNotificationTitle, setChatNotificationTitle] = useState([]) ; 

  const notification_content=(
    <List
      style={{width:"25rem"}}
      itemLayout="horizontal"
      dataSource={chatNotificationTitle}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            className='chat-notification'
            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            title={item.title}
            description={item?.description}
          />
        </List.Item>
      )}
    />
  )

  const SetChatNotificationData = () => {
    const updatedTitles = chatNotificationData.map((element) => ({
      title: `Patient Id - ${element?.Patientid}`, 
      description : element?.message
    }));
    
    setChatNotificationTitle(updatedTitles);
    
  }

  useEffect(() => {
    console.log("Reterive chat notification data ===========>");
    SetChatNotificationData() ; 
  }, [chatNotificationData])

  return (
    <div>

      {/* ==== Institution page ====  */}

      {window.location.pathname === '/institutions' && (

        <div className='iod-setting-div'>

          <Button
            type='primary'
            onClick={() => setIsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Filter
          </Button>

          <Button 
            type='primary' 
            onClick={() => navigate('/institutions-logs')}
            className='header-secondary-option-button'>
            Institution Logs
          </Button>

          <Button
            type='primary'
            onClick={() => navigate('/institutions/add')}
            className='btn-icon-div header-secondary-option-button'
          >
            <PlusOutlined style={{ fontWeight: '500' }} /> Add Institution
          </Button>

        </div>

      )}

      {/* ==== Institution logs page ====  */}

      {window.location.pathname === '/institutions-logs' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => setIsInstitutionLogsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Institution Logs
            Filter
          </Button>
        </div>
      )}

      {/* ==== User page ====  */}

      {window.location.pathname === '/users' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => setIsUserFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Filter
          </Button>

          <Button 
            type='primary' 
            onClick={() => navigate('/users-logs')}
            className='header-secondary-option-button'>
            Users Logs
          </Button>

          <Button
            type='primary'
            onClick={() => navigate('/users/add')}
            className='btn-icon-div header-secondary-option-button'
          >
            <PlusOutlined style={{ fontWeight: '500' }} /> Add Users
          </Button>
        </div>
      )}

      {/* ==== User logs page ====  */}

      {window.location.pathname === '/users-logs' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => setIsUserLogsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> User Logs Filter
          </Button>
        </div>
      )}

      {/* ==== User role list related page ====  */}

      {window.location.pathname === '/users/roles' && (
        <div className='iod-setting-div'>
          {permissionData['Other option permission'] &&
            permissionData['Other option permission'].find(
              data => data.permission === 'Create New UserRole'
            )?.permission_value && (

              <Button
                type='primary'
                onClick={() => setIsRoleModalOpen(true)}
                className='btn-icon-div header-secondary-option-button'
              >
                <PlusOutlined style={{ fontWeight: '500' }} /> Add Role
              </Button>
            )}
          <Button 
            type='primary' 
            onClick={() => navigate('/role-logs')}
            className='header-secondary-option-button'>
            Role Logs
          </Button>
        </div>
      )}

      {/* ==== Role logs page ====  */}

      {window.location.pathname === '/role-logs' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => setIsRoleLogsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Logs Filter
          </Button>
        </div>
      )}

      {/* ==== User email page ====  */}

      {window.location.pathname === '/users/email' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => setIsEmailFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Filter
          </Button>

          {permissionData['Other option permission'] &&
            permissionData['Other option permission'].find(
              data => data.permission === 'Create New Email'
            )?.permission_value && (
              <Button
                type='primary'
                onClick={() => setIsEmailModalOpen(true)}
                className='btn-icon-div header-secondary-option-button'
              >
                <PlusOutlined style={{ fontWeight: '500' }} /> Add Email
              </Button>
            )}
        </div>
      )}

      {/* ==== Study page ====  */}

      {window.location.pathname === '/studies' && (
        <div className='iod-setting-div'>


          {/* view current notifications */}
          <Popover content={notification_content} title="Recent Notifications" placement='bottomLeft'>

          <Badge count={chatNotificationData?.length}>

            <Button
              type='default'
              className=''
            >
              <NotificationOutlined />
            </Button>
          </Badge>
          </Popover>

          {/* Option1 === Delete Study  */}

          <Popconfirm
            title="Delete study"
            description="Are you sure you want to delete this studies ?"
            onConfirm={deleteStudyData}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type='primary'
              className='error-btn-primary'
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Reload page"
            description="Are you sure you want to reload page"
            onConfirm={ReloadOptionHandler}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type='primary'
              className='header-secondary-option-button'
            >
              <ReloadOutlined />
            </Button>
          </Popconfirm>

          <Button
            type='export'
            onClick={() => setIsStudyExportModalOpen(true)}
            className='header-secondary-option-button'
          >
            <ExportOutlined style={{ marginRight: "0.4rem" }} /> Study Export
          </Button>

          <Button
            type='primary'
            onClick={() => QuickAssignStudyModalHandler()}
            className='header-secondary-option-button'
          >
            Assign study
          </Button>

          <Button 
            type='primary' 
            onClick={() => navigate('/study-logs')}
            className='header-secondary-option-button'
            >
            Study logs
          </Button>

          <Button
            type='primary'
            className={`btn-icon-div ${isAdvanceSearchSelected && 'filter-selected'}`}
            onClick={() => setIsAdvancedSearchModalOpen(true)}
          >
            <SearchOutlined style={{ fontWeight: '500' }} />
            Advanced search
          </Button>

          <div style={{ position: 'relative' }}>
            <Popover
              content={content}
              title={null}
              trigger='click'
              style={{ minWidth: '300px' }}
              className='filter-popover'
            >
              <Button
                type='primary'
                className={`btn-icon-div ${(Object.keys(systemFilterPayload)?.length !== 0 ||
                    Object.keys(studyDataPayload)?.length !== 0) &&
                  'filter-selected'
                  }`}
                onClick={() => setIsFilterCollapseOpen(prev => !prev)}
              >
                <FilterOutlined style={{ fontWeight: '500' }} /> Filters
              </Button>
            </Popover>
          </div>

          
        </div>
      )}

      {/* ==== Add template related page ====  */}

      {window.location.pathname === '/reports' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => navigate('/reports/add')}
            className='btn-icon-div header-secondary-option-button'
          >
            <PlusOutlined style={{ fontWeight: '500' }} /> Add Report Template
          </Button>
        </div>
      )}

      {/* ==== Study report submit option page ====  */}

      {window.location.pathname === `/reports/${id}` && (
        <div className='iod-setting-div'>

          <Button
            type='primary'
            onClick={() =>
              setSelectedItem(prev => ({
                isPatientSelected: false,
                isInstitutionSelected: false,
                isImagesSelected: true,
                isOhifViewerSelected: false,
                templateId: prev?.templateId,
                isStudyDescriptionSelected: false
              }))
            }
          >
            Study Images
          </Button>

          <Button
            type='primary'
            onClick={() =>
              setSelectedItem(prev => ({
                isPatientSelected: false,
                isInstitutionSelected: false,
                isImagesSelected: false,
                isOhifViewerSelected: false,

                templateId: prev?.templateId,
                isStudyDescriptionSelected: true
              }))
            }
          >
            Study Description
          </Button>

          <Button
            type='primary'
            onClick={() =>
              setSelectedItem(prev => ({
                isPatientSelected: true,
                isInstitutionSelected: false,
                isImagesSelected: false,
                isOhifViewerSelected: false,

                templateId: prev?.templateId,
                isStudyDescriptionSelected: false
              }))
            }
          >
            Patient Information
          </Button>

          <Button
            type='primary'
            onClick={() =>
              setSelectedItem(prev => ({
                isPatientSelected: false,
                isInstitutionSelected: true,
                isImagesSelected: false,
                isOhifViewerSelected: false,

                templateId: prev?.templateId,
                isStudyDescriptionSelected: false
              }))
            }
          >
            Institution Information
          </Button>

          <Button
            type='primary'
            onClick={() =>
              setSelectedItem(prev => ({
                isPatientSelected: false,
                isInstitutionSelected: false,
                isImagesSelected: false,
                isOhifViewerSelected: true,
                templateId: prev?.templateId,
                isStudyDescriptionSelected: false
              }))
            }
          >
            OHIF Viewer
          </Button>

          <Select
            style={{ width: "12rem" }}
            className='template-selection-option-division'
            placeholder='choose template'
            options={templateOptions}
            onChange={e =>
              setSelectedItem(prev => ({
                isPatientSelected: prev?.isPatientSelected,
                isInstitutionSelected: prev?.isInstitutionSelected,
                isImagesSelected: prev?.isImagesSelected,
                templateId: e,
                isStudyDescriptionSelected: prev?.isStudyDescriptionSelected
              }))
            }
          />
        </div>
      )}

      {/* ==== Billing related page =====  */}

      {window.location.pathname === '/billing' && (
        <div className='iod-setting-div'>
          {permissionData['Other option permission'] &&
            permissionData['Other option permission'].find(
              data =>
                data.permission === 'Show Billing - export to excel option'
            )?.permission_value && (
              <Button
                type='primary'
                className='btn-icon-div header-secondary-option-button'
                onClick={() => handleExport(billingFilterData)}
              >
                <SiMicrosoftexcel style={{ fontWeight: '500' }} /> Export Excel
              </Button>
            )}

          <Button
            type='primary'
            className='btn-icon-div header-secondary-option-button'
            onClick={() => setIsBillingFilterModalOpen(true)}
          >
            <SearchOutlined /> Search Billing
          </Button>

          <Button
            type='primary'
            className='btn-icon-div header-secondary-option-button'
            onClick={() => handleDownloadPDF(billingFilterData)}
          >
            <DownloadOutlined /> Download Bill
          </Button>
        </div>
      )}

      {/* ===== Support option page ====  */}

      {window.location.pathname === '/support' && (

        <>
          <div className='iod-setting-div'>
            <Button
              type='primary'
              onClick={() => { console.log("Run this function"); setEmailSupportOption(true); setPhoneSupportOption(false); }}
              className='btn-icon-div header-secondary-option-button'
            >
              Email support details
            </Button>

            <Button
              type='primary'
              onClick={() => { setPhoneSupportOption(true); setEmailSupportOption(false); }}
              className='btn-icon-div header-secondary-option-button'
            >
              Phonesupport details
            </Button>

            <Button
              type='primary'
              onClick={() => setIsSupportModalOpen(true)}
              className='btn-icon-div header-secondary-option-button'
            >
              <PlusOutlined style={{ fontWeight: '500' }} /> Add New Support
            </Button>
          </div>

        </>
      )}
      
      <StudyFilterModal
        isFilterModalOpen={isAddFilterModalOpen}
        setIsFilterModalOpen={setIsAddFilterModalOpen}
        retrieveFilterOptions={retrieveFilterOptions}
      />

    </div>
  )
}

export default HeaderButton
