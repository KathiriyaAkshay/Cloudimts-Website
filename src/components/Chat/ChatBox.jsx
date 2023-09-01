import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatMessanger from "./ChatMessanger";

const ChatBox = (props) => {
  const { chatList, loading, handleChatListData, userId, orderId, restaurantName, messages, setMessages, isChatModule } =
    props || {};
  const [onLineStatus, setOnlineStatus] = useState("");
  const [otherUserReferal, setOtherUserReferal] = useState("");
  // const profile = useSelector((state) => state?.basicProfileData);
  const location = useLocation();
  const navigate = useNavigate();
  const [chatPopUp, setChatPopUp] = useState({
    popUp: false,
    data: {},
  });

  const handleChatPopUp = (item) => {
    setChatPopUp({ ...chatPopUp, popUp: !chatPopUp?.popUp, data: item });
    // navigate(location.pathname, {});
    const data = item?.room?.split("_");
    // if (profile?.data?.referral) {
    //   setOtherUserReferal(data)
    // } else if (profile?.data?.referral === data[1] || !profile?.data?.referral === data[0]) {
    //   setOtherUserReferal(data[0])
    // }
    // getOnlineUser(`?user=${otherUserReferal}`)
    //   .then((res) => {
    //     setOnlineStatus(res?.data?.is_online)
    //   });
  };

  // const URL = `${process.env.REACT_APP_BASE_URL}`;

  // useEffect(() => {
  //   if(state?.chatPopUp) {
  //     handleChatPopUp()
  //     // setChatPopUp({ ...chatPopUp, popUp: !chatPopUp?.popUp, data:chatPopUp?.data });
  //     // navigate(location.pathname, {})
  //   }
  // },[state?.chatPopUp])

  // useEffect(() => {
  //   publishTopic()
  // })

  // const getDataFunc = (topic, msg) => {
  //   console.log("maghsjdj", msg, topic)
  // }

  // const publishTopic = () => {
  //   let val = PubSub.subscribe("my_dict", getDataFunc);
  //   console.log("hxbsdjhcb", val)
  // }

  return (
    <>
      <ChatMessanger
        chatDataInfo={chatPopUp?.data}
        onlineStatus={onLineStatus}
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
