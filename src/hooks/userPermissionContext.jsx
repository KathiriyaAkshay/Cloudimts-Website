import { createContext, useEffect, useState } from 'react'
import { fetchPermissions } from '../apis/studiesApi'
import { Spin } from 'antd' ; 
import NotificationMessage from '../components/NotificationMessage';

export const UserPermissionContext = createContext()

const UserPermissionProvider = ({ children }) => {

  const role_id = localStorage.getItem('role_id')
  
  const [permissionData, setPermissionData] = useState({}) ; 
  const [isLoading, setIsLoading] = useState(false) ; 

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

  return (
    <UserPermissionContext.Provider value={{ permissionData }}>
      {children}
    </UserPermissionContext.Provider>
  )
}

export default UserPermissionProvider
