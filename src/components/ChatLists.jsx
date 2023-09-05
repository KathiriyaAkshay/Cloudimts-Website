import React, { useEffect, useState } from "react";
import ProfileImage from "../assets/images/ProfileImg.png";
import { Badge, Divider, Tag, Typography } from "antd";
import { getAllChatList } from "../apis/studiesApi";

const ChatLists = ({ setSeriesId, setStudyId, setPersonName }) => {
  const [chatListData, setChatListData] = useState([]);
  useEffect(() => {
    retrieveChatListData();
  }, []);

  const retrieveChatListData = () => {
    getAllChatList({
      current_timestamp: Date.now(),
      page_number: 1,
      page_size: 10,
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          room_id: data.room.id,
          name: `${data.room.study.patient.patient_id} | ${data.room.study.patient.patient_name}`,
          modality: data.room.study.modality,
          status: data.room.study.status,
          urgent_case: data.room.study.urgent_case,
          study_id: data.room.study.id,
          series_id: data.room.study.series_id,
          profile: ProfileImage,
        }));
        setChatListData(resData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="chat-list-main-div">
      <div style={{ padding: "10px 0px 0px 0px" }}>
        <Typography
          className="chat-list-name"
          style={{ fontSize: "20px", textAlign: "center" }}
        >
          Chats
        </Typography>
        <Divider
          style={{
            margin: "10px 0px",
            borderBlockStart: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        />
      </div>
      {chatListData?.map((data) => (
        <Badge.Ribbon
          text={"Urgent"}
          color="red"
          style={!data.urgent_case && { display: "none" }}
        >
          <div
            key={data.study_id}
            className="chat-list-div"
            onClick={() => {
              setSeriesId(data.series_id);
              setStudyId(data.study_id);
              setPersonName(data.name)
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img src={data.profile} alt={data.name} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Typography className="chat-list-name">{data.name}</Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <Typography
                    className="chat-list-name"
                    style={{ fontSize: "12px" }}
                  >
                    {data.modality}
                  </Typography>
                  <Tag color="success" style={{ fontWeight: "600" }}>
                    {data.status}
                  </Tag>
                </div>
              </div>
            </div>
            {/* <Badge count={data.unreadMessage} showZero color="#1677ff" /> */}
          </div>
          <Divider
            style={{
              margin: "10px 0px",
              borderBlockStart: "1px solid rgba(255, 255, 255, 0.4)",
            }}
          />
        </Badge.Ribbon>
      ))}
    </div>
  );
};

export default ChatLists;
