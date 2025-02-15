import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Spin,
} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../apis/getApi'
import { useContext, useEffect, useState } from 'react'
import logo from '../../assets/images/cloudimts.jpg'
import NotificationMessage from '../../components/NotificationMessage' ; 
import APIHandler from '../../apis/apiHandler'
import LoginBg from '../../assets/images/login.jpeg'

const Login = () => {
  const navigate = useNavigate() ; 
  const [loginForm] = Form.useForm() ; 
  const [isLoading, setIsLoading] = useState(false) ; 

  const CheckUserCredentails = async () => { 

    let responseData = await APIHandler("POST", {}, "owner/v1/user_details_fetch") ; 

    if (responseData['status'] === true){
      navigate("/studies") ; 
    }
  } ; 

  useEffect(() => {
    CheckUserCredentails() ; 
  }, []) ; 

  const handleSubmit = async values => {
    setIsLoading(true)
    await API.post('/owner/v1/login', values)
      .then(res => {
        if (res.data.status) {
          API.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.accessToken}`
          localStorage.setItem('token', res.data.data.accessToken)

          // Setup user all permission id information 
          localStorage.setItem(
            'all_permission_id',
            JSON.stringify(res.data.data.all_permission_institution_id)
          )

          // Setup user all assign id information 
          localStorage.setItem(
            'all_assign_id',
            JSON.stringify(
              res.data.data.all_assign_study_permission_institution_id
            )
          )

          localStorage.setItem('role_id', res.data.data.rold_id)
          
          localStorage.setItem('userID', res.data.data.user_id) // User_details_table_id
          localStorage.setItem('custom_user_id', res.data.data.custom_user_id) // Owner_custom_user_table_id

          NotificationMessage('success', 'Successfully Login')
          
          loginForm.resetFields()
          navigate('/studies') ; 

        } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch(err => NotificationMessage('warning','Network request failed', err.response.data.message))
    setIsLoading(false)
  }

  return (
    <div className='login-page-wrapper' >

      <div className='login-particular-option'>
        <img src={"https://media.istockphoto.com/id/1326234214/photo/two-mri-radiologists-sitting-in-the-control-room-and-operating-the-mri-scanner.webp?b=1&s=170667a&w=0&k=20&c=yzk8xDQ8jV9G2Y6C2WZ_8Gy7-wKX50kxKBqMAMWxmPw="} alt="" className='login-image'/>
      </div>

      <div className='login-particular-option'>

        <Row>
          <Col xs={24} md={24} lg={24} className='login-card-wrapper'>
            <Card className='login-card' bordered={false}>
              <Spin spinning={isLoading}>
                <img src={logo} alt='Logo' className={'signup-logo'} style={{marginBottom:"30px"}} />
                <Form
                  labelCol={{
                    span: 24
                  }}
                  wrapperCol={{
                    span: 24
                  }}
                  form={loginForm}
                  onFinish={handleSubmit}
                  autoComplete={'off'}
                >
                  <Form.Item
                    name='username'
                    label='Username'
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter username'
                      }
                    ]}
                  >
                    <Input
                      style={{ marginBottom: '0.5rem' }}
                      placeholder='Enter Username'
                    />
                  </Form.Item>
                  <Form.Item
                    name='password'
                    label='Password'
                    preserve={false}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please enter password'
                      }
                    ]}
                  >
                    <Input.Password
                      name='password'
                      autoComplete={'off'}
                      style={{ marginBottom: '0.5rem' }}
                      type='password'
                      placeholder='Enter Password'
                    />
                  </Form.Item>

                  <Form.Item className='m-0'>
                    <Button
                      type='primary'
                      htmlType='submit'
                      className='login-form-button'
                    >
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
                    
              {/* Copy right information  */}

              <div style={{marginLeft: "auto", marginRight: "auto", textAlign: "center", marginTop: "2rem", fontWeight: 600}}>
                Cloudimts copy rights @2024
              </div>
           
            </Card>
          </Col>
        </Row>

      </div>
    </div>
  )
}

export default Login
