import React, { useEffect, useState } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Popconfirm, Space, Table, Tag, Tooltip } from 'antd'
import { backupStudy, fetchDeletedStudies } from '../../apis/studiesApi'
import { MdRestore } from 'react-icons/md'
import NotificationMessage from '../../components/NotificationMessage'
import { modifyDate } from '../../helpers/utils'

const DeletedStudies = () => {
  const { changeBreadcrumbs } = useBreadcrumbs()
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: totalPages,
    search: '',
    order: 'desc'
  })
  const [studyData, setStudyData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  
  // **** Reterive deleted study details information **** // 
  const retrieveStudyData = pagination => {
    setIsLoading(true)
    const currentPagination = pagination || pagi
    fetchDeletedStudies({
      page_size: currentPagination.limit || 10,
      page_number: currentPagination.page,
      sort_option: false
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            ...data,
            name: data.study.patient_name,
            institution: data.institution.name,
            patient_id: data?.study?.patient_id,
            study_id: data?.study?.id,
            key: data.id
          }))
          const finalData = modifyDate(resData)
          setStudyData(finalData)
          setTotalPages(res.data.total_object)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => {
        NotificationMessage(
          'warning',
          'Network request failed',
          err.response.data.message
        )
      })
    setIsLoading(false)
  }

  const onShowSizeChange = (current, pageSize) => {
    setLimit(pageSize)
    setPagination(prev => ({ ...prev, page: current, limit: pageSize }))
  }

  useEffect(() => {
    setPagi(Pagination)
    retrieveStudyData(Pagination)
  }, [Pagination])


  useEffect(() => {
    changeBreadcrumbs([{ name: 'Deleted Studies' }])
  }, [])

  // **** Backup particular study **** // 

  const backupStudyData = async id => {
    await backupStudy({ id })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Study backup has been successfully executed')
          retrieveStudyData()
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

  const columns = [
    {
      title: "Patient Id",
      dataIndex: 'patient_id'
    },
    {
      title: "Patient's Name",
      dataIndex: 'name'
    },
    {
      title: 'Reference id',
      dataIndex: 'refernce_id'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <Tag
          color={"#795695"}
          style={{ textAlign: 'center', fontWeight: '600' }}
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Modality',
      dataIndex: 'modality'
    },
    {
      title: 'Study date',
      dataIndex: 'created_at'
    },
    {
      title: 'Institution',
      dataIndex: 'institution'
    },
    {
      title: 'Description',
      dataIndex: 'study_description'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      width: window.innerWidth < 650 ? '1%' : '10%',
      render: (_, record) => (
        <Tooltip title='Backup Study'>
          <Popconfirm
            title='Are you sure to backup this study?'
            onConfirm={() => backupStudyData(record.id)}
            okText='Yes'
          >
            <MdRestore
              className='action-icon'
            />
          </Popconfirm>
        </Tooltip>
      )
    }
  ].filter(Boolean)

  return (
    <Table
      dataSource={studyData}
      columns={columns}
      loading={isLoading}
      pagination={{
        current: Pagination.page,
        pageSize: localStorage.getItem("pageSize") || Pagination.limit,
        total: totalPages,
        pageSizeOptions: [10, 25, 50, 100, 200, 500],
        showSizeChanger: totalPages > 10,
        onChange: (page = 1, pageSize = limit) => {
          setPagination({ ...Pagination, page, limit: pageSize })
        },
        onShowSizeChange: onShowSizeChange
      }}
      scroll={{y: "70vh"}}
    />
  )
}

export default DeletedStudies
