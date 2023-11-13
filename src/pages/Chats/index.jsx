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

  useEffect(() => {
    changeBreadcrumbs([{ name: "Chats" }]);
  }, []);

  return (
    <div className="chat-module-div">
      <ChatLists
        setSeriesId={setSeriesId}
        setStudyId={setStudyId}
        setPersonName={setPersonName}
        studyId={studyId}
      />
      
      <div className="chat-data-div">
        {seriesId ? (
          <ChatMain
            userId={studyId}
            orderId={seriesId}
            restaurantName={personName}
            messages={messages}
            setMessages={setMessages}
            isChatModule={true}
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
