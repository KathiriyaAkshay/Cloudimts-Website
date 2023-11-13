import React from "react";
import ProfileImg from "../../assets/images/ProfileImg.png";
import search_icon from "../../assets/images/search_icon.png";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Input } from "antd";
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
      <img
        src={profile_image ? `${profile_image}` : ProfileImg}
        alt="person"
        className="Chat-user-image"
      ></img>

      <div className="header-user-info">
        <span>{restaurantName}</span>
      </div>
    </div>
  );
};

export default ChatHeader;
