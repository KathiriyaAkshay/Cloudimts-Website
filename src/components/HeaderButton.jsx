import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Menu,
  Popover,
  Select, 
  Popconfirm
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
  ExportOutlined
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
import OHIFViwer from "../assets/images/menu.png"
import APIHandler from '../apis/apiHandler'

const HeaderButton = ({
  setIsModalOpen,
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
    setIsAdvanceSearchSelected, 
    isStudyQuickFilterModalOpen, 
    setIsStudyQuickFilterModalOpen
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
    setPhoneSupportOption
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

  const retrieveTemplateOptions = async () => {

    let requestPayload = {
      "page_number": 1,
      "page_limit": 200, 
      "modality": templateOption
    } ; 

    let responseData = await APIHandler("POST", requestPayload, "report/v1/submitReportlist")

    if (responseData === false){
      NotificationMessage(
        "warning", 
        "Network request failed"
      )
    
    } else if (responseData?.status === true){

      const resData = responseData?.data.map((data) => ({
        label: data?.name, 
        value: data?.id
      }))

      setTemplateOptions([...resData]) ; 

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

  useEffect(() => {
    if (window.location.pathname === '/studies') {
      fetchSystemFilter()
    }
  }, [window.location.pathname])

  const fetchSystemFilter = async () => {

    const response = await retrieveSystemFilters()
    
    const modifiedOptions = response.map(data => ({
      label: data.name,
      value: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      key: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      details: data.filter_data
    }))
    
    setSystemsFilters(modifiedOptions) ; 
  }



  const deleteStudyData = async () => {

    if (studyIdArray.length > 0) {
      deleteStudy({ id: studyIdArray })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', "Study delete successfully") ;
            setStudyIdArray([]) ; 
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

  const checkPermissionStatus = name => {
    const permission = permissionData['Menu Permission']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  } 

  const ReloadOptionHandler = () => {
    window.location.reload() ; 
  }

  const QuickAssignStudyModalHandler = () => {
    if (studyIdArray.length === 0){
      NotificationMessage("warning", "Please, Select study for assign") ; 
    } else{
      setIsQuickAssignStudyModalOpen(true) ; 
    }
  }


  const OpenOHIFViwerOptionHandler = () => {
    studyData.map((element) => {
      if (element.id = studyIdArray[0]){

        let url = `https://viewer.cloudimts.com/viewer/${element?.study?.study_uid}` ; 
        window.open(url, "_blank") ; 
      }
    })
  }

  // ===== Filter list ===== // 

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
        style={{marginTop: "0.60rem"}}
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

  return (
    <div>
      {window.location.pathname === '/institutions' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => setIsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Filter
          </Button>
          <Button type='primary' onClick={() => navigate('/institutions-logs')}>
            Institution Logs
          </Button>
          <Button
            type='primary'
            onClick={() => navigate('/institutions/add')}
            className='btn-icon-div'
          >
            <PlusOutlined style={{ fontWeight: '500' }} /> Add Institution
          </Button>
        </div>
      )}
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
      {window.location.pathname === '/users' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => setIsUserFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Filter
          </Button>
          <Button type='primary' onClick={() => navigate('/users-logs')}>
            Users Logs
          </Button>
          <Button
            type='primary'
            onClick={() => navigate('/users/add')}
            className='btn-icon-div'
          >
            <PlusOutlined style={{ fontWeight: '500' }} /> Add Users
          </Button>
        </div>
      )}
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
      {window.location.pathname === '/users/roles' && (
        <div className='iod-setting-div'>
          {permissionData['Other option permission'] &&
            permissionData['Other option permission'].find(
              data => data.permission === 'Create New UserRole'
            )?.permission_value && (
              <Button
                type='primary'
                onClick={() => setIsRoleModalOpen(true)}
                className='btn-icon-div'
              >
                <PlusOutlined style={{ fontWeight: '500' }} /> Add Role
              </Button>
            )}
          <Button type='primary' onClick={() => navigate('/role-logs')}>
            Role Logs
          </Button>
        </div>
      )}
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
                className='btn-icon-div'
              >
                <PlusOutlined style={{ fontWeight: '500' }} /> Add Email
              </Button>
            )}
        </div>
      )}
      
      {/* ====== Study page ======  */}

      {window.location.pathname === '/studies' && (
        <div className='iod-setting-div'>

          {/* Option1 === Delete Study  */}

          <Popconfirm
            title = "Delete study"
            description = "Are you sure you want to delete this studies ?"
            onConfirm={deleteStudyData}
            okText = "Yes"
            cancelText = "No"
          >
            <Button
              type='primary'
              className='error-btn-primary'
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>


          {/* Option2 === Reload Study  */}

          <Popconfirm
            title = "Reload page"
            description = "Are you sure you want to reload page" 
            onConfirm={ReloadOptionHandler}
            okText = "Yes"
            cancelText = "No"
          >
            <Button
              type='primary'
            >
              <ReloadOutlined />
            </Button>
          </Popconfirm>

          {/* Option3 ==== OHIF Viewer  */}

          {/* {studyIdArray.length === 1 && (
            <Button onClick={OpenOHIFViwerOptionHandler}>
              <img src={OHIFViwer} className='ohif-viwer-option-icon' style={{ marginRight: 8 }} />
              OHIF 
            </Button>

          )} */}

          {/* Option4 ==== Study Export option  */}

          <Button
            type='export'
            onClick={() => setIsStudyExportModalOpen(true)}
            style={{
              
            }}
          >
            <ExportOutlined style={{marginRight:"0.4rem"}}/> Study Export
          </Button>

          {/* Option5 ==== Assign Study option  */}
          
          <Button
            type='primary'
            onClick={() => QuickAssignStudyModalHandler()}
          >
            Assign study
          </Button>

          {/* Option6 ==== Advance search filter option  */}
        
          <Button
            type='primary'
            className={`btn-icon-div ${
              isAdvanceSearchSelected && 'filter-selected'
            }`}
            onClick={() => setIsAdvancedSearchModalOpen(true)}
          >
            <SearchOutlined style={{ fontWeight: '500' }} />
            Advance search
          </Button>

          {/* Option7 ==== Quick Search filter option  */}

          <Button
            type='primary'
            onClick={() => setIsStudyQuickFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && 'filter-selected'}`}
          >
            <FilterOutlined style={{ fontWeight: '500' }} /> Quick filter
          </Button>

          {/* Option8 ==== Normal filter option  */}

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
                className={`btn-icon-div ${
                  (Object.keys(systemFilterPayload)?.length !== 0 ||
                    Object.keys(studyDataPayload)?.length !== 0) &&
                  'filter-selected'
                }`}
                onClick={() => setIsFilterCollapseOpen(prev => !prev)}
              >
                <FilterOutlined style={{ fontWeight: '500' }} /> Filters
              </Button>
            </Popover>
          </div>

          {/* Option9 ==== Study logs information  */}

          <Button type='primary' onClick={() => navigate('/study-logs')}>
            Study logs
          </Button>
        </div>
      )}

      {window.location.pathname === '/reports' && (
        <div className='iod-setting-div'>
          <Button
            type='primary'
            onClick={() => navigate('/reports/add')}
            className='btn-icon-div'
          >
            <PlusOutlined style={{ fontWeight: '500' }} /> Add Report Template
          </Button>
        </div>
      )}
      {window.location.pathname === `/reports/${id}` && (
        <div className='iod-setting-div'>

          <Button
            type='primary'
            onClick={() =>
              setSelectedItem(prev => ({
                isPatientSelected: false,
                isInstitutionSelected: false,
                isImagesSelected: true,
                isOhifViewerSelected:false,
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
                isOhifViewerSelected:false,

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
                isOhifViewerSelected:false,

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
                isOhifViewerSelected:false,

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
                isOhifViewerSelected:true,
                templateId: prev?.templateId,
                isStudyDescriptionSelected: false
              }))
            }
          >
            OHIF Viewer
          </Button>

          <Select
            style={{width: "12rem"}}
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

      {window.location.pathname === '/billing' && (
        <div className='iod-setting-div'>
          {permissionData['Other option permission'] &&
            permissionData['Other option permission'].find(
              data =>
                data.permission === 'Show Billing - export to excel option'
            )?.permission_value && (
              <Button
                type='primary'
                className='btn-icon-div'
                onClick={() => handleExport(billingFilterData)}
              >
                <SiMicrosoftexcel style={{ fontWeight: '500' }} /> Export Excel
              </Button>
            )}

          <Button
            type='primary'
            className='btn-icon-div'
            onClick={() => setIsBillingFilterModalOpen(true)}
          >
            <SearchOutlined /> Search Billing
          </Button>

          <Button
            type='primary'
            className='btn-icon-div'
            onClick={() => handleDownloadPDF(billingFilterData)}
          >
            <DownloadOutlined /> Download Bill
          </Button>
        </div>
      )}

      {window.location.pathname === '/support' && (
        
        <>
          <div className='iod-setting-div'>
            <Button
              type='primary'
              onClick={() => {console.log("Run this function"); setEmailSupportOption(true); setPhoneSupportOption(false) ; }}
              className='btn-icon-div'
            >
              Email support details
            </Button>

            <Button
              type='primary'
              onClick={() => {setPhoneSupportOption(true) ; setEmailSupportOption(false) ; }}
              className='btn-icon-div'
            >
              Phonesupport details
            </Button>

            <Button
              type='primary'
              onClick={() => setIsSupportModalOpen(true)}
              className='btn-icon-div'
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
