import React, { useEffect, useState } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Popconfirm, Space, Table, Tag, Tooltip } from 'antd'
import DicomViewer from '../../components/DicomViewer'
import { backupStudy, fetchDeletedStudies } from '../../apis/studiesApi'
import { MdRestore } from 'react-icons/md'
import NotificationMessage from '../../components/NotificationMessage'

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
  const [expandedRows, setExpandedRows] = useState([])
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [studyIdArray, setStudyIdArray] = useState([])

  useEffect(() => {
    setPagi(Pagination)

    retrieveStudyData(Pagination)
  }, [Pagination])

  const onShowSizeChange = (current, pageSize) => {
    setLimit(pageSize)

    setPagination(prev => ({ ...prev, page: current, limit: pageSize }))
  }

  useEffect(() => {
    changeBreadcrumbs([{ name: 'Deleted Studies' }])
  }, [])

  const retrieveStudyData = pagination => {
    setIsLoading(true)
    const currentPagination = pagination || pagi
    fetchDeletedStudies({
      // filter: values,
      page_size: currentPagination.limit || 10,
      page_number: currentPagination.page,
      //   all_premission_id: JSON.parse(localStorage.getItem("all_permission_id")),
      //   all_assign_id: JSON.parse(localStorage.getItem("all_assign_id")),
      //   deleted: false,
      //   deleted_skip: true,
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
          setStudyData(resData)
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

  const backupStudyData = async id => {
    await backupStudy({ id })
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', 'Study Backup Successfully')
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
      title: "Patient's Id",
      dataIndex: 'patient_id'
    },
    {
      title: "Patient's Name",
      dataIndex: 'name'
    },
    {
      title: 'Study Id',
      dataIndex: 'study_id'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <Tag
          color={
            text === 'New'
              ? 'success'
              : text === 'Assigned'
              ? 'blue'
              : text === 'Viewed'
              ? 'cyan'
              : text === 'ViewReport'
              ? 'lime'
              : text === 'Reporting'
              ? 'magenta'
              : text === 'CloseStudy'
              ? 'red'
              : 'warning'
          }
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
      title: 'Date Time',
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
              // onClick={() => backupStudyData(record.id)}
            />
          </Popconfirm>
        </Tooltip>
      )
    }
  ].filter(Boolean)

  const onRow = record => ({
    onClick: () => handleRowClick(record)
    // onDoubleClick: () => handleCellDoubleClick(record),
  })

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setStudyIdArray(prev => selectedRows?.map(data => data.id))
    },
    getCheckboxProps: record => ({
      // Column configuration not to be checked
      id: record.id
    })
  }

  const handleRowClick = record => {
    const isRowExpanded = expandedRows.includes(record.id)

    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(key => key !== record.id))
    } else {
      setExpandedRows([...expandedRows, record.id])
    }
  }

  return (
    <Table
      dataSource={studyData}
      columns={columns}
      expandable={{
        expandedRowRender: record => (
          <p style={{ margin: 0 }}>
            <DicomViewer dicomUrl={record?.study?.study_original_id} />
            {/* {retrieveStudyInstance(record?.study?.study_original_id)} */}
          </p>
        )
      }}
      //   rowSelection={rowSelection}
      onRow={onRow}
      // onPaginationChange={retrieveStudyData}
      loading={isLoading}
      pagination={{
        current: Pagination.page,
        pageSize: localStorage.getItem("pageSize")||Pagination.limit,
        total: totalPages,
        pageSizeOptions: [10, 25, 50, 100, 200, 500],
        showSizeChanger: totalPages > 10,
        onChange: (page = 1, pageSize = limit) => {
          setPagination({ ...Pagination, page, limit: pageSize })
        },
        onShowSizeChange: onShowSizeChange
      }}
    />
  )
}

export default DeletedStudies
