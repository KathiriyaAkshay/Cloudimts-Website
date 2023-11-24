import {
  Button,
  List,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  downloadAdvancedFileReport,
  getStudyData,
  viewReported
} from '../../apis/studiesApi'
import FileReport from './FileReport'
import TableWithFilter from '../TableWithFilter'
import { BsEyeFill } from 'react-icons/bs'
import {
  DownloadOutlined,
  MailOutlined,
  WhatsAppOutlined
} from '@ant-design/icons'
import ImageCarousel from './ImageCarousel'
import { useNavigate } from 'react-router-dom'
import { UserPermissionContext } from '../../hooks/userPermissionContext'
import jsPDF from 'jspdf'
import APIHandler from '../../apis/apiHandler'

const StudyReports = ({
  isReportModalOpen,
  setIsReportModalOpen,
  studyID,
  setStudyID,
  studyStatus,
  setStudyStatus,
  studyStatusHandler,
  pageNumberHandler,
  isEmailShareModalOpen,
  setEmailReportId,
  patientId,
  patientName
}) => {
  const [modalData, setModalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFileReportModalOpen, setIsFileReportModalOpen] = useState(false)
  const [tableData, setTableData] = useState([])
  const [studyImages, setStudyImages] = useState([])
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const { permissionData } = useContext(UserPermissionContext)
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false)
  const [normalReportImages, setNormalReportImages] = useState([])
  const [normalReportModalData, setNormalReportModalData] = useState({})

  useEffect(() => {
    if (studyID && isReportModalOpen) {
      retrieveStudyData()
    }
  }, [studyID])

  const checkPermissionStatus = name => {
    const permission = permissionData['Studies permission'].find(
      data => data.permission === name
    )?.permission_value
    return permission
  }

  const CompleteStudyHandler = async () => {
    let requestPayload = {
      id: studyID
    }

    await APIHandler('POST', requestPayload, 'studies/v1/complete-study')
  }

  const downloadReport = async id => {
    await CompleteStudyHandler()

    await downloadAdvancedFileReport({ id })
      .then(res => {
        if (res.data.status) {
          const doc = new jsPDF({
            format: 'a4',
            unit: 'px'
          })

          var reportPatientName = patientName.replace(/ /g, '-')

          // Adding the fonts.
          doc.setFont('Inter-Regular', 'normal')

          doc.html(res?.data?.data?.report, {
            async callback (doc) {
              await doc.save(`${patientId}-${reportPatientName}-report`)
            },
            margin: [10, 10, 10, 10],
            autoPaging: 'text',
            x: 0,
            y: 0,
            width: 190, 
            windowWidth: 675 
          })
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', err.response.data.message))
  }

  const handleStudyStatus = async () => {
    if (studyStatus === 'Reported') {
      await viewReported({ id: studyID })
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', res.data.message)
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
  }

  const columns = [
    {
      title: 'Report Time',
      dataIndex: 'reporting_time'
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

          <Tooltip title={'Download'}>
            <DownloadOutlined
              className='action-icon'
              onClick={() => downloadReport(record.id)}
            />
          </Tooltip>

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
              <WhatsAppOutlined className='action-icon' />
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  const retrieveStudyData = () => {
    setIsLoading(true)
    getStudyData({ id: studyID })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data
          const modifiedData = [
            {
              name: "Patient's id",
              value: resData?.Patient_id
            },
            {
              name: 'Referring Physician Name',
              value: resData?.Referring_physician_name
            },
            {
              name: "Patient's Name",
              value: resData?.Patient_name
            },

            {
              name: "Assign study time", 
              value: resData?.study_assign_time
            }, 
  
            {
              name: "Assign study username", 
              value: resData?.study_assign_username 
            }, 
            
            {
              name: 'Performing Physician Name',
              value: resData?.Performing_physician_name
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
              name: "Patient's comments",
              value: resData?.Patient_comments
            },
            {
              name: 'Body Part',
              value: resData?.Study_body_part
            },
            {
              name: 'Study UID',
              value: resData?.Study_UID
            },
            {
              name: 'Series UID',
              value: resData?.Series_UID
            },
            {
              name: 'urgent_case',
              value: resData?.assigned_study_data
            }
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

  const EmailShareModalOpen = id => {
    setEmailReportId(id)
    isEmailShareModalOpen(true)
  }

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
          <div className='Assign-study-upload-option-input-layout'>
            <div className='Report-modal-all-option-div'>
              <Button key='back' className='Report-modal-option-button'>
                OHIF Viewer
              </Button>

              <Button key='back' className='Report-modal-option-button'>
                Web Report
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

            <div className='Report-modal-patient-data'>
              <div
                style={{
                  background: '#ebf7fd',
                  fontWeight: '600',
                  padding: '10px 24px',
                  paddingRight: '0px',
                  borderRadius: '0px',
                  margin: '0 -24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  paddingRight: '10px'
                }}
              >
                <div>Patient Info</div>
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
                      style={{ display: 'flex', gap: '4px', fontWeight: '600' }}
                    >
                      {item.name}:
                      {item.name === "Patient's id" ||
                      item.name === "Patient's Name" ||
                      item.name === "Study UID" ||
                      item.name === "Institution Name" ||
                      item.name === "Series UID" || 
                      item.name === "Assign study time" || 
                      item.name === "Assign study username"? (
                        <Tag color="#87d068">{item.value}</Tag>
                      ) : (
                        <Typography style={{ fontWeight: '400' }}>
                          {item.value}
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

      <FileReport
        isFileReportModalOpen={isFileReportModalOpen}
        setIsFileReportModalOpen={setIsFileReportModalOpen}
        studyID={studyID}
        modalData={modalData}
      />

      <ImageCarousel studyImages={studyImages} show={show} setShow={setShow} />

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
