import React from "react";
import ProfileImg from "../../assets/images/ProfileImg.png";
import search_icon from "../../assets/images/search_icon.png";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Flex, Input, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
const style = {
  color: "white",
  fontWeight: "bold",
  mx: 1,
  fontSize: 30,
  marginLeft: "-15px",
};

const ChatHeader = (props) => {
  const {
    userDetail,
    originated,
    chatType,
    chatDetails,
    handleChatDetailsPopUp,
    value,
    restaurantName,
  } = props;

  const profile_image =
    originated === "profile"
      ? userDetail?.profile_image
      : chatType === "group"
        ? chatDetails?.groupChat?.img
        : userDetail?.profile_image || "";
  const name =
    originated === "profile"
      ? userDetail?.name
      : chatType === "group"
        ? chatDetails?.groupChat?.group_name
        : userDetail?.nickname || "";

  return (
    <div
      className="Chatbox-header"
      onClick={() => {
        value !== "2" && handleChatDetailsPopUp();
      }}
    >
      {/* <img
        src={profile_image ? `${profile_image}` : ProfileImg}
        alt="person"
        className="Chat-user-image"
      ></img> */}
      <div className="header-user-info">
        <Flex>

          <UserOutlined
            style={{
              fontSize: "30px", 
              color: "#1890ff"
            }}
          />

          <div style={{
            marginLeft: 20
          }}>
            <Tag color="#108ee9">
              {`Reference: ${restaurantName?.reference_id}`}
            </Tag>
            <Flex style={{
              marginTop: 3
            }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row', 
                  maxWidth: '500px', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis' 
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis', 
                    marginTop: "auto", 
                    marginBottom: "auto"
                  }}
                >
                  {restaurantName?.patient_id}
                </span>
                
                <span style={{
                  fontWeight: 600,
                  marginLeft: 5,
                  marginRight: 5
                }}>|</span>

                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis', 
                    marginTop: "auto", 
                    marginBottom: "auto"
                  }}
                >
                  {restaurantName?.patient_name}
                </span>
              </div>

            </Flex>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default ChatHeader;
