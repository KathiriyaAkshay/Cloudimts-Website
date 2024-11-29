import { Modal, Row, Spin, Table, Tabs, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchSupport } from '../apis/studiesApi'
const {Paragraph} = Typography ; 
import { ToolOutlined } from '@ant-design/icons';

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

  const RemoteColumns = [
    {
      title: 'Description',
      dataIndex: 'option_description'
    },
    {
      title: 'Remote Address',
      dataIndex: 'option_value'
    }
  ]

  return (
    <div>
      <Modal
        centered
        width={'50%'}
        title={'Cloudimts - Support'}
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
                <Table
                  columns={columns}
                  dataSource={tableData?.filter(data => data?.option === 1)}
                  pagination = {false}
                  style={{
                    width:"100%"
                  }}
                />
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane key={'2'} tab='Phone Support'>
              <Row gutter={15}>
                <Table
                  columns={PhoneColumns}
                  dataSource={tableData?.filter(data => data?.option === 2)}
                  pagination = {false}
                  style={{
                    width:"100%"
                  }}
                />
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane key={'3'} tab='Remote Support'>
              <Row gutter={15}>
              <Paragraph style={{ fontWeight: 400, fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <ToolOutlined style={{ fontSize: "1.2rem", color: "#faad14" }} />
            Under construction.
        </Paragraph>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Modal>
    </div>
  )
}

export default CustomerSupportModal
