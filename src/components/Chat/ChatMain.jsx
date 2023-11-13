import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatBox from "./ChatBox";

const ChatMain = (props) => {
  const location = useLocation();
  const { state } = location;
  const [openMenu, setOpenMenu] = useState(false);
  const [value, setValue] = useState("1");
  const [chatList, setChatList] = useState({
    chatListData: [],
    searchInputShow: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (searchValue) {
      setChatList({
        ...chatList,
        chatListData: [...(chatList?.chatListData || [])].filter((item) => {
          if (item?.chatType === "group") {
            return item?.group_name.includes(searchValue);
          } else {
            return item?.user?.nickname.includes(searchValue);
          }
        }),
      });
    } else {
      value === "1" && handleChatListData();
    }
  }, [searchValue, state]);

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
