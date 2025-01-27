import {
  Button,
  Select,
  Tag,
  Tooltip,
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
  PictureOutlined, 
} from '@ant-design/icons'
import { handleExport, handlePdfExport } from '../helpers/billingTemplate'
import { BillingDataContext } from '../hooks/billingDataContext'
import { FilterSelectedContext } from '../hooks/filterSelectedContext'
import StudyFilterModal from './StudyFilterModal'
import {
  retrieveSystemFilters
} from '../helpers/studyDataFilter'
import OHIF from "../assets/images/menu.png" ; 
import WeasisViewer from "../assets/images/Weasis.png" ; 
import API from '../apis/getApi'

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
    setBillingInformationModal,
    setPatientInformationDrawer,
    isManualStudy
  } = useContext(filterDataContext);


  const { setSelectedItem, setDocFileData, selectedItem } = useContext(ReportDataContext)
  const { billingFilterData, setBillingFilterData } =
    useContext(BillingDataContext)
  const [isAddFilterModalOpen, setIsAddFilterModalOpen] = useState(false)

  const [systemFilters, setSystemsFilters] = useState([])

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
  const handleFileChange = async (event) => {
    const file = event.file.originFileObj;
    if (file) {
      if (String(file?.name).endsWith(".doc")){
        // Flag to prevent multiple calls
        if (file.isProcessing) return; // Check if this file is already being processed
        file.isProcessing = true;

        try {
          let formData = new FormData() ; 
          formData.append("file", file) ; 

          let token = localStorage.getItem("token") ;
          let response = await API.post("/image/v1/doc_to_docx", 
            formData, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
              }
            }
          ); 
          const docxFileUrl = response.data?.message?.url; // URL to the converted DOCX file
          const docxResponse = await fetch(docxFileUrl);
          const docxBlob = await docxResponse.blob();

          // // Pass the DOCX file content to mammoth for conversion to HTML
          const arrayBuffer = await docxBlob.arrayBuffer();
          const { value } = await mammoth.convertToHtml({ arrayBuffer });

          let tempValue = String(value).replace("Evaluation Warning: The document was created with Spire.Doc for Python.", "") ; 
          setDocFileData(tempValue) ; 

        } catch (error) {
          
        }
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = reader.result;
          const text = await mammoth.convertToHtml({ arrayBuffer });
          setDocFileData(text.value);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const props = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    onChange(info) {
      handleFileChange(info);
    },
    beforeUpload: (file) => {
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isDoc = file.type === 'application/msword';
      
      if (!isDocx && !isDoc) {
        message.error(`${file.name} is not a valid file type. Only .doc or .docx files are allowed.`);
        return Upload.LIST_IGNORE; // Reject the file
      }
      return true; // Accept the file
    },
  };

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
        <div className='iod-setting-div report-option-div'>

            {/* <Button
            type='primary'
            icon={reportOptionToggle ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => {setReportOptionToggle((prev) => !prev)}}
          /> */}

          {!reportOptionToggle && (
            <>

              {isManualStudy?<>
                <Tooltip>
                  <Button
                    icon = {<PictureOutlined/>}
                    onClick={() =>
                      {setSelectedItem(prev => ({
                        isPatientSelected: false,
                        isInstitutionSelected: false,
                        isImagesSelected: false,
                        isOhifViewerSelected: false,
                        templateId: false,
                        isStudyDescriptionSelected: false, 
                        isManualImageOpen: !prev?.isManualImageOpen
                      })) ; }
                    }
                  />
                </Tooltip>
              </>:<>
                <Tooltip title = "OHIF">
                  <Button
                    className='ohif-basic-viewer-option'
                    style={{
                      backgroundColor: selectedItem?.isOhifViewerSelected?"#FFA500 !important;":"#FFF"
                    }}
                    onClick={() =>
                      {setSelectedItem(prev => ({
                        isPatientSelected: false,
                        isInstitutionSelected: false,
                        isImagesSelected: false,
                        isOhifViewerSelected: !prev?.isOhifViewerSelected,
                        templateId: prev?.templateId,
                        isStudyDescriptionSelected: false
                      })) ; }
                    }
                  > 

                    <div className='viewer-option-layout'>
                      <img className='ohif-option-image' src={OHIF} alt="" srcset="" />
                    </div>
                  </Button>
                </Tooltip>
                  
                <Tooltip title = "Weasis">
                  <Button
                    type='primary'
                    className='kiware-viewer-option'
                  > 
                    <div className='viewer-option-layout'>
                      <img 
                        className='ohif-option-image' 
                        src={WeasisViewer} 
                        alt="" 
                        srcset="" 
                        onClick={() => {
                          setSelectedItem(prev => ({
                            isPatientSelected: false,
                            isInstitutionSelected: false,
                            isImagesSelected: false,
                            isOhifViewerSelected: false,
                            templateId: prev?.templateId,
                            isStudyDescriptionSelected: false, 
                            patientInfo: false,
                            weasisOption: true
                          }))
                        }}
                      />
                    </div>
                  </Button>
                </Tooltip>
              </>}
                
              {/* Upload doc file related option button  */}
              <Upload {...props}>
                <Button 
                  icon={<UploadOutlined />}
                >Insert Doc File</Button>
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

              {/* <Button
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
              </Button> */}

              <Button type='primary' onClick={() =>
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
            {/* <Button
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
            </Button> */}

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
