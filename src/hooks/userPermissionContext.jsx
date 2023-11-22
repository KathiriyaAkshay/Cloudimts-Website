import { createContext, useEffect, useState } from 'react'
import { fetchPermissions } from '../apis/studiesApi'
import { Spin } from 'antd'

export const UserPermissionContext = createContext()

const UserPermissionProvider = ({ children }) => {
  const [permissionData, setPermissionData] = useState({})
  const role_id = localStorage.getItem('role_id')
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem('token')
  useEffect(() => {
    setIsLoading(true)
    fetchPermissions({ role_id })
      .then(res => {
        if (res.data.status) {
          setPermissionData(res.data.data)
          setIsLoading(false)
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
  }, [role_id])

  if (isLoading) {
    return (
      <Spin tip='Loading'>
        <div className='spin-dummy-data' />
      </Spin>
    )
  }
  console.log(permissionData)

  return (
    <UserPermissionContext.Provider value={{ permissionData }}>
      {children}
    </UserPermissionContext.Provider>
  )
}

export default UserPermissionProvider
