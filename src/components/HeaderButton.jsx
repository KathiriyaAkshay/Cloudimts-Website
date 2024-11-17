import {
  Button,
  Select,
  Tag,
  Upload
} from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRoleContext } from '../hooks/usersRolesContext'
import { UserEmailContext } from '../hooks/userEmailContext'
import { filterDataContext } from '../hooks/filterDataContext'
import { ReportDataContext } from '../hooks/reportDataContext'
import { UserPermissionContext } from '../hooks/userPermissionContext'
import { SiMicrosoftexcel } from 'react-icons/si'
import { FaFilePdf } from "react-icons/fa";
import mammoth from 'mammoth'
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined, 
  EyeOutlined, 
  HistoryOutlined
} from '@ant-design/icons'
import { handleExport, handlePdfExport } from '../helpers/billingTemplate'
import { BillingDataContext } from '../hooks/billingDataContext'
import { FilterSelectedContext } from '../hooks/filterSelectedContext'
import StudyFilterModal from './StudyFilterModal'
import {
  retrieveSystemFilters
} from '../helpers/studyDataFilter'
import APIHandler from '../apis/apiHandler'
import OHIF from "../assets/images/menu.png" ; 
import {EyeInvisibleOutlined } from '@ant-design/icons'; 
import Draggable from 'react-draggable'
import WeasisViewer from "../assets/images/Weasis.png" ; 

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
    genderOption, 
    patientInforamtionDrawer, 
    setPatientInformationDrawer
  } = useContext(filterDataContext);


  const { setSelectedItem, setDocFileData, selectedItem } = useContext(ReportDataContext)
  const { billingFilterData, setBillingFilterData } =
    useContext(BillingDataContext)
  const [templateOptions, setTemplateOptions] = useState([])
  const [isAddFilterModalOpen, setIsAddFilterModalOpen] = useState(false)

  const [systemFilters, setSystemsFilters] = useState([])


  // **** Reterive templates list for Study report page **** //
  const retrieveTemplateOptions = async () => {

    let report_modality = localStorage.getItem("report-modality") ;
    let requestPayload = {
      "page_number": 1,
      "page_limit": 200,
      "modality": report_modality,
      "institution": templateInstitutionOption,
      "radiologist": parseInt(localStorage.getItem("userID"))
    };

    if (genderOption !== null && genderOption !== undefined){
      requestPayload['gender'] = genderOption ; 
    }
    let responseData = await APIHandler("POST", requestPayload, "report/v1/submitReportlist")

    if (responseData === false) {
    } else if (responseData?.status === true) {

      const resData = responseData?.data.map((data) => ({
        label: data?.name,
        value: data?.id
      }))

      setTemplateOptions([...resData]);

    } else {
    }

  }

  useEffect(() => {

    if (window.location.pathname === `/reports/${id}` && templateOption !== null) {
      // retrieveTemplateOptions();
    }

  }, [window.location.pathname, templateOption, genderOption])

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

  // Function to handle file selection and conversion
  const handleFileChange = (event) => {
    const file = event.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = reader.result;
        const text = await mammoth.convertToHtml({ arrayBuffer });

        const data = `
          <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Centered Content with Table Border</title>
  <style>
      body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width:100%;
      }
      .container {
          text-align: center;
          border: 2px solid #000;
          padding: 20px;
      }
      table {
          border-collapse: collapse;
          margin: auto;
      }
      table, th, td {
          padding:5px !important;
          border: 1px solid #000;
      }
  </style>
  </head>
  <body>
  <div class="container">`+ text.value + `
  </div>
  </body>
  </html>
   
  `
        setDocFileData(text.value);

      };
      reader.readAsArrayBuffer(file);
    }
  };

  const props = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    accept:".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    showUploadList: false,
    onChange(info) {
      handleFileChange(info)
    },
  };

  // OHIF viewer option handler 
  const OHIFViewerOptionHandler = (option) => {
    let studyId = localStorage.getItem("studyUIDValue"); 
    
    if (option == "volume"){
      window.open(`https://viewer.cloudimts.com/ohif/viewer?hangingprotocolId=mprAnd3DVolumeViewport&url=../studies/${studyId}//ohif-dicom-json`, "_blank") ; 
    } else if (option == "total"){
      window.open(`https://viewer.cloudimts.com/ohif/tmtv?url=../studies/${studyId}//ohif-dicom-json`, "_blank") ; 
    } else if (option == "kitware"){
      window.open(`https://viewer.cloudimts.com/volview/index.html?names=[archive.zip]&urls=[../studies/${studyId}/archive]`, "_blank") ; 

    }
  }


  // Report option div related toggle handler 
  const [reportOptionToggle, setReportOptionToggle] = useState(false); 
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === 't' && event.ctrlKey) {
        event.preventDefault(); // Prevent default action for Ctrl + T
        setReportOptionToggle((prev) => !prev) ; 
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

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
        <Draggable>
          <div className='iod-setting-div report-option-div'>

              <Button
              type='primary'
              icon={reportOptionToggle ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => {setReportOptionToggle((prev) => !prev)}}
            />

            {!reportOptionToggle && (
              <>
                {/* <Button
                  type='primary'
                  className='ohif-basic-viewer-option'
                  onClick={() =>
                    {setSelectedItem(prev => ({
                      isPatientSelected: false,
                      isInstitutionSelected: false,
                      isImagesSelected: false,
                      isOhifViewerSelected: true,
                      templateId: prev?.templateId,
                      isStudyDescriptionSelected: false
                    })) ; }
                  }
                > 

                  <div className='viewer-option-layout'>
                    <img className='ohif-option-image' src={OHIF} alt="" srcset="" />
                    <span className='viewer-option-text'>v1 | Basic</span>
                  </div>
                </Button>*/}

                <Button onClick={() =>
                    setSelectedItem(prev => ({
                      isPatientSelected: false,
                      isInstitutionSelected: false,
                      isImagesSelected: false,
                      isOhifViewerSelected: false,
                      templateId: prev?.templateId,
                      isStudyDescriptionSelected: false, 
                      showPreview: true
                    }))
                  }>
                  Preview
                </Button>


                <Button
                  type='primary'
                  className='ohif-basic-viewer-option'
                  onClick={() =>
                    {setSelectedItem(prev => ({
                      isPatientSelected: false,
                      isInstitutionSelected: false,
                      isImagesSelected: false,
                      isOhifViewerSelected: true,
                      templateId: prev?.templateId,
                      isStudyDescriptionSelected: false
                    })) ; }
                  }
                > 

                  <div className='viewer-option-layout'>
                    <img className='ohif-option-image' src={OHIF} alt="" srcset="" />
                    {/* <span className='viewer-option-text'>v3 | Total Metabolic</span> */}
                  </div>
                </Button>

                <Button
                  type='primary'
                  className='kiware-viewer-option'
                  onClick={() => {OHIFViewerOptionHandler("kitware")}}
                > 

                  <div className='viewer-option-layout'>
                    <img className='ohif-option-image' src={WeasisViewer} alt="" srcset="" />
                    {/* <span className='viewer-option-text'>Kitware's VolView</span> */}
                  </div>
                </Button>

                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Insert Doc File</Button>
                </Upload>

                <Button 
                  type = {selectedItem?.patientInfo?"primary":"default"}
                  onClick={() => {
                  setPatientInformationDrawer(true) ; 
                  setSelectedItem(prev => ({
                    isPatientSelected: false,
                    isInstitutionSelected: false,
                    isImagesSelected: false,
                    isOhifViewerSelected: false,
                    templateId: prev?.templateId,
                    isStudyDescriptionSelected: false, 
                    patientInfo: true
                  }))
                }}>
                  Patient data
                </Button>

                <Button
                  type={selectedItem?.isImagesSelected?"primary":"default"}
                  onClick={() =>
                    setSelectedItem(prev => ({
                      isPatientSelected: false,
                      isInstitutionSelected: false,
                      isImagesSelected: !prev?.isImagesSelected,
                      isOhifViewerSelected: false,
                      templateId: prev?.templateId,
                      isStudyDescriptionSelected: false
                    }))
                  }
                >
                  Study Images
                </Button>

                {/* <Button
                  icon = {<PlusOutlined/>}
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
                </Button> */}

              </>
            )}

          </div>
        </Draggable>
      )}

      {/* ==== Billing related page =====  */}

      {window.location.pathname === '/billing' && (
        <div className='iod-setting-div'>

          {billingFilterData?.length > 0 ? <>
            <Button type="primary" onClick={() => setBillingInformationModal(true)}
              style={{ backgroundColor: "#f5f5f5", color: "#212121 !important" }}>
              <EyeOutlined/> &nbsp; Billing info
            </Button>
          </> : <></>}

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
              <>
                <Button
                  type='primary'
                  className='btn-icon-div header-secondary-option-button'
                  onClick={() => handleExport(billingFilterData)}
                >
                  <SiMicrosoftexcel style={{ fontWeight: '500' }} /> Export Excel
                </Button>
                <Button
                  type='primary'
                  className='btn-icon-div header-secondary-option-button'
                  onClick={() => handlePdfExport(billingFilterData)}
                >
                  <FaFilePdf style={{ fontWeight: '500' }} /> Export PDF
                </Button>
              </>

            )}


          {/* <Button
            type='primary'
            className='btn-icon-div header-secondary-option-button'
            onClick={() => handleDownloadPDF(billingFilterData)}
          >
            <DownloadOutlined /> Download Bill
          </Button> */}
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
