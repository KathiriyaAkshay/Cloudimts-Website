import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import SingleChatMessanger from "./SingleChatMessanger";
import ChatMessangerFooter from "./ChatMessangerFooter";
import whiteback from "../../assets/images/whiteback.svg";
import Col from "../../assets/images/whitcol.svg";
import ChatHeader from "./ChatHeader";
import { Spin } from "antd";
import { chatSettingPopUp, getElapsedTime } from "../../helpers/utils";
import SettingPopup from "./SettingPopup";
import axios from "axios";

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
    setMessages, isChatModule
  } = props || {};

  const navigate = useNavigate();
  const location = useLocation();
  // const profile = useSelector((state) => state?.basicProfileData);
  // const dispatch = useDispatch();
  const userDetail = userProfileData;
  // const ownProfileData = profile?.data;
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
  const roomName = `${orderId}_${userId}`;
  //   originated === "profile"
  //     ? ownProfileData?.referral + "_" + userDetail?.referral
  //     : ownProfileData?.referral + "_" + userDetail?.referral_code;
  // const roomId = isHousemateChat
  //   ? userDetail?.group_id
  //   : chatDataInfo?.group_id;
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

  // const handleTabChange = (value) => {
  //   setValue(value);
  // };

  // useEffect(() => {
  //   (messages[messages?.length - 1]?.is_file ||
  //     messages[messages?.length - 1]?.is_doc) &&
  //     !messages[messages?.length - 1].hasOwnProperty("id") &&
  //     setTimeout(() => {
  //       handleAllChatHistory(true);
  //     }, [5000]);
  // }, [messages]);

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
      handleAllChatHistory(true);
      const ws = new WebSocket(
        `wss://demo.nordinarychicken.com/api/ws/secondhandchat/${roomName}/${userId}/`
      );

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        console.log("Received message:", event.data);
        handleAllChatHistory(false);
        // getOfferStatusHandler(productData.id, profile, setOffer);
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

  // const handleWebSocket = (type, data) => {
  //   let ws;
  //     if (data?.length) {
  //       ws = new WebSocket(
  //         `wss://demo.nordinarychicken.com/api/ws/` + 3_4 + `/5` + "/"
  //       );
  //     } else {
  //       ws = new WebSocket(
  //         `wss://demo.nordinarychicken.com/api/ws/` + 3_4 + `/5` + "/"
  //       );
  //     }
  //   ws.onopen = () => {
  //     console.log("Connection opened");
  //     setGallery({
  //       ...gallery,
  //       chatConnected: true,
  //     });
  //   };

  //   // Listening on ws new added messages
  //   ws.onmessage = (event) => {
  //     console.log("event", event);
  //     const data = JSON.parse(event.data);
  //     console.log("data", data);
  //     setMessages((_messages) => [..._messages, data]);
  //   };
  // };

  const handleAllChatHistory = async (webSocketConnect) => {
    webSocketConnect && setLoading(true);
    const headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk0MDg2OTcyLCJpYXQiOjE2OTE0OTQ5NzIsImp0aSI6ImJiYmQzMzA4Nzk1YzQ3ZGFiODJlMzY5MDUwMWYxMDk0IiwidXNlcl9pZCI6NX0.V7IKMP8RBC4WnXRfpKg2Gy4v4kbemCOc3rjiQS4MJi0",
    };
    await fetch(
      `https://demo.nordinarychicken.com/api/chat/shl_messages/?room_name=${roomName}&merchant_id=10`,
      { headers }
    )
      .then((res) => res.json())
      .then((data) => {
        const resData = data.data.find(
          (item) => item.date == moment().format("YYYYMMDD")
        ).messages;
        setMessages(resData);
        setLastSeen(data?.last_seen);
        // setChatDetails({
        //   ...intialData,
        //   singleChat: res?.data?.data[0]?.room,
        // });
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  // const sendMessage = () => {
  //   const uni_key = moment.utc(`${new Date().toJSON()}`) + ownProfileData?.id;
  //   setForwardMessage({ quoted: false });
  //   if (chatData) {
  //     ws.current.send(
  //       JSON.stringify({
  //         uni_key: uni_key,
  //         user: ownProfileData?.id,
  //         user2:
  //           chatDetails?.chatType === "group"
  //             ? ""
  //             : isHousemateChat
  //             ? userDetail?.co_tenant
  //             : userDetail?.id,
  //         message: chatData,
  //         room:
  //           chatDetails?.chatType === "group"
  //             ? roomId
  //             : messages?.length
  //             ? messages[0]?.room
  //             : roomName,
  //         is_group: chatDetails?.chatType === "group" ? true : false,
  //         is_file: imageStore?.length ? true : false,
  //         is_doc: fileStore?.length ? true : false,
  //         quoted_msg: forwardMessage?.quoted
  //           ? forwardMessage?.quotedMessage?.message
  //           : false,
  //         quoted_id: forwardMessage?.quoted
  //           ? forwardMessage?.quotedMessage?.uni_key
  //           : false,
  //         chat_type: originated === "profile" ? "user" : chatDetails?.chatType,
  //       })
  //     );
  //     setChatData("");
  //     setForwardMessage({ ...forwardMessage, quoted: false });
  //   }
  //   let formData = new FormData();
  //   if (imageStore?.length || fileStore?.length) {
  //     formData.append("uni_key", uni_key);
  //     imageStore?.length &&
  //       imageStore?.forEach((image) => {
  //         formData.append(`media_file`, image);
  //       });
  //     fileStore?.length &&
  //       fileStore?.forEach((docs) => {
  //         formData.append(`media_file`, docs);
  //       });

  //     if (chatDetails?.chatType === "group") {
  //       formData.append("group_message", true);
  //       formData.append("group_id", chatDataInfo?.group_id);
  //     } else {
  //       formData.append("chat_message", true);
  //       formData.append("room_name", chatDataInfo?.room);
  //     }
  //     // chatDetails?.chatType === "group"
  //     //   ? formData.append("group_message", true)
  //     //   formData.append("room_name", chatDataInfo?.room)
  //     //   : formData.append("chat_message", true)
  //     //   formData.append("room_name", chatDataInfo?.room)
  //     //   ;
  //     sendMediaOnMessage(formData)
  //       .then((res) => {
  //         const intialData = chatDetails;
  //         setImageStore([]);
  //         setFileStore([]);
  //         // getChatHistory(roomName)
  //         //   .then((res) => {
  //         //     setMessages(res?.data?.data);
  //         //     setLastSeen(res?.data?.last_seen);
  //         //     setChatDetails({
  //         //       ...intialData,
  //         //       singleChat: res?.data?.data[0]?.room,
  //         //     });
  //         //   })
  //         // setTimeout(() => {
  //         //   handleAllChatHistory(false);
  //         // }, [1000]);
  //       })
  //       .catch((err) => {
  //         setImageStore([]);
  //         setFileStore([]);
  //       });
  //   }
  // };

  const sendMessage = async () => {
    const uni_key = moment.utc(`${new Date().toJSON()}`) + "4";
    // setForwardMessage({ quoted: false });
    if (chatData) {
      ws1.send(
        JSON.stringify({
          message: chatData,
          user: userId,
          room_name: roomName,
          uni_key: moment.utc(`${new Date().toJSON()}`) + 5,
          quoted_msg: forwardMessage?.quoted
            ? forwardMessage?.quotedMessage?.message
            : false,
          quoted_id: forwardMessage?.quoted
            ? Number(forwardMessage?.quotedMessage?.uni_key)
            : false,
          is_quoted: forwardMessage?.quoted ? true : false,
          is_file: imageStore?.length ? true : false,
          is_doc: fileStore?.length ? true : false,
        })
      );
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
          formData = { ...formData, media_file: image };
        });
      fileStore?.length &&
        fileStore?.forEach((docs) => {
          // formData.append(`media_file`, docs);
          formData = { ...formData, media_file: docs };
        });

      if (chatDetails?.chatType === "group") {
        // formData.append("group_message", true);
        // formData.append("group_id", chatDataInfo?.group_id);
      } else {
        // formData.append("chat_message", true);
        // formData.append("room_name", roomName);
        formData = {
          ...formData,
          chat_message: "True",
          room_name: roomName,
          user: userId,
          is_file: "True",
        };
      }
      // chatDetails?.chatType === "group"
      //   ? formData.append("group_message", true)
      //   formData.append("room_name", chatDataInfo?.room)
      //   : formData.append("chat_message", true)
      //   formData.append("room_name", chatDataInfo?.room)
      //   ;
      console.log(formData);
      await axios
        .post(`https://demo.nordinarychicken.com/api/chat/media/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          handleAllChatHistory(false);
        })
        .catch((err) => console.log(err));
      setImageStore([]);
      setFileStore([]);
    }
    // let formData = new FormData();
    // if (imageStore?.length || fileStore?.length) {
    //   formData.append("uni_key", uni_key);
    //   imageStore?.length &&
    //     imageStore?.forEach((image) => {
    //       formData.append(`media_file`, image);
    //     });
    //   fileStore?.length &&
    //     fileStore?.forEach((docs) => {
    //       formData.append(`media_file`, docs);
    //     });

    //   if (chatDetails?.chatType === "group") {
    //     formData.append("group_message", true);
    //     formData.append("group_id", chatDataInfo?.group_id);
    //   } else {
    //     formData.append("chat_message", true);
    //     formData.append("room_name", chatDataInfo?.room);
    //   }
    //   // chatDetails?.chatType === "group"
    //   //   ? formData.append("group_message", true)
    //   //   formData.append("room_name", chatDataInfo?.room)
    //   //   : formData.append("chat_message", true)
    //   //   formData.append("room_name", chatDataInfo?.room)
    //   //   ;
    //   sendMediaOnMessage(formData)
    //     .then((res) => {
    //       const intialData = chatDetails;
    //       setImageStore([]);
    //       setFileStore([]);
    //       // getChatHistory(roomName)
    //       //   .then((res) => {
    //       //     setMessages(res?.data?.data);
    //       //     setLastSeen(res?.data?.last_seen);
    //       //     setChatDetails({
    //       //       ...intialData,
    //       //       singleChat: res?.data?.data[0]?.room,
    //       //     });
    //       //   })
    //       // setTimeout(() => {
    //       //   handleAllChatHistory(false);
    //       // }, [1000]);
    //     })
    //     .catch((err) => {
    //       setImageStore([]);
    //       setFileStore([]);
    //     });
    // }
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

  const handleSettingPopup = async (type, messageId, messageData) => {
    if (type === "Remove") {
      await axios
        .delete(
          `https://demo.nordinarychicken.com/api/chat/shl_messages/?uni_key=${messageId}`,
          {
            headers: {
              Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk0MDg2OTcyLCJpYXQiOjE2OTE0OTQ5NzIsImp0aSI6ImJiYmQzMzA4Nzk1YzQ3ZGFiODJlMzY5MDUwMWYxMDk0IiwidXNlcl9pZCI6NX0.V7IKMP8RBC4WnXRfpKg2Gy4v4kbemCOc3rjiQS4MJi0",
            },
          }
        )
        .then((res) => handleAllChatHistory(false))
        .catch((err) => console.log(err));
    } else if (type === "Forward") {
      setForwardMessage({
        popUp: true,
        forwardMessage: messageData?.message,
        media_file: messageData?.file,
      });
    } else if (type === "Quote") {
      setForwardMessage({ quotedMessage: messageData, quoted: true });
    } else if (type === "Copy") {
      setChatData(messageData?.message);
    }
    const add = [...description];
    const removed = add.filter((item) => item !== messageId);
    setDescription(removed);
  };

  const handleChatDetailsPopUp = () => {
    setChatDetails({
      ...chatDetails,
      detailPopUp: !chatDetails?.detailPopUp,
    });
  };

  // useEffect(() => {
  //   if(state?.chatPopUp) {
  //     setChatDetails({
  //       ...chatDetails,
  //       detailPopUp: !chatDetails?.detailPopUp,
  //     });
  //   }
  // },[state?.chatPopUp])

  // const handleMedialFile = () => {

  // }

  // const handleForwardMessage = (data) => {
  //   let files = [];
  //   forwardMessage?.media_file?.forEach((item) => files.push(item?.files));
  //   let payload = {
  //     group_ids: data?.hasOwnProperty("group_ids") && data?.group_ids,
  //     room_names: data?.hasOwnProperty("roomNames") && data?.roomNames,
  //     media_file: files,
  //     uni_key: moment.utc(`${new Date().toJSON()}`) + ownProfileData?.id,
  //     forwarded_msg: forwardMessage?.forwardMessage,
  //   };
  //   sendForwardMessage(payload)
  //     .then((res) => {
  //       toast.success("Message Forwarded...");
  //       setForwardMessage({ popUp: false });
  //     })
  //     .catch((res) => setForwardMessage({ popUp: false }));
  // };

  const handleSearchValue = (value) => {
    setForwardMessage({
      ...forwardMessage,
      chatSearchValue: value,
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

  // const handleUnReadMessage = () => {
  //   let payload
  //   chatDetails?.chatType === "user" ?
  //     payload = {
  //       room: messages[messages?.length - 1]?.room,
  //       time: messages[messages?.length - 1]?.date_added,
  //     } : payload = {
  //       group_id: roomId,
  //       time: messages[messages?.length - 1]?.created_at ? messages[messages?.length - 1]?.created_at : messages[messages?.length - 1]?.date_added,
  //     }
  //   sendUnseenMessages(payload)
  //     .then((res) => {
  //       isHousemateChat ?
  //         navigate('/chat/housemate', { state: { countValue1: true } })
  //         :
  //         navigate('/chat', { state: { countValue: true } })
  //     })
  //     .catch();
  // }

  return (
    <Spin spinning={loading}>
      <div
        className="modal fade show bgColor modal-scroll p-0"
        aria-modal="true"
        style={{ display: "block", background: "#1a2c3e" }}
      >
        <div className={`modal-dialog-centered chatfilewrap  ${isChatModule && "chat-module-width"}`}>
          <ChatHeader
            imgIcon={whiteback}
            background="#6D7993"
            colors="white"
            onLineStatus={props?.onlineStatus}
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
              // handleUnReadMessage()
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
            // chatSearch={true}
            chatSearchValue={forwardMessage?.chatSearchValue}
            handleSearchValue={handleSearchValue}
            value={value}
            chatSearchedResults={forwardMessage?.chatSearchedResults}
            handleSearchedMessageArrow={handleSearchedMessageArrow}
            searchIndex={forwardMessage?.searchIndex}
            chatConnected={gallery?.chatConnected}
            restaurantName={restaurantName}
            isChatModule={isChatModule}
          />
          <div className={`modal-content modal-chat-issue ${isChatModule && "modal-chat-position"}`}>
            <SingleChatMessanger
              emojiClick={emojiClick}
              messages={messages}
              ownProfileDataId={userId}
              handleSettingPopup={handleSettingPopup}
              description={description}
              chatSettingData={chatSettingData}
              classNames={isHousemateChat ? "isHousemateChat" : ""}
              searchedMessages={forwardMessage?.chatSearchValue}
              chatSearchedResults={forwardMessage?.chatSearchedResults}
              handleGalleryPopUp={handleGalleryPopUp}
              searchIndex={forwardMessage?.searchIndex}
            />
            {/* <div id={messages[messages?.length - 1]?.uni_key}></div> */}
            {forwardMessage?.quoted && (
              <div
                style={QuoteStyle}
                className="quotedMessage-container isHousemateChat-quote"
              >
                <div className="quoted-details">
                  <h3 className="quotedMessage-name">
                    {forwardMessage?.quotedMessage?.user_name}
                  </h3>
                  <span className="quotedMessage-message">
                    {forwardMessage?.quotedMessage?.message}
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
            />

            {openMenu && (
              <SettingPopup
                popupMenus={chatSettingPopUp}
                width={"106px"}
                handleMenu={handleMenu}
              />
            )}
            {/*
            {chatDetails?.detailPopUp && (
              <ChatDetails
                chatType={chatDetails?.chatType}
                userDetail={userDetail}
                chatDetails={chatDetails}
                handleAllChatHistory={handleAllChatHistory}
                handleChatDetailsPopUp={handleChatDetailsPopUp}
              />
            )}
            {forwardMessage?.popUp && (
              <ForwardMsgPopUp
                handleMangePopup={() => setForwardMessage({ popUp: false })}
                handleForwardMessage={handleForwardMessage}
                action={"SEND MESSAGE"}
              />
            )}
            {gallery?.popUp && (
              <FileGalleryPopUp
                setGallery={setGallery}
                activeIndex={gallery?.activeIndex}
                singleData={gallery?.data}
                gallery={gallery}
                galleryData={Array.isArray(gallery?.data) && gallery?.data}
              />
            )} */}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ChatMessanger;
