import { List, Modal, Spin, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import TableWithFilter from '../TableWithFilter'
import { getStudyData, getStudyLogsData } from '../../apis/studiesApi'
import moment from 'moment/moment' 
import { convertToDDMMYYYY } from '../../helpers/utils' ; 
import NotificationMessage from '../NotificationMessage'

const StudyAudits = ({ isModalOpen, setIsModalOpen, studyID, setStudyID, referenceId }) => {
  const [modalData, setModalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [auditData, setAuditData] = useState([])

  // **** Retervie particular study information and particualr study logs information **** // 
  const retrieveStudyData = () => {
    setIsLoading(true)
    getStudyData({ id: studyID })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data
          const modifiedData = [
            {
              name: "Patient id",
              value: referenceId
            },
            {
              name: "Patient Name",
              value: resData?.Patient_name
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

  useEffect(() => {
    if (studyID && isModalOpen) {
      retrieveStudyData()
    }
  }, [studyID])


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
              ? '#0055ff'
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
      sorter: (a, b) => moment(a.time).diff(b.time), 
      render: (text, record) => convertToDDMMYYYY(record?.time)
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
      title='Study Auditing'
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
          <div>Patient Info | Reference id : {referenceId}</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center'}}>
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
          className='queue-status-list study-modal-patient-audit-info-layout'
          dataSource={modalData?.filter(data => data.name !== 'urgent_case')}
          renderItem={item => (
            <List.Item className='queue-number-list'>
              <Typography
                style={{ display: 'flex', gap: '4px', fontWeight: '600',flexWrap:"wrap" }}
              >
                {item.name}:
                {item.name === "Patient id" ||
                item.name === "Patient Name" ||
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
          <TableWithFilter tableColumns={auditColumns} tableData={auditData} isAuditModal={true} />
        </div>
      </Spin>
    </Modal>
  )
}

export default StudyAudits
