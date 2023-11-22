import { Col, Modal, Row, Spin, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchSupport } from '../apis/studiesApi'
import TableWithFilter from './TableWithFilter'

const CustomerSupportModal = ({ show, setShow }) => {
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    retrieveSupportData()
  }, [])

  const retrieveSupportData = async () => {
    setIsLoading(true)
    await fetchSupport()
      .then(res => {
        if (res.data.status) {
          setTableData(res.data.data)
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

  const columns = [
    {
      title: 'Description',
      dataIndex: 'option_description'
    },
    {
      title: 'Email',
      dataIndex: 'option_value'
    }
  ]

  const PhoneColumns = [
    {
      title: 'Description',
      dataIndex: 'option_description'
    },
    {
      title: 'Contact Number',
      dataIndex: 'option_value'
    }
  ]

  return (
    <div>
      <Modal
        centered
        width={'50%'}
        title={'ImageiNet - Support'}
        open={show}
        onOk={() => setShow(false)}
        onCancel={() => {
          setShow(false)
        }}
        footer={null}
      >
        <Spin spinning={isLoading}>
          <Tabs>
            <Tabs.TabPane key={'1'} tab='Email Support'>
              <Row gutter={15}>
                <TableWithFilter
                  tableColumns={columns}
                  tableData={tableData?.filter(data => data?.option === 1)}
                  pagination
                />
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane key={'2'} tab='Phone Support'>
              <Row gutter={15}>
                <TableWithFilter
                  tableColumns={PhoneColumns}
                  tableData={tableData?.filter(data => data?.option === 2)}
                  pagination
                />
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Modal>
    </div>
  )
}

export default CustomerSupportModal
