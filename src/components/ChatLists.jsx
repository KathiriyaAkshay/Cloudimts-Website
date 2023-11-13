import React, { useEffect, useState } from "react";
import ProfileImage from "../assets/images/ProfileImg.png";
import UrgentCase from "../assets/images/urgentCase.png" ; 
import NormalCase from "../assets/images/normalCase.png"
import { Badge, Divider, Tag, Typography } from "antd";
import { getAllChatList } from "../apis/studiesApi";

const ChatLists = ({ setSeriesId, setStudyId, setPersonName, studyId }) => {
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

        console.log("Chat response data information ==========>");
        console.log(resData);

        setChatListData([...resData, ...resData]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="chat-list-main-div">
      <div>
        <div className="chat-list-title-div">
          <Typography
            className="chat-list-name"
            style={{ fontSize: "16px", color: "#FFFFFF" }}
          >
            Chats
          </Typography>
        </div>
        <Divider
          style={{
            margin: "0px 0px",
            borderBlockStart: "1px solid rgba(255, 255, 255, 0.4)",
          }}
        />
      </div>
      <div className="all-chat-list">
        {chatListData?.map((data) => (
          <>
            <div
              key={data.study_id}
              className={`chat-list-div ${
                studyId == data.study_id && `chat-list-div-active`
              }`}
              onClick={() => {
                setSeriesId(data.series_id);
                setStudyId(data.study_id);
                setPersonName(data.name);
              }}
            >
              <div className="study-chat-userdata">
                
                {data.urgent_case ?<>
                  <img src={UrgentCase} alt={data.name} className="study-chat-image"/>
                </>:<>
                  <img src={NormalCase} alt={data.name} className="study-chat-image"/>
                </>}
                
                <div className="study-chat-data">

                  <Typography className="chat-list-name">{data.name}</Typography>

                  <div className="study-description-data">

                    <Typography
                      className="particular-study-chat-description"
                      style={{ fontSize: "12px" }}
                    >
                      <span style={{color: "#A6A6A6", fontWeight: 600}}>Modality - </span>{data.modality}

                    </Typography>
                    
                    <Typography
                      className="particular-study-chat-description"
                      style={{ fontSize: "12px" }}
                    >
                      <span style={{color: "#A6A6A6", fontWeight: 600}}>Status - </span>{data.status}

                    </Typography>

                    <Typography
                      className="particular-study-chat-description"
                      style={{ fontSize: "12px" }}
                    >
                      <span style={{color: "#A6A6A6", fontWeight: 600}}>Latest chat - </span>{data.status}

                    </Typography>
                                  
                  </div>
                
                </div>

              </div>

            </div>  
          </>
        ))}
      </div>
    </div>
  );
};

export default ChatLists;
