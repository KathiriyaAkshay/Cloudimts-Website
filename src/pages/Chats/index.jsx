import React, { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import ChatLists from "../../components/ChatLists";
import ChatMain from "../../components/Chat/ChatMain";

const Chats = () => {
  const { changeBreadcrumbs } = useBreadcrumbs();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    changeBreadcrumbs([{ name: "Chats" }]);
  }, []);

  return (
    <div className="chat-module-div">
      <ChatLists />
      <div className="chat-data-div">
      <ChatMain
        userId={16123456}
        orderId={16120934}
        restaurantName={"Person"}
        messages={messages}
        setMessages={setMessages}
        isChatModule={true}
      />
      </div>
    </div>
  );
};

export default Chats;
