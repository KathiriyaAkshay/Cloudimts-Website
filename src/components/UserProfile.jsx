import {
  LogoutOutlined,
  MailOutlined,
  UserOutlined,
  SyncOutlined,
  DownloadOutlined, 
  UploadOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Row,
  Space,
  Spin,
  Tooltip,
  Upload, 
  message
} from "antd";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserDetailsContext } from "../hooks/userDetailsContext";
import CustomerSupportModal from "./CustomerSupportModal";
import { BiSupport } from "react-icons/bi";
import APIHandler from "../apis/apiHandler";
import NotificationMessage from "./NotificationMessage";
import UserImage from '../assets/images/ProfileImg.png';
import { uploadImage } from "../apis/studiesApi";

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

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {

    const formData = {
      image: fileList[0]
    } ; 

    try {
      
      let response = await uploadImage(formData) ; 
      let user_profile_image = response?.data?.image_url ; 
       
      let requestPayload = {"profile_image": user_profile_image} ; 
      let responseData = await APIHandler("POST", requestPayload, "user/v1/update-user-profile") ; 
  
      if (responseData === false){
  
        message.error("Network request failed") ; 
      
      } else if (responseData?.status === true){
  
        message.success("Update profile image successfully") ; 
        setFileList([]) ; 
        setProfileInformation({...profileInformation, user_profile_image: user_profile_image}) ; 
        
      } else {
  
        message.warning(responseData?.message) ; 
   
      }
    } catch (error) {
      
    }

  };

  const props = {
    multiple: false, 
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      if (fileList?.length >= 1){
        message.warning("You can only select one profile image at a time") ; 
      } else {
        setFileList([...fileList, file]);
      }
      return false;
    },

    fileList,
  };

  // Logout request option handler 
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

  // User information fetch handler 
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


          {/* ==== download option ==== */}
          <Tooltip title="Download App">
            <Button
              onClick={() => { navigate("/downloads") }}
              type="primary"
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <DownloadOutlined />
            </Button>
          </Tooltip>


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

          {/* User image  */}
          <div style={{ width: "100%", textAlign: "center" }}>
            <img src={profileInformation?.user_profile_image === null?UserImage:profileInformation?.user_profile_image} alt="user_profile" width="100px" height="100px" />
          </div>

          {/* Username information  */}
          <div className="usermeta heading user-profile-div-first" style={{ fontSize: "1rem" }}>
            {profileInformation?.username}
          </div>

          {/* Update profile image option input  */}
          <div style={{textAlign: "center", marginTop: "16px"}}>

            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Update Profile image</Button>
            </Upload>

            <Button
              type="primary"
              onClick={handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{
                marginTop: 16,
              }}
            >
              {uploading ? 'Uploading' : 'Update profile'}
            </Button>
          </div>


          {/* User emailaddress information  */}
          <div className="usermeta heading user-profile-div-second" >
            <MailOutlined style={{ color: "black", fontSize: "1.2rem" }} /> <span className="user-profile-information-span">{profileInformation?.email}</span>
          </div>

          {/* Account create time information  */}
          <div className="usermeta heading user-profile-div-second"  >

            <Tooltip title="Joining Date">
              <SyncOutlined style={{ color: "black", fontSize: "1.2rem" }} />
            </Tooltip>

            <span className="user-profile-information-span">{joinedDate}</span>

          </div>

          {/* User logout option  */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "2rem" }}>
            <Button
              type="primary"
              className="Logout-option-button"
              onClick={logoutHandler}
            >
              <LogoutOutlined />
              <span style={{ marginLeft: "10px" }}>Logout</span>
            </Button>

          </div>

        </Spin>

      </Drawer>
    </>
  );
};

export default UserProfile;
