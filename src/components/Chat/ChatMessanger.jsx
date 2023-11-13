import React, { useState, useEffect, useRef, useContext } from "react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import SingleChatMessanger from "./SingleChatMessanger";
import ChatMessangerFooter from "./ChatMessangerFooter";
import whiteback from "../../assets/images/whiteback.svg";
import Col from "../../assets/images/whitcol.svg";
import ChatHeader from "./ChatHeader";
import { Spin } from "antd";
import { chatSettingPopUp, getElapsedTime } from "../../helpers/utils";
import axios from "axios";
import {
  deleteChatMessage,
  getInitialChatMessages,
  sendChatMessage,
  sendMediaChat,
} from "../../apis/studiesApi";
import { RoomDataContext } from "../../hooks/roomDataContext";

const ChatMessanger = (props) => {
  const {
    handleChatPopUp,
    userProfileData,
    chatDataInfo,
    originated,
    isHousemateChat,
    handleChatListData,
    userId,
    orderId,
    restaurantName,
    messages,
    setMessages,
    isChatModule,
  } = props || {};

  console.log("Is Chat module information =============>");
  console.log(isChatModule);

  const userDetail = userProfileData;

  const [layoutHeight, setLayoutHeight] = useState("71vh") ; 

  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emojiClick, setEmojiClick] = useState(false);
  const [chatData, setChatData] = useState("");
  const [active, setActive] = useState("1.1");
  const [value, setValue] = useState("1");
  const [lastSeen, setLastSeen] = useState("");
  const [chatDetails, setChatDetails] = useState({
    singleChat: "",
    groupChat: "",
    detailPopUp: false,
    chatType: isHousemateChat
      ? active === "1.1"
        ? "user"
        : "group"
      : chatDataInfo?.chatType,
  });
  const [forwardMessage, setForwardMessage] = useState({
    popUp: false,
    forwardMessage: "",
    quotedMessage: "",
    quoted: false,
    searchInput: false,
    chatSearchValue: "",
    chatSearchedResults: [],
    searchIndex: 0,
  });
  const [imageStore, setImageStore] = useState([]);
  const [fileStore, setFileStore] = useState([]);
  const [description, setDescription] = useState([]);
  const [ws1, setWs] = useState(null);
  const [gallery, setGallery] = useState({
    data: [],
    popUp: false,
    activeIndex: 0,
    chatConnected: false,
  });
  const user = localStorage.getItem("userID");
  const { roomID, setRoomID } = useContext(RoomDataContext);
  const roomName = `${orderId}/${user}/${userId}`;
  const QuoteStyle = isHousemateChat
    ? imageStore?.length < 4 && imageStore?.length
      ? { bottom: "172px" }
      : imageStore?.length
      ? { bottom: "266px" }
      : { bottom: "55px" }
    : imageStore?.length < 4 && imageStore?.length
    ? { bottom: "111px" }
    : imageStore?.length
    ? { bottom: "206px" }
    : { bottom: "-1px" };

  useEffect(() => {
    let id = messages?.length ? messages[messages?.length - 1]?.uni_key : 1;
    // messages?.length && document.getElementById(id).scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (forwardMessage?.chatSearchValue?.length) {
      setForwardMessage({
        ...forwardMessage,
        chatSearchedResults: messages?.filter((i) =>
          i.message
            .toUpperCase()
            ?.includes(forwardMessage?.chatSearchValue.toUpperCase())
        ),
      });
    } else {
      setForwardMessage({
        ...forwardMessage,
        chatSearchedResults: [],
        searchIndex: 0,
      });
    }
  }, [forwardMessage?.chatSearchValue]);

  useEffect(() => {
    
    if (orderId) {

      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/personal/${roomName}/`);

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {

        (JSON.parse(event.data).id != null ||
        
        JSON.parse(event.data).id != undefined) &&
          localStorage.setItem("roomID", JSON.parse(event.data).id);
        setRoomID((prev) =>
          JSON.parse(event.data).id != null ||
          JSON.parse(event.data).id != undefined
            ? JSON.parse(event.data).id
            : prev
        );
        handleAllChatHistory(
          true,
          JSON.parse(event.data).id != null ||
            JSON.parse(event.data).id != undefined
            ? true
            : false,
          JSON.parse(event.data)
        );
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setWs(ws);

      return () => {
        ws.close();
      };
    }
  }, [orderId]);

  const handleAllChatHistory = async (webSocketConnect, roomData, chatData) => {
    const room_id = localStorage.getItem("roomID");
    if (roomData) {
      webSocketConnect && setLoading(true);
      getInitialChatMessages({
        room_id,
      })
        .then((data) => {
          groupMessagesByDate(data.data?.chat);
          setLoading(false);
        })
        .catch((err) => console.log(err));

    } else if (!roomData) {
      if (chatData.payload.status == "new_chat") {

        const timestamp = chatData.payload.data.timestamp.split(" ")[0];
        const newMessage = messages.map((data) => {
          if (data.date == timestamp) {
            return {
              ...data,
              messages: [...data.messages, chatData.payload.data],
            };
          } else {
            return {
              ...data,
            };
          }
        });
        setMessages((prev) => {
          const currentDate = moment().format("YYYY-MM-DD");
          const existingData = prev.find((data) => data.date === timestamp);

          if (existingData) {
            // If a message with the same date already exists, update it
            return prev.map((data) =>
              data.date === timestamp
                ? {
                    ...data,
                    messages: [...data.messages, chatData.payload.data],
                  }
                : data
            );
          } else if (currentDate === timestamp) {
            // If no message with the same date exists and it's the current date, create a new entry
            return [
              ...prev,
              { date: timestamp, messages: [chatData.payload.data] },
            ];
          } else {
            // If no message with the same date exists and it's not the current date, return the previous state
            return prev;
          }
        });
      } else if (chatData.payload.status == "delete_chat") {
        setMessages((prev) =>
          prev
            .map((data) => ({
              ...data,
              messages: data.messages.filter(
                (message) => message.id != chatData.payload.data.id
              ),
            }))
            .filter((item) => item.messages.length > 0)
        );
      }
    }
  };

  function groupMessagesByDate(data) {
    const groupedMessages = data?.reduce((acc, message) => {
      const timestamp = message?.timestamp.split(" ")[0]; 
      if (!acc[timestamp]) {
        acc[timestamp] = [];
      }
      acc[timestamp].push(message);
      return acc;
    }, {});

    const formattedData = Object.keys(groupedMessages).map((date) => ({
      date,
      messages: groupedMessages[date],
    }));

    setMessages(formattedData);
  }

  const sendMessage = async () => {
    const uni_key = moment.utc(`${new Date().toJSON()}`) + "4";
    // setForwardMessage({ quoted: false });
    if (chatData) {
      const modifiedObj = {
        content: chatData,
        send_from_id: Number(user),
        room_name: orderId,
        media: "None",
        media_option: false,
        room_id: roomID,
        is_quoted: forwardMessage?.quoted ? true : false,
        quoted_message: forwardMessage?.quoted
          ? forwardMessage?.quotedMessage?.content
          : "",
        // uni_key: moment.utc(`${new Date().toJSON()}`) + 5,
        // quoted_msg: forwardMessage?.quoted
        //   ? forwardMessage?.quotedMessage?.message
        //   : false,
        // quoted_id: forwardMessage?.quoted
        //   ? Number(forwardMessage?.quotedMessage?.uni_key)
        //   : false,
        // is_quoted: forwardMessage?.quoted ? true : false,
        // is_file: imageStore?.length ? true : false,
        // is_doc: fileStore?.length ? true : false,
      };
      sendChatMessage(modifiedObj)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      // ws1.send(JSON.stringify(modifiedObj));
      setChatData("");
      setForwardMessage({ ...forwardMessage, quoted: false });
    }
    let formData = {};
    if (imageStore?.length || fileStore?.length) {
      formData = { uni_key: uni_key };
      // formData.append("uni_key", uni_key);
      imageStore?.length &&
        imageStore?.forEach((image) => {
          // formData.append(`media_file`, image);
          formData = { ...formData, media: image };
        });
      fileStore?.length &&
        fileStore?.forEach((docs) => {
          // formData.append(`media_file`, docs);
          formData = { ...formData, media: docs };
        });

      if (chatDetails?.chatType === "group") {
        // formData.append("group_message", true);
        // formData.append("group_id", chatDataInfo?.group_id);
      } else {
        // formData.append("chat_message", true);
        // formData.append("room_name", roomName);
        formData = {
          ...formData,
          media_option: "True",
          content: "None",
          send_from_id: Number(user),
          room_name: orderId,
          room_id: roomID,
          is_quoted: forwardMessage?.quoted ? true : "False",
          quoted_message: forwardMessage?.quoted
            ? forwardMessage?.quotedMessage?.content
            : "None",
        };
      }
      // chatDetails?.chatType === "group"
      //   ? formData.append("group_message", true)
      //   formData.append("room_name", chatDataInfo?.room)
      //   : formData.append("chat_message", true)
      //   formData.append("room_name", chatDataInfo?.room)
      //   ;
      console.log(formData);
      sendMediaChat(formData)
        .then((res) => {
          handleAllChatHistory(false);
        })
        .catch((err) => console.log(err));
      setImageStore([]);
      setFileStore([]);
    }
  };

  const onEmojiClick = (data) => {
    setChatData(chatData + data.emoji);
  };

  const handleChangeText = (e) => {
    setChatData(e.target.value);
  };

  const handleGroupChatIcon = () => {
    setOpenMenu(!openMenu);
  };
  const handleMenu = async (name) => {
    setOpenMenu(false);
    if (name === "Clear History") {
      await axios
        .post("https://demo.nordinarychicken.com/api/chat/shl_clear_chat/", {
          room_id: roomName,
        })
        .then((res) => {
          // handleAllChatHistory(true);
          setMessages([]);
        })
        .catch((err) => console.log(err));
    } else if (name === "Search") {
      setForwardMessage({
        ...forwardMessage,
        searchInput: !forwardMessage?.searchInput,
      });
    }
  };
  const handleEmoji = () => {
    setEmojiClick(!emojiClick);
  };

  const chatSettingData = (id) => {
    const add = [...description];
    if (!add.includes(id)) {
      if (add.length) {
        add.pop();
        add.push(id);
      } else {
        add.push(id);
      }
      setDescription(add);
    } else {
      const removed = add.filter((item) => item !== id);
      setDescription(removed);
    }
  };

  const handleChatDetailsPopUp = () => {
    setChatDetails({
      ...chatDetails,
      detailPopUp: !chatDetails?.detailPopUp,
    });
  };

  const handleGalleryPopUp = (data, index) => {
    setGallery({
      ...gallery,
      data: data,
      popUp: !gallery?.popUp,
      activeIndex: index,
    });
  };

  const handleSearchedMessageArrow = (type) => {
    if (type === "up") {
      setForwardMessage({
        ...forwardMessage,
        searchIndex:
          forwardMessage?.searchIndex ===
          forwardMessage?.chatSearchedResults?.length
            ? forwardMessage?.chatSearchedResults?.length
            : forwardMessage?.searchIndex + 1,
      });
    } else {
      setForwardMessage({
        ...forwardMessage,
        searchIndex:
          forwardMessage?.searchIndex === 1
            ? 1
            : forwardMessage?.searchIndex - 1,
      });
    }
  };


  return (
    <Spin spinning={loading}>
      <div className="Main-chat-data-division">
        <div style={{height: '86vh', overflowY: 'hidden'}}>

          {/* ==== Chat Header ====  */}
          <ChatHeader
            imgIcon={whiteback}
            background="#6D7993"
            colors="white"
            time={
              lastSeen
                ? getElapsedTime(new Date(lastSeen))
                : getElapsedTime(new Date(chatDataInfo?.last_seen))
            }
            imgIcon2={Col}
            chatType={chatDetails?.chatType}
            handleGroupChatIcon={handleGroupChatIcon}
            onClick={() => {
              ws.current?.close();
              setGallery({
                ...gallery,
                chatConnected: false,
              });
              handleChatPopUp();
              !isHousemateChat && handleChatListData();
            }}
            userDetail={userDetail}
            chatDetails={chatDetails}
            originated={originated}
            handleChatDetailsPopUp={handleChatDetailsPopUp}
            chatSearch={forwardMessage?.searchInput}
            chatSearchValue={forwardMessage?.chatSearchValue}
            value={value}
            chatSearchedResults={forwardMessage?.chatSearchedResults}
            handleSearchedMessageArrow={handleSearchedMessageArrow}
            searchIndex={forwardMessage?.searchIndex}
            chatConnected={gallery?.chatConnected}
            restaurantName={restaurantName}
            isChatModule={isChatModule}
          />
            <div className="User-chat-messages-division" style={{height: layoutHeight}}>

              <SingleChatMessanger
                emojiClick={emojiClick}
                messages={messages}
                ownProfileDataId={userId}
                description={description}
                chatSettingData={chatSettingData}
                classNames={isHousemateChat ? "isHousemateChat" : ""}
                searchedMessages={forwardMessage?.chatSearchValue}
                chatSearchedResults={forwardMessage?.chatSearchedResults}
                handleGalleryPopUp={handleGalleryPopUp}
                searchIndex={forwardMessage?.searchIndex}
              />

              {forwardMessage?.quoted && (
                <div
                  style={QuoteStyle}
                  className={`quotedMessage-container isHousemateChat-quote ${
                    isChatModule && "quotedMessage-container-position"
                  }`}
                >
                  <div className="quoted-details">
                    <span className="quotedMessage-message">
                      {forwardMessage?.quotedMessage?.content}
                    </span>
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "rgb(109, 121, 147)",
                      cursor: "pointer",
                    }}
                    onClick={() => setForwardMessage({ quoted: false })}
                  >
                    X
                  </div>
                </div>
              )}

            </div>

            <ChatMessangerFooter
              handleEmoji={handleEmoji}
              emojiClick={emojiClick}
              chatData={chatData}
              sendMessage={sendMessage}
              onEmojiClick={onEmojiClick}
              handleChangeText={handleChangeText}
              setImageStore={setImageStore}
              imageStore={imageStore}
              setForwardMessage={setForwardMessage}
              setFileStore={setFileStore}
              fileStore={fileStore}
              isChatModule={isChatModule}
              layoutHeight = {setLayoutHeight}
            />

        </div>

      </div>

    </Spin>
  );
};

export default ChatMessanger;
