import React, { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import ChatLists from "../../components/ChatLists";
import ChatMain from "../../components/Chat/ChatMain";
import { Empty } from "antd";

const Chats = () => {

  const { changeBreadcrumbs } = useBreadcrumbs();
  
  const [messages, setMessages] = useState([]);
  const [seriesId, setSeriesId] = useState(null);
  const [studyId, setStudyId] = useState(null);
  const [personName, setPersonName] = useState(null);
  const [urgentCase, setUrgentCase] = useState(null) ; 

  console.log("Main urgent case information value ============>");
  console.log(urgentCase);

  useEffect(() => {
    changeBreadcrumbs([{ name: "Chats" }]);
  }, []);

  return (
    <div className="chat-module-div">

      {/* ==== Chat room list division ====  */}

      <ChatLists
        setSeriesId={setSeriesId}
        setStudyId={setStudyId}
        setPersonName={setPersonName}
        studyId={studyId}
        setUrgentCase={setUrgentCase}
      />

      {/* ==== Chat Room data division ====  */}

      <div className="chat-data-div">
        {seriesId ? (
          <ChatMain
            userId={studyId}
            orderId={seriesId}
            restaurantName={personName}
            messages={messages}
            setMessages={setMessages}
            isChatModule={true}
            urgentCase = {urgentCase}
          />
        ) : (
          <div className="empty-chat-div">
            <Empty className="chat-empty" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
