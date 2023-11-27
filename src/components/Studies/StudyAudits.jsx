import { List, Modal, Spin, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import TableWithFilter from '../TableWithFilter'
import { getStudyData, getStudyLogsData } from '../../apis/studiesApi'
import moment from 'moment/moment'

const StudyAudits = ({ isModalOpen, setIsModalOpen, studyID, setStudyID }) => {
  const [modalData, setModalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [auditData, setAuditData] = useState([])

  useEffect(() => {
    if (studyID && isModalOpen) {
      retrieveStudyData()
    }
  }, [studyID])

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

          getStudyLogsData({ id: studyID, sort_option: true })
            .then(res => {
              if (res.data.status) {
                const resData = res.data.data.map(data => ({
                  ...data,
                  perform_user: data.perform_user.username, 
                  target_user: data?.target_user?.username
                }))
                setAuditData([
                  ...resData
                ])
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

  const auditColumns = [
    {
      title: 'Event Type',
      dataIndex: 'event_display',
      sorter: (a, b) => a.event_display.localeCompare(b.event_display),
      render: text => (
        <Tag
          color={
            text.includes('Assigned')
              ? 'blue'
              : text.includes('Viewed')
              ? 'green'
              : text.includes('Update study details')
              ? 'warning'
              : text.includes('Image transfer start')
              ? 'orange'
              : text.includes('Image transfer complete')
              ? 'magenta'
              : text.includes('Remove assign user')
              ? 'lime'
              : text.includes('Report study')
              ? 'cyan'
              : text.includes('Delete study')
              ? 'red'
              : text.includes('Report viewed')
              ? 'geekblue'
              : text.includes('Closed study')
              ? 'yellow'
              : text.includes('Reporting Study')
              ? 'volcano'
              : text.includes('Backup study')
              ? 'gold'
              : 'purple'
          }
          className='event-type-tag'
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Event time',
      dataIndex: 'time',
      sorter: (a, b) => moment(a.time).diff(b.time)
    },
    {
      title: 'Performed User',
      dataIndex: 'perform_user',
      sorter: (a, b) => a?.perform_user?.localeCompare(b?.perform_user)
    },
    {
      title: 'Target User',
      dataIndex: 'target_user'
    }
  ]

  return (
    <Modal
      className='study-auditing-modal'
      title='Study Audit Entries'
      open={isModalOpen}
      onOk={() => {
        setStudyID(null)
        setIsModalOpen(false)
      }}
      onCancel={() => {
        setStudyID(null)
        setIsModalOpen(false)
      }}
      width={1000}
      centered
      footer={null}
    >
      <Spin spinning={isLoading}>
        <div
          style={{
            background: '#ebf7fd',
            fontWeight: '600',
            padding: '10px 24px',
            borderRadius: '0px',
            margin: '0 -24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>Patient Info</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {modalData.find(data => data.name === 'urgent_case')?.value
              ?.urgent_case && <Tag color='error'>Urgent</Tag>}
          </div>
        </div>

        <List
          style={{ marginTop: '8px' }}
          grid={{
            gutter: 5,
            column: 2
          }}
          className='queue-status-list study-modal-patient-info-layout'
          dataSource={modalData?.filter(data => data.name !== 'urgent_case')}
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

        <div className='Study-auditing-modal-table-data'>
          <TableWithFilter tableColumns={auditColumns} tableData={auditData} />
        </div>
      </Spin>
    </Modal>
  )
}

export default StudyAudits
