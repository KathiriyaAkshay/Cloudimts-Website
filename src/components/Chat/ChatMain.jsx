import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatBox from "./ChatBox";

const ChatMain = (props) => {
  const location = useLocation();
  const { state } = location;
  
  const [chatList, setChatList] = useState({
    chatListData: [],
    searchInputShow: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  console.log("UserId information =========>");
  console.log(props.userId);

  console.log("OrderId information ==========>");
  console.log(props.orderId);

  console.log("Searching value information ==========>");
  console.log(searchValue);

  console.log("State information ==========>");
  console.log(state);

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
          />
      </div>
    </>
  );
};

export default ChatMain;
