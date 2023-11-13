import React, { useState } from "react";
import ChatMessanger from "./ChatMessanger";

const ChatBox = (props) => {
  
  const {
    handleChatListData,
    userId,
    orderId,
    restaurantName,
    messages,
    setMessages,
    isChatModule,
  } = props || {};
  
  const [chatPopUp, setChatPopUp] = useState({
    popUp: false,
    data: {},
  });

  const handleChatPopUp = (item) => {
    setChatPopUp({ ...chatPopUp, popUp: !chatPopUp?.popUp, data: item });
  };

  return (
    <>
      <ChatMessanger
        chatDataInfo={chatPopUp?.data}
        originated={"chat"}
        handleChatPopUp={handleChatPopUp}
        userProfileData={chatPopUp?.data?.user}
        handleChatListData={handleChatListData}
        userId={userId}
        orderId={orderId}
        restaurantName={restaurantName}
        messages={messages}
        setMessages={setMessages}
        isChatModule={isChatModule}
      />
    </>
  );
};

export default ChatBox;
