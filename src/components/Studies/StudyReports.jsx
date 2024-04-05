import {
  Button,
  List,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  Popconfirm
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  getStudyData,
  viewReported
} from '../../apis/studiesApi'
import FileReport from './FileReport'
import TableWithFilter from '../TableWithFilter'
import { BsEyeFill } from 'react-icons/bs'
import {
  DownloadOutlined,
  MailOutlined,
  WhatsAppOutlined,
  CloseCircleFilled
} from '@ant-design/icons'
import ImageCarousel from './ImageCarousel'
import { useNavigate } from 'react-router-dom'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import APIHandler from '../../apis/apiHandler';
import NotificationMessage from "../NotificationMessage";
import { convertToDDMMYYYY } from "../../helpers/utils";

const StudyReports = ({
  isReportModalOpen,
  setIsReportModalOpen,
  studyID,
  setStudyID,
  setStudyStatus,
  studyStatusHandler,
  pageNumberHandler,
  isEmailShareModalOpen,
  isWhatsappShareModelOpen,
  setEmailReportId,
  patientId,
  patientName,
  studyUIDInformation,
  referenceId
}) => {

  const navigate = useNavigate();

  const { permissionData } = useContext(UserPermissionContext)

  const [modalData, setModalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFileReportModalOpen, setIsFileReportModalOpen] = useState(false)
  const [tableData, setTableData] = useState([])
  const [studyImages, setStudyImages] = useState([])
  const [show, setShow] = useState(false)
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false)

  const [normalReportImages, setNormalReportImages] = useState([])
  const [normalReportModalData, setNormalReportModalData] = useState({})

  // ** Permission handler ** //
  const checkPermissionStatus = name => {
    const permission = permissionData['Studies permission']?.find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  // **** Reterive study data **** // 
  const retrieveStudyData = () => {
    setIsLoading(true)
    getStudyData({ id: studyID })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data
          const modifiedData = [
            {
              name: "Patient id",
              value: resData?.Patient_id
            },
            {
              name: "Patient Name",
              value: resData?.Patient_name
            },

            {
              name: "Assign time",
              value: resData?.study_assign_time
            },

            {
              name: "Assign Radiologist",
              value: resData?.study_assign_username
            },
            {
              name: 'Accession Number',
              value: resData?.Accession_number
            },
            {
              name: 'Modality',
              value: resData?.Modality
            },
            {
              name: 'Gender',
              value: resData?.Gender
            },
            {
              name: 'Date of birth',
              value: resData?.DOB
            },
            {
              name: 'Study Description',
              value: resData?.Study_description
            },
            {
              name: 'urgent_case',
              value: resData?.assigned_study_data
            },
            {
              name: "Study history",
              value: resData?.Patient_comments
            },
          ]
          setModalData(modifiedData)
          setTableData(res?.data?.report)
          setStudyImages(
            res?.data?.data?.assigned_study_data?.study_data?.images
          )
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
    setIsLoading(false)
  }

  useEffect(() => {
    if (studyID && isReportModalOpen) {
      retrieveStudyData()
    }
  }, [studyID])

  // **** Download report in pdf formate option handler **** // 
  function downloadPDF(pdfUrl, pdfName) {
    var pdfUrl = pdfUrl;

    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('download', pdfName);
    link.setAttribute('href', pdfUrl);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // **** Update study status to ClosedStudy handler **** // 
  const downloadReport = async (reportId) => {

    let requestPayload = { id: studyID };

    let responseData = await APIHandler('POST', requestPayload, 'studies/v1/complete-study');

    if (responseData === false) {
      NotificationMessage("warning", "Network request failed");

    } else if (responseData['status'] === true) {

      let responseData = await APIHandler("POST", { id: reportId }, "studies/v1/report-download");

      if (responseData === false) {

        NotificationMessage(
          "warning",
          "Network request failed"
        );

      } else if (responseData?.status) {

        let report_download_url = responseData?.message;
        let report_patient_name = patientName.replace(/ /g, "-");

        let updated_report_name = `${patientId}-${report_patient_name}-report.pdf`;

        downloadPDF(report_download_url, updated_report_name);

      } else {

        NotificationMessage(
          "warning",
          "Network request failed",
          responseData?.message
        )
      }

    } else {

      NotificationMessage("warning", "Network request failed", responseData['message']);
    }
  }

  // **** Update study status to ViewReport **** // 
  const handleStudyStatus = async () => {
    await viewReported({ id: studyID })
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
      .catch(err =>
        NotificationMessage(
          'warning',
          'Network request failed',
          err.response.data.message
        )
      )
  }

  // **** Email share option handler *** // 
  const EmailShareModalOpen = id => {
    setEmailReportId(id)
    isEmailShareModalOpen(true)
  }

  // *** OHIF viewer handler **** // 
  const OHIFViewerHandler = () => {

    let url = `https://viewer.cloudimts.com/ohif/viewer?url=../studies/${studyUIDInformation}/ohif-dicom-json`;
    window.open(url, "_blank");
  }

  // **** Weasis viewer handler **** // 
  const WeasisViewerHandler = () => {

    const originalString = '$dicom:rs --url "https://viewer.cloudimts.com/orthanc" -r "patientID=5Yp0E"';
    let encodedString = encodeURIComponent(originalString);
    encodedString = "weasis://" + encodedString;
    window.open(encodedString, "_blank");
  }

  const columns = [
    {
      title: 'Report Time',
      dataIndex: 'reporting_time',
      render: (text, record) => convertToDDMMYYYY(record?.reporting_time)
    },

    {
      title: 'Report By',
      dataIndex: 'report_by',
      render: (text, record) => record?.report_by?.username
    },

    {
      title: 'Study Description',
      dataIndex: 'study_description'
    },

    {
      title: 'Report Type',
      dataIndex: 'report_type'
    },


    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '20%',
      render: (text, record) => (
        <Space style={{ display: 'flex', justifyContent: 'space-evenly' }}>

          {/* ===== View report option ======   */}

          <Tooltip title={'View'}>
            <BsEyeFill
              className='action-icon'
              onClick={async () => {
                await handleStudyStatus()
                record.report_type === 'Advanced report' &&
                  navigate(`/reports/${record.id}/view`)
                if (record.report_type === 'Normal report') {
                  setIsViewReportModalOpen(true)
                  setNormalReportImages(
                    record?.normal_report_data?.report_attach_data
                  )
                  setNormalReportModalData(record)
                }
              }}
            />
          </Tooltip>

          {/* ==== Download report option =====  */}

          {record.report_type === 'Advanced report' && (

            <Tooltip title={'Download'}>
              <DownloadOutlined
                className='action-icon'
                onClick={() => downloadReport(record.id)}
              />
            </Tooltip>
          )}

          {/* ===== Email share option ====== */}

          {record.report_type === 'Advanced report' && (
            <Tooltip title={'Email'}>
              <MailOutlined
                className='action-icon'
                onClick={() => EmailShareModalOpen(record.id)}
              />
            </Tooltip>
          )}

          {/* ==== Whatsapp share option ====  */}

          {record.report_type === 'Advanced report' && (
            <Tooltip title={'Whatsapp'}>
              <WhatsAppOutlined className='action-icon'
                onClick={() => isWhatsappShareModelOpen(true)}
              />
            </Tooltip>
          )}


        </Space>
      )
    }
  ]

  return (
    <>
      <Modal
        className='Study-report-modal'
        title='Study Reports'
        open={isReportModalOpen}
        onOk={() => {
          setStudyID(null)
          setIsReportModalOpen(false)
        }}
        onCancel={() => {
          setStudyID(null)
          setStudyStatus('')
          setIsReportModalOpen(false)
        }}
        width={1300}
        centered
        footer={null}
      >
        <Spin spinning={isLoading}>
          
          <div className='Assign-study-reports-option-input-layout'>

            <div className='Report-modal-all-option-div'>

              {/* ==== OHIF viewer option ====  */}

              <Button key='back' className='Report-modal-option-button'
                onClick={OHIFViewerHandler}>
                OHIF Viewer
              </Button>

              {/* ==== Weasis Viewer option =====  */}

              <Button key='back' className='Report-modal-option-button'
                onClick={WeasisViewerHandler}>
                Weasis viewer
              </Button>

              {checkPermissionStatus('Report study') && (
                <Button
                  key='submit'
                  type='primary'
                  className='secondary-btn Report-modal-option-button'
                  onClick={async () => {
                    await studyStatusHandler()
                    setIsFileReportModalOpen(true)
                  }}
                >
                  Simplified Report
                </Button>
              )}

              {checkPermissionStatus('Report study') && (
                <Button
                  key='link'
                  type='primary'
                  className='secondary-btn Report-modal-option-button'
                  onClick={async () => {
                    await studyStatusHandler()
                    pageNumberHandler()
                    navigate(`/reports/${studyID}`)
                  }}
                >
                  Advanced File Report
                </Button>
              )}

            </div>

            {/* Patient data information  */}

            <div className='Report-modal-patient-data'>
              <div
                style={{
                  background: '#ebf7fd',
                  fontWeight: '600',
                  padding: '10px 24px',
                  borderRadius: '0px',
                  margin: '0 -24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  paddingRight: '10px'
                }}
              >
                <div>Patient Info | Reference id : {referenceId}</div>

                <div
                  style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
                >
                  {modalData.find(data => data.name === 'urgent_case')?.value
                    ?.urgent_case && <Tag color='error'>Urgent</Tag>}
                  {studyImages?.length > 0 && (
                    <Button
                      type='primary'
                      onClick={() => setShow(true)}
                      style={{ marginRight: '10px' }}
                    >
                      Study Images
                    </Button>
                  )}
                </div>
              </div>

              <List
                style={{ marginTop: '8px' }}
                grid={{
                  gutter: 5,
                  column: 2
                }}
                className='queue-status-list'
                dataSource={modalData?.filter(
                  data => data.name !== 'urgent_case'
                )}
                renderItem={item => (
                  <List.Item className='queue-number-list'>
                    <Typography
                      style={{ display: 'flex', gap: '4px', fontWeight: '600', flexWrap: 'wrap' }}
                    >
                      {item.name}:
                      {item.name === "Patient id" ||
                        item.name === "Patient Name" ||
                        item.name === "Study UID" ||
                        item.name === "Institution Name" ||
                        item.name === "Series UID" ||
                        item.name === "Assign study time" ||
                        item.name === "Assign study username" ? (
                        <Tag color="#87d068">{item.value}</Tag>
                      ) : (
                        <Typography style={{ fontWeight: '400' }}>
                          {item.value !== undefined && item.value !== null &&
                            item.value
                          }
                        </Typography>
                      )}
                    </Typography>
                  </List.Item>
                )}
              />

              <div style={{ paddingRight: '1rem' }}>
                {tableData?.length > 0 && (
                  <TableWithFilter
                    tableColumns={columns}
                    tableData={tableData}
                  />
                )}
              </div>
            </div>

          </div>

        </Spin>

      </Modal>

      {/* Simplified report option modal  */}

      <FileReport
        isFileReportModalOpen={isFileReportModalOpen}
        setIsFileReportModalOpen={setIsFileReportModalOpen}
        setReportModalOpen={setIsReportModalOpen}
        studyID={studyID}
        modalData={modalData}
      />

      {/* Study reference image information  */}

      <ImageCarousel
        studyImages={studyImages}
        show={show}
        setShow={setShow}
      />

      {/* Simplified report reference image information  */}

      <ImageCarousel
        studyImages={normalReportImages}
        show={isViewReportModalOpen}
        setShow={setIsViewReportModalOpen}
        showStudyData={true}
        studyData={normalReportModalData}
      />
    </>
  )
}

export default StudyReports