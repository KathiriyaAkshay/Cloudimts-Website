import React, { useState } from 'react'
import TableWithFilter from '../../components/TableWithFilter'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Tag,
  Typography
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import API from '../../apis/getApi'
import NotificationMessage from '../../components/NotificationMessage'
import axios from 'axios'
import { useEffect } from 'react'
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs'
// import {DICOMwebClient} from 'dicomweb-client';

const IOD = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const { changeBreadcrumbs, isModalOpen, setIsModalOpen } = useBreadcrumbs()

  useEffect(() => {
    changeBreadcrumbs([{ name: 'IOD Configuration' }])
    form.setFieldsValue(JSON.parse(localStorage.getItem('IOD')))
  }, [])

  const checkConnection = async values => {
    setIsLoading(true)
    // await axios
    //   .get(`http://${values.url}/studies/`, {
    //     auth: { username: "alice", password: "alicePassword" },
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    //     },
    //   })
    //   .then((res) => {
    //     if (res.status === 200) {
    //       form.resetFields();
    //       setIsModalOpen(false);
    //       NotificationMessage("success", "Port Connected Successfully");
    //     } else {
    //       NotificationMessage(
    //         "warning",
    //         "Error Occurred During Connecting Port"
    //       );
    //     }
    //   })
    //   .catch((err) =>
    //     NotificationMessage("warning", "Error Occurred During Connecting Port")
    //   );
    const client = new DICOMwebClient.api.DICOMwebClient({
      url: 'http://localhost:8042'
      // auth: {
      //   user: "alice",
      //   pass: 'alicePassword'
      // }
    })
    client.searchForInstances
      .then(res => {
        if (res.data.status) {
          NotificationMessage('success', res.data.message)
        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning', 'Network request failed', err.response.data.message))
    setIsLoading(false)
    localStorage.setItem('IOD', JSON.stringify(values))
  }

  const handleSubmit = values => {
    checkConnection(values)
  }

  return (
    <>
      <div>
        <Card className='mb'>
          <Row gutter={15}>
            <Col lg={11}>
              <Row gutter={15}>
                <Col
                  lg={24}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography></Typography>
                  <Tag color='error' style={{ fontWeight: '600' }}>
                    Pending
                  </Tag>
                </Col>
                <Col lg={24} className='mt mb'>
                  <Typography className='study-typography-primary'>
                    Study ID:{' '}
                    <Typography className='study-typography-secondary'>
                      c24a3dcd-ba09395b-ec5d6f80-40b378f7-defbda7d
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Patient ID:{' '}
                    <Typography className='study-typography-secondary'>
                      TCGA-17-Z021
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Patient Name:{' '}
                    <Typography className='study-typography-secondary'>
                      TCGA-17-Z021
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Gender:{' '}
                    <Typography className='study-typography-secondary'>
                      F
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Date of Birth:{' '}
                    <Typography className='study-typography-secondary'>
                      Wed Aug 09 2002
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Study Date:{' '}
                    <Typography className='study-typography-secondary'>
                      Thursday, January 20, 2010
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Referring Physician Name:{' '}
                    <Typography className='study-typography-secondary'></Typography>
                  </Typography>
                </Col>
              </Row>
            </Col>
            <Col lg={1}>
              <Divider type='vertical' style={{ height: '200px' }} />
            </Col>
            <Col
              lg={12}
              style={{ maxHeight: '200px', overflow: 'auto' }}
              className='iod-setting-card'
            >
              <Row gutter={15}>
                <Col
                  lg={24}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography className='study-counter'>1</Typography>
                  <Tag
                    color='error'
                    style={{ fontWeight: '600', paddingTop: '3px' }}
                  >
                    0%
                  </Tag>
                </Col>
                <Col lg={24} className='mt'>
                  <Typography className='study-typography-primary typography-primary'>
                    Series ID:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      f351f7fe-a1c261a7-9860f253-c4d636e4-b6d07c86
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={24}>
                  <Typography className='study-typography-primary mb typography-primary'>
                    Body Part Examined:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      CHEST
                    </Typography>
                  </Typography>
                </Col>
                <div style={{ padding: '0 30px' }}>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instances ID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        78b0fb08-7a99393c-7da48191-42cbde87-7b6f0deb
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      SOP Instance UID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        1.3.6.1.4.1.14519.5.2.1.7777.9002.267630854783701743169278741987
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instance Number:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        000038
                      </Typography>
                    </Typography>
                  </Col>
                </div>
                <Divider />
                <Col
                  lg={24}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography className='study-counter'>2</Typography>
                  <Tag
                    color='error'
                    style={{ fontWeight: '600', paddingTop: '3px' }}
                  >
                    0%
                  </Tag>
                </Col>
                <Col lg={24} className='mt'>
                  <Typography className='study-typography-primary typography-primary'>
                    Series ID:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      f351f7fe-a1c261a7-9860f253-c4d636e4-b6d07c86
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={24}>
                  <Typography className='study-typography-primary mb typography-primary'>
                    Body Part Examined:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      CHEST
                    </Typography>
                  </Typography>
                </Col>
                <div style={{ padding: '0 30px' }}>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instances ID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        78b0fb08-7a99393c-7da48191-42cbde87-7b6f0deb
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      SOP Instance UID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        1.3.6.1.4.1.14519.5.2.1.7777.9002.267630854783701743169278741987
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instance Number:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        000038
                      </Typography>
                    </Typography>
                  </Col>
                </div>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card className='mb'>
          <Row gutter={15}>
            <Col lg={11}>
              <Row gutter={15}>
                <Col
                  lg={24}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography></Typography>
                  <Tag color='error' style={{ fontWeight: '600' }}>
                    Pending
                  </Tag>
                </Col>
                <Col lg={24} className='mt mb'>
                  <Typography className='study-typography-primary'>
                    Study ID:{' '}
                    <Typography className='study-typography-secondary'>
                      c24a3dcd-ba09395b-ec5d6f80-40b378f7-defbda7d
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Patient ID:{' '}
                    <Typography className='study-typography-secondary'>
                      TCGA-17-Z021
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Patient Name:{' '}
                    <Typography className='study-typography-secondary'>
                      TCGA-17-Z021
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Gender:{' '}
                    <Typography className='study-typography-secondary'>
                      F
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Date of Birth:{' '}
                    <Typography className='study-typography-secondary'>
                      Wed Aug 09 2002
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Study Date:{' '}
                    <Typography className='study-typography-secondary'>
                      Thursday, January 20, 2010
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={12}>
                  <Typography className='study-typography-primary'>
                    Referring Physician Name:{' '}
                    <Typography className='study-typography-secondary'></Typography>
                  </Typography>
                </Col>
              </Row>
            </Col>
            <Col lg={1}>
              <Divider type='vertical' style={{ height: '200px' }} />
            </Col>
            <Col
              lg={12}
              style={{ maxHeight: '200px', overflow: 'auto' }}
              className='iod-setting-card'
            >
              <Row gutter={15}>
                <Col
                  lg={24}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography className='study-counter'>1</Typography>
                  <Tag
                    color='error'
                    style={{ fontWeight: '600', paddingTop: '3px' }}
                  >
                    0%
                  </Tag>
                </Col>
                <Col lg={24} className='mt'>
                  <Typography className='study-typography-primary typography-primary'>
                    Series ID:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      f351f7fe-a1c261a7-9860f253-c4d636e4-b6d07c86
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={24}>
                  <Typography className='study-typography-primary mb typography-primary'>
                    Body Part Examined:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      CHEST
                    </Typography>
                  </Typography>
                </Col>
                <div style={{ padding: '0 30px' }}>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instances ID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        78b0fb08-7a99393c-7da48191-42cbde87-7b6f0deb
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      SOP Instance UID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        1.3.6.1.4.1.14519.5.2.1.7777.9002.267630854783701743169278741987
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instance Number:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        000038
                      </Typography>
                    </Typography>
                  </Col>
                </div>
                <Divider />
                <Col
                  lg={24}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography className='study-counter'>2</Typography>
                  <Tag
                    color='error'
                    style={{ fontWeight: '600', paddingTop: '3px' }}
                  >
                    0%
                  </Tag>
                </Col>
                <Col lg={24} className='mt'>
                  <Typography className='study-typography-primary typography-primary'>
                    Series ID:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      f351f7fe-a1c261a7-9860f253-c4d636e4-b6d07c86
                    </Typography>
                  </Typography>
                </Col>
                <Col lg={24}>
                  <Typography className='study-typography-primary mb typography-primary'>
                    Body Part Examined:{' '}
                    <Typography className='study-typography-secondary study-typography'>
                      CHEST
                    </Typography>
                  </Typography>
                </Col>
                <div style={{ padding: '0 30px' }}>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instances ID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        78b0fb08-7a99393c-7da48191-42cbde87-7b6f0deb
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      SOP Instance UID:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        1.3.6.1.4.1.14519.5.2.1.7777.9002.267630854783701743169278741987
                      </Typography>
                    </Typography>
                  </Col>
                  <Col lg={24}>
                    <Typography className='study-typography-primary typography-primary'>
                      Instance Number:{' '}
                      <Typography className='study-typography-secondary study-typography'>
                        000038
                      </Typography>
                    </Typography>
                  </Col>
                </div>
              </Row>
            </Col>
          </Row>
        </Card>
      </div>
      <Modal
        title='Configure IOD Settings'
        open={isModalOpen}
        onOk={() => {
          form.submit()
        }}
        onCancel={() => {
          form.setFieldsValue(JSON.parse(localStorage.getItem('IOD')))
          setIsModalOpen(false)
        }}
      >
        <Form
          labelCol={{
            span: 24
          }}
          wrapperCol={{
            span: 24
          }}
          form={form}
          onFinish={handleSubmit}
          className='mt'
        >
          <Form.Item
            name='port_number'
            label='Port Number'
            rules={[
              {
                whitespace: true,
                required: true,
                message: 'Please enter Port Number'
              }
            ]}
          >
            <Input placeholder='Enter Port Number' />
          </Form.Item>
          <Form.Item
            name='url'
            label='Port URL'
            rules={[
              {
                whitespace: true,
                required: true,
                message: 'Please enter Port URL'
              }
            ]}
          >
            <Input placeholder='Enter Port URL' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default IOD
