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
  List,
  Empty
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
  SearchOutlined
} from '@ant-design/icons'
import { handleDownloadPDF, handleExport } from '../helpers/billingTemplate'
import { BillingDataContext } from '../hooks/billingDataContext'
import NotificationMessage from './NotificationMessage'
import { FilterSelectedContext } from '../hooks/filterSelectedContext'
import StudyFilterModal from './StudyFilterModal'
import {
  retrieveSystemFilters
} from '../helpers/studyDataFilter'
import APIHandler from '../apis/apiHandler'

const HeaderButton = ({
  id,
  retrieveFilterOptions
}) => {
  const navigate = useNavigate()

  const { permissionData } = useContext(UserPermissionContext)
  const { setIsRoleModalOpen } = useContext(UserRoleContext)
  const {
    isFilterSelected
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
    templateOption,
    setEmailSupportOption,
    setPhoneSupportOption, 
    templateInstitutionOption, 
    setBillingInformationModal,
  } = useContext(filterDataContext) ; 
  

  const { setSelectedItem } = useContext(ReportDataContext)
  const { billingFilterData, setBillingFilterData } =
    useContext(BillingDataContext)
  const [templateOptions, setTemplateOptions] = useState([])
  const [isAddFilterModalOpen, setIsAddFilterModalOpen] = useState(false)

  const [systemFilters, setSystemsFilters] = useState([])


  // **** Reterive templates list for Study report page **** //
  const retrieveTemplateOptions = async () => {

    let requestPayload = {
      "page_number": 1,
      "page_limit": 200,
      "modality": templateOption, 
      "institution": templateInstitutionOption, 
      "radiologist": parseInt(localStorage.getItem("userID"))
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

          {billingFilterData?.length > 0?<>
            <Button type="primary" onClick={() => setBillingInformationModal(true)}
              style={{ backgroundColor: "#f5f5f5", color: "#212121 !important" }}>
              View Billing information
            </Button>
          </>:<></>}

          <Button
            type='primary'
            className='btn-icon-div'
            onClick={() => setIsBillingFilterModalOpen(true)}
          >
            <SearchOutlined /> Search Billing
          </Button>
          
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
              onClick={() => { setEmailSupportOption(true); setPhoneSupportOption(false); }}
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
