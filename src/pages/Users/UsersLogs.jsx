import React, { useEffect, useState } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { getUsersLogs, userLogsFilter } from '../../apis/studiesApi'
import TableWithFilter from '../../components/TableWithFilter'
import UserLogsFilter from '../../components/UserLogsFilter'
import { Tag } from 'antd' 
import { convertToDDMMYYYY } from '../../helpers/utils'

const UsersLogs = () => {
  const [tableData, setTableData] = useState([])
  const { changeBreadcrumbs } = useBreadcrumbs()
  const [isLoading, setIsLoading] = useState(false)
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [filterValues, setFilterValues] = useState({})

  useEffect(() => {
    const crumbs = [{ name: 'Users', to: '/users' }]
    crumbs.push({
      name: 'Users Logs'
    })
    changeBreadcrumbs(crumbs)
    retrieveStudyData()
  }, [])

  const retrieveStudyData = (pagination, values = {}, valueChanged = false) => {
    setIsLoading(true)
    const currentPagination = pagination || pagi
    console.log(currentPagination)
    userLogsFilter({
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
      page_size: currentPagination.limit || 10,
      sort_option: true
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            ...data,
            perform_user: data?.perfrom_user?.username,
            target_user: data?.target_user?.username
          }))
          setTableData(resData)
          setTotalPages(res.data.total_object)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed'))
    setIsLoading(false)
  }

  const columns = [
    {
      title: 'Perform User',
      dataIndex: 'perform_user'
    },
    {
      title: 'Target User',
      dataIndex: 'target_user'
    },
    {
      title: 'Event',
      dataIndex: 'logs_id',
      render: text => (
        <Tag
          color={
            text.includes('User login')
              ? 'blue'
              : text.includes('create')
              ? 'green'
              : text.includes('basic details update')
              ? 'warning'
              : text.includes('modality details update')
              ? 'orange'
              : text.includes('institution details update')
              ? 'magenta'
              : text.includes('password update')
              ? 'lime'
              : text.includes(' Signature image')
              ? 'cyan'
              : text.includes('User disable')
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
    <div>
      
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveStudyData}
        loadingTableData={isLoading}
      />

      <UserLogsFilter
        name={'User Logs Filter'}
        retrieveRoleData={retrieveStudyData}
        setFilterValues={setFilterValues}
      />
    </div>
  )
}

export default UsersLogs
