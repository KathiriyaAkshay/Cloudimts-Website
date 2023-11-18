import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Spin,
  Tabs,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import API from "../../apis/getApi";
import NotificationMessage from "../../components/NotificationMessage";
import { useContext, useEffect, useState } from "react";
import Typography from "antd/es/typography/Typography";
import logo from "../../assets/images/Imageinet-logo.png";
import { UserDetailsContext } from "../../hooks/userDetailsContext";

const Login = () => {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const { userDetails, changeUserDetails } = useContext(UserDetailsContext);


  const handleSubmit = async (values) => {
    setIsLoading(true);
    await API.post("/owner/v1/login", values)
      .then((res) => {
        
        console.log("Login data information ========>");
        console.log(res.data.data);

        localStorage.setItem("token", res.data.data.accessToken);
        
        localStorage.setItem(
          "all_permission_id",
          JSON.stringify(res.data.data.all_permission_institution_id)
        );
        
        localStorage.setItem(
          "all_assign_id",
          JSON.stringify(
            res.data.data.all_assign_study_permission_institution_id
          )
        );

        localStorage.setItem("userID", res.data.data.user_id);
        
        localStorage.setItem("role_id", res.data.data.rold_id);
            
        localStorage.setItem("custom_user_id", res.data.data.custom_user_id) ; 
        
        NotificationMessage("success", "Successfully Log In");
      
        loginForm.resetFields();

        navigate("/institutions");
      
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
    setIsLoading(false);
  };

  return (
    <div className="login-page-wrapper">
      <Row>
        <Col xs={24} md={24} lg={24} className="login-card-wrapper">
          <Card className="login-card" bordered={false}>
            <Spin spinning={isLoading}>
              <img src={logo} alt="Logo" className={"signup-logo"} />
              <Divider style={{ margin: "24px 0 12px" }} />
              <Row className="card-header" style={{ margin: 0 }}>
                <h2>
                  {window.location.pathname === "/admin/login"
                    ? "Admin Login"
                    : "User Login"}
                </h2>
              </Row>
              <Form
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                form={loginForm}
                onFinish={handleSubmit}
                autoComplete={"off"}
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please enter username",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: "0.5rem" }}
                    placeholder="Enter Username"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  preserve={false}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please enter password",
                    },
                  ]}
                >
                  <Input.Password
                    name="password"
                    autoComplete={"off"}
                    style={{ marginBottom: "0.5rem" }}
                    type="password"
                    placeholder="Enter Password"
                  />
                </Form.Item>
                <div className="display-flex-between mb">
                  <Checkbox name={"rememberMe"}>Remember me</Checkbox>
                  <Typography className="login-text-link">
                    Forgot Password?
                  </Typography>
                </div>

                <Form.Item className="m-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
