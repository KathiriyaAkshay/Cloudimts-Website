import {
  LogoutOutlined,
  MailOutlined,
  UserOutlined,
  SyncOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Row,
  Space,
  Spin,
  Tooltip
} from "antd";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserDetailsContext } from "../hooks/userDetailsContext";
import CustomerSupportModal from "./CustomerSupportModal";
import { BiSupport } from "react-icons/bi";
import APIHandler from "../apis/apiHandler";
import NotificationMessage from "./NotificationMessage";
import UserImage from '../assets/images/ProfileImg.png';

const UserProfile = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [userData, setUserData] = useState({});
  const { userDetails, changeUserDetails } = useContext(UserDetailsContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [profileSpinner, setProfileSpinner] = useState(false);
  const [profileInformation, setProfileInformation] = useState({});
  const [joinedDate, setJoinedDate] = useState(null);

  const toggleProfileDrawer = (value) => {
    setShowDrawer((prev) => value);
  };

  const logoutHandler = async () => {

    let requestPayload = {};

    let responseData = await APIHandler("POST", requestPayload, 'user/v1/user-logout');

    if (responseData === false) {

      NotificationMessage("warning", "Network request failed");

    } else if (responseData['status'] === true) {

      NotificationMessage("success", "Logout successfully");

    } else {

      NotificationMessage("warning", responseData['message']);
    }

    changeUserDetails({});

    localStorage.clear();

    navigate("/login");

  };

  const ProfileInfomationOpener = async () => {

    setShowDrawer(true);

    setProfileSpinner(true);

    let responseData = await APIHandler("POST", {}, 'user/v1/user-profile');

    setProfileSpinner(false);

    if (responseData === false) {

      NotificationMessage("warning", "Network request failed");

    } else if (responseData['status'] === true) {

      setProfileInformation({ ...responseData['data'] });

      const originalDateString = responseData['data']?.joined_at;
      const originalDate = new Date(originalDateString);

      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, '0');
      const day = String(originalDate.getDate()).padStart(2, '0');
      const hours = String(originalDate.getHours()).padStart(2, '0');
      const minutes = String(originalDate.getMinutes()).padStart(2, '0');
      const seconds = String(originalDate.getSeconds()).padStart(2, '0');

      const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      setJoinedDate(formattedDateString);

    } else {

      NotificationMessage("warning", responseData['message']);
    }
  }

  return (
    <>
      <Row justify={"end"} align={"middle"} style={{ marginLeft: "auto" }}>

        {/* ==== User option ====  */}

        <Space size={15}>

          {/* ==== Support option icon ====  */}

          <Button
            onClick={() => setShow(true)}
            type="primary"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <BiSupport />
          </Button>

          {/* ==== User option icon ====  */}

          <Avatar
            style={{ marginRight: "30px" }}
            size="large"
            className="avatar"
            onClick={() => ProfileInfomationOpener()}
          >

            <UserOutlined />

          </Avatar>

        </Space>


        <CustomerSupportModal show={show} setShow={setShow} />

      </Row>

      <Drawer
        title={"User information"}
        placement="right"
        open={showDrawer}
        onClose={() => toggleProfileDrawer(false)}
        className="User-profile-drawer"
      >

        <Spin spinning={profileSpinner}>  

          {/* ==== Logout option ====  */}
          <div style={{ width: "100%", textAlign: "center" }}>
            <img src={UserImage} alt="user_profile" width="100px" height="100px" />

          </div>
          <div className="usermeta heading user-profile-div-first" >
              {profileInformation?.username}
          </div>

          <div className="usermeta heading user-profile-div-second" >
          <MailOutlined style={{color:"black",fontSize:"1.2rem"}}/> <span>{profileInformation?.email}</span>

          </div>
          <div className="usermeta heading user-profile-div-second"  >
          <Tooltip title="Joining Date">
          <SyncOutlined style={{color:"black",fontSize:"1.2rem"}}/> 
  </Tooltip>

          <span>{joinedDate}</span>

          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",marginTop:"2rem"}}>

            
          <Button
            onClick={() => logoutHandler()}
            type="primary"
            style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", width: "50%" }}
          >

            <LogoutOutlined />  
            Logout
          </Button>

          </div>

        </Spin>

      </Drawer>
    </>
  );
};

export default UserProfile;
