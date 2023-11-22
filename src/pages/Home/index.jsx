import { useEffect, useState } from 'react'
import '../../assets/scss/dashboard.scss'

import { Card, Col, Row, Typography, Spin } from 'antd'
import { getDashboardData, getDashboardTableData } from '../../apis/studiesApi'
import { GrNewWindow, GrOverview, GrUserSettings } from 'react-icons/gr'
import { BsFillFileTextFill } from 'react-icons/bs'
import TableWithFilter from '../../components/TableWithFilter'

function Home () {
  const { Title, Text } = Typography
  const [dashboardState, setDashboardState] = useState({
    new_study: 0,
    view_study: 0,
    assign_study: 0,
    reported_study: 0,
    total_study: 0
  })
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    retrieveDashboardStudy()
    retrieveTableData()
  }, [])

  const retrieveDashboardStudy = () => {
    setIsLoading(true)
    getDashboardData()
      .then(res => {
        if (res.data.status) {
          setDashboardState({
            new_study: res.data.new_studies_count,
            view_study: res.data.views_studies_count,
            assign_study: res.data.assigned_studies_count,
            reported_study: res.data.reported_studies_count,
            total_study: res.data.total_studies
          })
          setIsLoading(false)
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

        setIsLoading(false)
      })
  }

  const retrieveTableData = () => {
    setIsLoading(true)
    getDashboardTableData()
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(data => ({
            ...data,
            perform_user: data?.perform_user?.username,
            target_user: data?.target_use?.username,
            modality: data?.study?.modality,
            institution_name: data?.study?.institution?.name
          }))
          setTableData(resData)
          setIsLoading(false)
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

        setIsLoading(false)
      })
  }

  const column = [
    {
      title: 'Event Type',
      dataIndex: 'event_display'
    },
    {
      title: 'Performed Time',
      dataIndex: 'time'
    },
    {
      title: 'Performed User',
      dataIndex: 'perform_user'
    },
    {
      title: 'Target User',
      dataIndex: 'target_user'
    },
    {
      title: 'Institution',
      dataIndex: 'institution_name'
    },
    {
      title: 'Modality',
      dataIndex: 'modality'
    }
  ]

  return (
    <Spin spinning={isLoading}>
      <div className='layout-content' style={{ marginTop: '20px' }}>
        <Row className='rowgap-vbox' gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} className='mb-24'>
            {/* ==== New Stuies count information ====  */}

            <Card bordered={false} className='criclebox '>
              <div className='number'>
                <Row align='middle' gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{'New Studies'}</span>
                    <Title level={3}>{dashboardState.new_study}</Title>
                  </Col>
                  <Col xs={6}>
                    <div className='icon-box new-study-box'>
                      <GrNewWindow className='study-icon' />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6} xl={6} className='mb-24'>
            {/* ===== Assigned studies count information =====  */}

            <Card bordered={false} className='criclebox '>
              <div className='number'>
                <Row align='middle' gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{'Assigned Studies'}</span>
                    <Title level={3}>{dashboardState.assign_study}</Title>
                  </Col>
                  <Col xs={6}>
                    <div className='icon-box assign-study-box'>
                      <GrUserSettings className='study-icon' />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6} xl={6} className='mb-24'>
            {/* ==== View studies count information ====  */}

            <Card bordered={false} className='criclebox '>
              <div className='number'>
                <Row align='middle' gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{'View Studies'}</span>
                    <Title level={3}>{dashboardState.view_study}</Title>
                  </Col>
                  <Col xs={6}>
                    <div className='icon-box view-study-box'>
                      <GrOverview className='study-icon' />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12} lg={6} xl={6} className='mb-24'>
            {/* ==== Reported studies count information =====  */}

            <Card bordered={false} className='criclebox '>
              <div className='number'>
                <Row align='middle' gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{'Closed Studies'}</span>
                    <Title level={3}>{dashboardState.reported_study}</Title>
                  </Col>
                  <Col xs={6}>
                    <div className='icon-box report-study-box'>
                      <BsFillFileTextFill className='study-icon' />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ==== All Institution logs information ====  */}

        <Row gutter={0} style={{ marginTop: '20px' }}>
          <Col xs={24}>
            <TableWithFilter tableData={tableData} tableColumns={column} />
          </Col>
        </Row>
      </div>
    </Spin>
  )
}

export default Home
