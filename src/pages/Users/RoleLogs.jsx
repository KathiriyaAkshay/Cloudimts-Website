import React, { useEffect, useState } from 'react'
import TableWithFilter from '../../components/TableWithFilter'
import { fetchRoleLogs } from '../../apis/studiesApi'
import RoleLogsFilter from '../../components/RoleLogsFilter'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { Tag } from 'antd'

const RoleLogs = () => {
  const [tableData, setTableData] = useState([])
  const [pagi, setPagi] = useState({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [filterValues, setFilterValues] = useState({})
  const { changeBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    const crumbs = [{ name: 'Roles', to: '/users/roles' }]
    crumbs.push({
      name: 'Role Logs'
    })
    changeBreadcrumbs(crumbs)
  }, [])

  const retrieveRolesData = async (
    pagination,
    values = {},
    valueChanged = false
  ) => {
    setIsLoading(true)
    const currentPagination = pagination || pagi
    fetchRoleLogs({
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
      page_number: currentPagination.page,
      page_size: currentPagination.limit || 10
    })
      .then(res => {
        if (res.data.status) {
          setTableData(res.data.data)
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

  const columns = [
    {
      title: 'Perfrom user',
      dataIndex: 'username'
    },
    {
      title: 'Role',
      dataIndex: 'role_name',
      render: (text, record) => record.role.role_name
    },
    {
      title: 'Event Type',
      dataIndex: 'event_display',
      render: text => (
        <Tag
          color={
            text.includes('Fetch')
              ? 'blue'
              : text.includes('Create')
              ? 'green'
              : text.includes('Update')
              ? 'warning'
              : 'orange'
          }
          className='event-type-tag'
        >
          {text}
        </Tag>
      )
    },
    {
      title: 'Time',
      dataIndex: 'time'
    }
  ]

  return (
    <div>
      <TableWithFilter
        tableColumns={columns}
        tableData={tableData}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveRolesData}
        loadingTableData={isLoading}
      />
      <RoleLogsFilter
        retrieveRoleData={retrieveRolesData}
        name={'Role Logs Filter'}
        setFilterValues={setFilterValues}
      />
    </div>
  )
}

export default RoleLogs
