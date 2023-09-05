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
    onClick,
    crossRight,
    background,
    time,
    handleGroupChatIcon,
    imgIcon2,
    userDetail,
    originated,
    chatType,
    chatDetails,
    handleChatDetailsPopUp,
    value,
    chatSearch,
    chatSearchValue,
    handleSearchValue,
    chatSearchedResults,
    handleSearchedMessageArrow,
    searchIndex,
    chatConnected,
    onLineStatus,
    restaurantName,
    isChatModule
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
    <div>
      <header
        style={
          background
            ? { backgroundColor: "#1a2c3e", display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px"}
            : { backgroundColor: "white" }
        }
      >
        <div className="container-fluid">
          {chatSearch ? (
            <>
              <div className="chatList-searchBox messanger-search">
                <div className="search-box-outer search-box-outer2">
                  <div className="search-box-inner">
                    <img src={search_icon} alt="searchicon" />
                    <div className="base-inner">
                      <Input
                        type="search" allowClear
                        placeholder="Search"
                        onChange={(e) => {
                          handleSearchValue(e?.target?.value);
                        }}
                        value={chatSearchValue}
                      />
                      {searchIndex}/{chatSearchedResults?.length}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              className="header-user"
              onClick={() => {
                value !== "2" && handleChatDetailsPopUp();
              }}
            >
              <img
                src={profile_image ? `${profile_image}` : ProfileImg}
                alt="person"
              ></img>
              <div className="header-user-info">
                <span>{restaurantName}</span>
                {/* <p>
                  {chatType === "group"
                    ? "Tap to view more info" : onLineStatus ?
                      <div className="online-status-data">
                        <div className="online-status"></div>
                        <p>online</p>
                      </div>
                      : time ? `Last Seen at ${time}` : ''}
                </p> */}
              </div>
            </div>
          )}
        </div>
        {chatSearch && (
          <div className="chat-search-dropDown">
            <MdArrowDropUp
              style={style}
              onClick={() => handleSearchedMessageArrow("up")}
            />
            <MdArrowDropDown
              style={style}
              onClick={() =>
                searchIndex > 0 && handleSearchedMessageArrow("down")
              }
            />
          </div>
        )}
        {/* <div className="chat-group-dropdown" style={{cursor: "pointer"}}>
          <img
            src={imgIcon2}
            alt="menuicon"
            onClick={() => {
            handleGroupChatIcon();
            }}
          />
        </div> */}
      </header>
    </div>
  );
};

export default ChatHeader;
