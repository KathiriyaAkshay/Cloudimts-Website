import {
  LogoutOutlined,
  MailOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../apis/getApi";
import { UserDetailsContext } from "../hooks/userDetailsContext";
import { BsPinMapFill } from "react-icons/bs";
import { omit } from "lodash";
import NotificationMessage from "./NotificationMessage";

const UserProfile = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState({});
  const { userDetails, changeUserDetails } = useContext(UserDetailsContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form] = Form.useForm();

  // useEffect(() => {
  //   setLoggedUser({
  //     userName: localStorage.getItem("name"),
  //     email: localStorage.getItem("email"),
  //   });
  //   API.get("/users/me", { headers: { Authorization: token } })
  //     .then((res) => setUserData(res.data.data))
  //     .catch((err) => console.log(err));
  //   setRole(localStorage.getItem("role"));
  // }, []);

  const adminDataHandler = async (values) => {
    const resData = omit(values, "confirmPassword");
    await API.patch(
      `/users/${userData.user.id}`,
      { ...resData },
      { headers: { Authorization: token } }
    )
      .then((res) => {
        NotificationMessage("success", "Password Updated Successfully");
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((err) => console.log(err));
  };

  const toggleProfileDrawer = (value) => {
    setShowDrawer((prev) => value);
  };

  const logoutHandler = () => {
    changeUserDetails({});
    localStorage.clear();
    navigate("/login");
  };

  const location = useLocation();

  const drawerTitle = (
    <Row>
      <Col span={24} className="text-center drawer-column">
        <Avatar
          size={120}
          style={{ fontSize: "48px", margin: "10px" }}
          onClick={() => {
            toggleProfileDrawer(true);
          }}
        >
          {userData?.user?.first_name + " " + userData?.user?.last_name}
        </Avatar>
        <span className="usermeta heading">
          {userData?.user?.first_name + " " + userData?.user?.last_name}
        </span>

        <span className="usermeta">
          <Space>
            <MailOutlined className="icon" />
            {userData?.user?.email ? userData.user.email : "-"}
          </Space>
        </span>
      </Col>
    </Row>
  );

  const handleOk = () => {
    form.submit();
  };

  return (
    <Row justify={"end"} align={"middle"} style={{ marginLeft: "auto" }}>
      <Space size={15}>
        <Button
          onClick={() => logoutHandler()}
          className="sign-out-btn ant-btn-link"
        >
          <LogoutOutlined />
          <span>Log Out</span>
        </Button>
        <Avatar
          style={{ marginRight: "30px" }}
          size="large"
          className="avatar"
          onClick={() => {
            toggleProfileDrawer(true);
          }}
        >
          user
        </Avatar>
      </Space>
      <Drawer
        title={drawerTitle}
        placement="right"
        open={showDrawer}
        onClose={() => toggleProfileDrawer(false)}
      >
        <Button
          type="primary"
          className="view-profile-btn"
          onClick={() => {
            navigate("/merchant/edit");
            toggleProfileDrawer(false);
          }}
        >
          View Profile
        </Button>
        {role === "superadmin" && (
          <Button
            type="primary"
            className="view-profile-btn mt"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Change Password
          </Button>
        )}
        {/* <Row>
          
          <Col xs={24} sm={24} md={24} lg={24} className="mt">
           <Typography><ShopOutlined /> {userData?.restaurant?.restaurant_name}</Typography>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} className="mt">
            <Typography><BsPinMapFill/>   {userData?.restaurant?.stall_address}</Typography>
          
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} className="mt">
           <Typography><SafetyCertificateOutlined /> {userData?.restaurant?.uen_number}</Typography>
          </Col>
        
        </Row> */}
      </Drawer>
      <Modal
        title="Reset Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
      >
        <Form
          name="resetForm"
          // labelCol={{ span: 24 }}
          // wrapperCol={{ span: 24 }}
          form={form}
          onFinish={adminDataHandler}
          layout="vertical"
          className="newTaxForm"
          onKeyPress={(event) => {
            if (event.which === (13 | "Enter")) {
              event.preventDefault();
            }
          }}
          scrollToFirstError={{
            behavior: "smooth",
            scrollMode: "always",
            block: "center",
          }}
        >
          <Col lg={24} md={24} sm={24}>
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                {
                  whitespace: true,
                  required: true,
                  message: "Please enter password",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                autoComplete="off"
                name="password"
                style={{ marginBottom: "0.5rem" }}
                placeholder="Enter New Password"
              />
            </Form.Item>
          </Col>

          <Col lg={24} md={24} sm={24}>
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              rules={[
                {
                  whitespace: true,
                  required: true,
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
              dependencies={["password"]}
              hasFeedback
            >
              <Input.Password
                autoComplete="off"
                name="confirmPassword"
                style={{ marginBottom: "0.5rem" }}
                placeholder="Enter Confirm Password"
              />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </Row>
  );
};

export default UserProfile;
