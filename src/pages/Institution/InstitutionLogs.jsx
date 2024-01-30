import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TableWithFilter from '../../components/TableWithFilter'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import InstitutionLogsFilter from '../../components/InstitutionLogsFilter'
import { instituteLogsFilter } from '../../apis/studiesApi'
import { Tag } from 'antd'
import { convertToDDMMYYYY } from '../../helpers/utils'
import NotificationMessage from '../../components/NotificationMessage'
import API from '../../apis/getApi'

const InstitutionLogs = () => {
  const [institutionData, setInstitutionData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [filterValues, setFilterValues] = useState({})

  const { changeBreadcrumbs } = useBreadcrumbs() ; 


  useEffect(() => {
    const crumbs = [{ name: 'Institution', to: '/institutions' }]
    crumbs.push({
      name: 'Institution Logs'
    })
    changeBreadcrumbs(crumbs)
  }, [])

  const retrieveInstitutionData = async (
    pagination,
    values = {},
    valueChanged = false
  ) => {
    setIsLoading(true)
    const currentPagination = pagination || pagi
    instituteLogsFilter({
      filter:
        Object.keys(values).length !== 0
          ? values
          : Object.keys(filterValues).length === 0 &&
            Object.keys(values).length !== 0 &&
            !valueChanged
          ? values
          : !valueChanged
          ? filterValues
          : {},
      condition: 'and',
      page_number: currentPagination.page,
      page_size: currentPagination.limit || 10
    })
      .then(res => {
        if (res.data.status) {
          setTotalPages(res.data.total_object)
          setInstitutionData(
            res?.data?.data?.map(data => ({
              ...data,
              instituteName: data?.institution?.name,
              username: data?.user_info?.username
            }))
          )
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => {
        NotificationMessage('warning', 'Network request failed',  err?.response?.data?.message)

      })
    setIsLoading(false)
  }

  const columns = [
    {
      title: 'Institution Name',
      dataIndex: 'instituteName'
    },
    {
      title: 'User Name',
      dataIndex: 'username'
    },
    {
      title: 'Event Info',
      dataIndex: 'event_info',
      render: text => (
        <Tag
          color={
            text.includes('User login')
              ? 'blue'
              : text.includes('create')
              ? 'green'
              : text.includes('basic details update')
              ? 'warning'
              : text.includes('modality charge update')
              ? 'orange'
              : text.includes('studyID setting update')
              ? 'magenta'
              : text.includes('report settings update')
              ? 'lime'
              : text.includes(' Signature image')
              ? 'cyan'
              : text.includes(' blocked user details update')
              ? 'red'
              : 'purple'
          }
          className='event-type-tag'
        >
          {text}
        </Tag>
      )
    },
   
    {
      title: 'Time',
      dataIndex: 'time', 
      render: (text, record) => convertToDDMMYYYY(record?.time)
    }
  ]

  return (
    <>
      <TableWithFilter
        tableData={institutionData}
        tableColumns={columns}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveInstitutionData}
        loadingTableData={isLoading}
      />
      <InstitutionLogsFilter
        name={'Institution Logs Filter'}
        retrieveRoleData={retrieveInstitutionData}
        setFilterValues={setFilterValues}
      />
    </>
  )
}

export default InstitutionLogs
