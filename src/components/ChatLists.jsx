import React from "react";
import ProfileImage from "../assets/images/ProfileImg.png";
import { Badge, Divider, Typography } from "antd";

const ChatLists = () => {
  const dummyData = [
    {
      name: "Harsh",
      unreadMessage: "2",
      profile: ProfileImage,
      key: 1,
    },
    {
      name: "Keyur",
      unreadMessage: "3",
      profile: ProfileImage,
      key: 2,
    },
    {
      name: "Ava",
      unreadMessage: "0",
      profile: ProfileImage,
      key: 3,
    },
    {
      name: "Adam",
      unreadMessage: "4",
      profile: ProfileImage,
      key: 4,
    },
    {
      name: "Sarah",
      unreadMessage: "0",
      profile: ProfileImage,
      key: 5,
    },
    {
      name: "Emily",
      unreadMessage: "1",
      profile: ProfileImage,
      key: 6,
    },
    {
      name: "Daniel",
      unreadMessage: "5",
      profile: ProfileImage,
      key: 7,
    },
  ];

  return (
    <div className="chat-list-main-div">
      <div style={{padding: "10px 0px 0px 0px"}}>
        <Typography className="chat-list-name" style={{ fontSize: "20px", textAlign: "center" }}>
          Chats
        </Typography>
        <Divider
          style={{
            margin: "10px 0px",
            borderBlockStart: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        />
      </div>
      {dummyData.map((data) => (
        <>
          <div key={data.key} className="chat-list-div">
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img src={data.profile} alt={data.name} />
              <Typography className="chat-list-name">{data.name}</Typography>
            </div>
            <Badge count={data.unreadMessage} showZero color="#1677ff" />
          </div>
          <Divider
            style={{
              margin: "10px 0px",
              borderBlockStart: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          />
        </>
      ))}
    </div>
  );
};

export default ChatLists;
