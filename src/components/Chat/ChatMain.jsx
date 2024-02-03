import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatBox from "./ChatBox";

const ChatMain = (props) => { 

  const [chatList, setChatList] = useState({
    chatListData: [],
    searchInputShow: false,
  });
  
  const [loading, setLoading] = useState(false);
  const handleChatListData = () => {};
  
  return (
    <>
      <div className="Chatbox-container">
          
        <ChatBox
          chatList={chatList}
          loading={loading}
          handleChatListData={handleChatListData}
          userId={props.userId}
          orderId={props.orderId}
          restaurantName={props.restaurantName}
          messages={props.messages}
          setMessages={props.setMessages}
          isChatModule={props.isChatModule}
          isDrawerOpen = {props.drawerValue}
          urgentCase = {props.urgentCase}
          referenceid = {props.referenceid}
        />

      </div>
    </>
  );
};

export default ChatMain;
