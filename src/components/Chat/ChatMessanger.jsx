import React, { useState, useEffect, useRef, useContext } from 'react'
import moment from 'moment'
import { useNavigate, useLocation } from 'react-router-dom'
import SingleChatMessanger from './SingleChatMessanger'
import ChatMessangerFooter from './ChatMessangerFooter'
import Col from '../../assets/images/whitcol.svg'
import ChatHeader from './ChatHeader'
import { Spin } from 'antd'
import { chatSettingPopUp, getElapsedTime } from '../../helpers/utils'
import axios from 'axios'
import {
  deleteChatMessage,
  getInitialChatMessages,
  sendChatMessage,
  sendMediaChat
} from '../../apis/studiesApi'
import { RoomDataContext } from '../../hooks/roomDataContext' ; 
import NotificationMessage from '../NotificationMessage' ; 
import PDFOptionImage from "../../assets/images/pdf.png" ; 
const WEBSOCKET_URL= import.meta.env.VITE_APP_SOCKET_BASE_URL;
const ChatMessanger = props => {
  const {
    handleChatPopUp,
    userProfileData,
    chatDataInfo,
    originated,
    isHousemateChat,
    userId,
    orderId,
    restaurantName,
    messages,
    setMessages,
    isChatModule,
    isDrawerOpen, 
    urgentCase, 
    referenceid
  } = props || {} 

  const userDetail = userProfileData

  const [layoutHeight, setLayoutHeight] = useState(null)

  useEffect(() => {
    if (isDrawerOpen) {
      setLayoutHeight('83vh')
    } else {
      setLayoutHeight('71vh')
    }
  }, []) ; 

  const [openMenu, setOpenMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emojiClick, setEmojiClick] = useState(false)
  const [chatData, setChatData] = useState('')
  const [active, setActive] = useState('1.1')
  const [value, setValue] = useState('1')
  const [chatDetails, setChatDetails] = useState({
    singleChat: '',
    groupChat: '',
    detailPopUp: false,
    chatType: isHousemateChat
      ? active === '1.1'
        ? 'user'
        : 'group'
      : chatDataInfo?.chatType
  })
  const [forwardMessage, setForwardMessage] = useState({
    popUp: false,
    forwardMessage: '',
    quotedMessage: '',
    quoted: false,
    searchInput: false,
    chatSearchValue: '',
    chatSearchedResults: [],
    searchIndex: 0
  })
  // CustomUser id information 
  const user = localStorage.getItem('custom_user_id') ; 
  
  const [imageStore, setImageStore] = useState([])
  const [fileStore, setFileStore] = useState([])
  const [description, setDescription] = useState([])
  const [ws1, setWs] = useState(null)
  const [gallery, setGallery] = useState({
    data: [],
    popUp: false,
    activeIndex: 0,
    chatConnected: false
  })
  
  const { roomID, setRoomID } = useContext(RoomDataContext)
  const roomName = `${orderId}/${user}/${userId}` ; 

  console.log("Room name -------------------");
  console.log(roomName);
  

  const QuoteStyle = isHousemateChat
  ? imageStore?.length < 4 && imageStore?.length
  ? { bottom: '172px' }
  : imageStore?.length
  ? { bottom: '266px' }
  : { bottom: '55px' }
  : imageStore?.length < 4 && imageStore?.length
  ? { bottom: '111px' }
  : imageStore?.length
  ? { bottom: '206px' }
  : { bottom: '-1px' } 
  
  const [quotedMessageContainer, setQuotedMessageContainer] = useState(false) ; 
  const [quotedMessageInfo, setQuotedMessageInfo] = useState({}) ; 
  const [deleteChat, setDeletChat] = useState(false) ; 

  // **** Reterive particular chat room history **** // 

  const handleAllChatHistory = async (webSocketConnect, roomData, chatData) => {
    const room_id = localStorage.getItem('roomID') ; 
    if (roomData) {
      webSocketConnect && setLoading(true)

      getInitialChatMessages({
        room_id
      })
        .then(res => {
          if (res.data.status) {
            groupMessagesByDate(res.data?.chat)
            setLoading(false) ; 

          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch(err =>
          NotificationMessage(
            'warning',
            'Network request failed',
            err.response.data.message
          )
        )

    } else if (!roomData) {

      if (chatData.payload.status == 'new_chat') {

        // ====== New Message handling from socket channel ========= // 

        const timestamp = chatData.payload.data.timestamp.split(' ')[0];  

        setMessages(prev => {
          const currentDate = moment().format('YYYY-MM-DD')
          const existingData = prev.find(data => data.date === timestamp)

          if (existingData) {
            return prev.map(data =>
              data.date === timestamp
                ? {
                    ...data,
                    messages: [...data.messages, chatData.payload.data]
                  }
                : data
            )
          } else if (currentDate === timestamp) { 
            return [
              ...prev,
              { date: timestamp, messages: [chatData.payload.data] }
            ]
          } else {
            return prev
          }
        })

        ScrollToBottom() ; 


      } else if (chatData.payload.status == 'delete_chat') {

        // Deelete message handling 

        setDeletChat(true) ; 

        setMessages(prev =>
          prev
            .map(data => ({
              ...data,
              messages: data.messages.filter(
                message => message.id != chatData.payload.data.id
              )
            }))
            .filter(item => item.messages.length > 0)
        )
      }

    }
  }

  useEffect(() => {
    let id = messages?.length ? messages[messages?.length - 1]?.uni_key : 1 ; 

    if (deleteChat){
      setDeletChat((prev) => !prev) ; 
    } else{
      
      ScrollToBottom() ; 
    }
  }, [messages])

  useEffect(() => {
    if (forwardMessage?.chatSearchValue?.length) {
      setForwardMessage({
        ...forwardMessage,
        chatSearchedResults: messages?.filter(i =>
          i.message
            .toUpperCase()
            ?.includes(forwardMessage?.chatSearchValue.toUpperCase())
        )
      })
    } else {
      setForwardMessage({
        ...forwardMessage,
        chatSearchedResults: [],
        searchIndex: 0
      })
    }
  }, [forwardMessage?.chatSearchValue])

  const [connection, setConnection] = useState(null) ; 

  // ========= Setup User socket connection ============== // 
  const UserChatSocketConnection = async () => {
    // Close existing connection if it's open
    if (connection && connection.readyState === WebSocket.OPEN) {
      connection.close(); // Close the existing connection
      console.log('Closed existing WebSocket connection');
    }
  
    // Create a new WebSocket connection
    const ws = new WebSocket(`${WEBSOCKET_URL}personal/${roomName}/`);
    setConnection(ws);
  
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id != null || data.id !== undefined) {
        setRoomID((prev) => (data.id != null || data.id !== undefined ? data.id : prev));
        localStorage.setItem('roomID', data.id);
      }
  
      handleAllChatHistory(
        true,
        data.id != null || data.id !== undefined ? true : false,
        data
      );
    };
  
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    setWs(ws);
  
    return () => {
      ws.close();
    };
  };
  
  // Handle window visibility event to reconnect the socket
  const [reloadValue, setReloadValue] = useState(0);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setReloadValue((prev) => prev + 1);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  useEffect(() => {
    if (orderId) {
      UserChatSocketConnection();
    }
  }, [orderId, reloadValue]);
  
  function groupMessagesByDate (data) {
   
    const groupedMessages = data?.reduce((acc, message) => {
      const timestamp = message?.timestamp.split(' ')[0]
      if (!acc[timestamp]) {
        acc[timestamp] = []
      }
      acc[timestamp].push(message)
      return acc
    }, {}) ; 

    const formattedData = Object.keys(groupedMessages).map(date => ({
      date,
      messages: groupedMessages[date]
    }))

    setMessages(formattedData)
  }

  // **** Send chat message in particular chat room **** // 
  const sendMessage = async () => {

    console.log("Room id information ------------------");
    console.log(localStorage.getItem("roomID"));
    
    console.log("Room name related informatioh ---------------");
    console.log(orderId);
    
    
    
    if (quotedMessageContainer){

      // Modified object information 
      let modifiedObj  = {}; 

      if (quotedMessageInfo?.media_option){
        
        modifiedObj = { 
          content: chatData,
          send_from_id: Number(user),
          room_name: orderId,
          media: '',
          media_option: false,
          room_id: localStorage.getItem("roomID"),  
          is_quoted: true,
          quoted_message: quotedMessageInfo?.media, 
          urgent_case: urgentCase,
          reference_id: referenceid

        } ;
        
      } else {
        
        modifiedObj = { 
          content: chatData,
          send_from_id: Number(user),
          room_name: orderId,
          media: '',
          media_option: false,
          room_id: localStorage.getItem("roomID"),  
          is_quoted: true,
          quoted_message: quotedMessageInfo?.content, 
          urgent_case: urgentCase , 
          reference_id: referenceid
        } ;
      }

      setChatData('') ; 
      setQuotedMessageContainer(false) ; 
      setQuotedMessageInfo(null) ; 

      sendChatMessage(modifiedObj)
        .then(res => {
          if (res.data.status) {
            // NotificationMessage('success', "Message send successfully")
          } else {
            // NotificationMessage(
            //   'warning',
            //   'Network request failed',
            //   res.data.message
            // )
          }
        })
        .catch(err =>
          console.log("Failed to send chat media")
        )
      setForwardMessage({ ...forwardMessage, quoted: false }) ; 
      ScrollToBottom() ; 
      
    } else {
      
      let formData = {}
      
      if (imageStore?.length || fileStore?.length) {

        // Create unique key 

        const uni_key = Date.now() + '_' + Math.floor(Math.random() * 1000);
        formData = { uni_key: uni_key } 
        imageStore?.length &&
          imageStore?.forEach(image => {
            formData = { ...formData, media: image }
          })
        fileStore?.length &&
          fileStore?.forEach(docs => {
            formData = { ...formData, media: docs }
          })

        // Send media message payload 
  
        formData = {
          ...formData,
          media_option: 'True',
          content: chatData,
          send_from_id: Number(user),
          room_name: orderId,
          room_id: localStorage.getItem("roomID"),
          is_quoted: 'False',
          quoted_message: "", 
          urgentCase: urgentCase, 
          reference_id: referenceid
        }
  
        sendMediaChat(formData)
          .then(res => {
            if (res.data.status) {
              handleAllChatHistory(false)
            } else {
              NotificationMessage(
                'warning',
                'Network request failed',
                res.data.message
              )
            }
          })
          .catch(err =>
            NotificationMessage(
              'warning',
              'Network request failed',
              err.response.data.message
            )
          )
        setImageStore([]) ; 
        setFileStore([]) ; 
  
      }  else {
        
        if (chatData) {
  
          let modifiedObj  = {}; 
    
          modifiedObj = { 
            content: chatData,
            send_from_id: Number(user),
            room_name: orderId,
            media: '',
            media_option: false,
            room_id: localStorage.getItem("roomID"),
            is_quoted: false,
            quoted_message: '', 
            urgent_case: urgentCase, 
            reference_id: referenceid
          } ;

          setChatData('') ; 
          setQuotedMessageContainer(false) ; 
          setQuotedMessageInfo(null) ; 
    
          sendChatMessage(modifiedObj)
            .then(res => {
              if (res.data.status) {
                // NotificationMessage('success', "Message send successfully")
              } else {
                NotificationMessage(
                  'warning',
                  'Network request failed',
                  res.data.message
                )
              }
            })
            .catch(err =>
              NotificationMessage(
                'warning',
                'Network request failed',
                err.response.data.message
              )
            )
          setForwardMessage({ ...forwardMessage, quoted: false }) ; 
    
        } 
      }

    }
  }

  const ScrollToBottom = () => {
    var scrollingDiv = document.getElementById("user-all-chat-main-division");
    scrollingDiv.scrollTop = scrollingDiv.scrollHeight;
  }

  const onEmojiClick = data => {
    setChatData(chatData + data.emoji)
  }

  const handleChangeText = e => {
    setChatData(e.target.value)
  }

  const handleGroupChatIcon = () => {
    setOpenMenu(!openMenu)
  }


  const handleEmoji = () => {
    setEmojiClick(!emojiClick)
  }

  const chatSettingData = (id, item, option) => {

    if (option === "reply"){
      
      setQuotedMessageContainer(true) ; 
      setQuotedMessageInfo({...item}) ; 

    } else{
      setDeletChat(true) ; 
      deleteChatMessage({chat_id: id, room_name: orderId})
        .then(response => {
          NotificationMessage("success", "Delete message successfully") ; 
        })  
        .catch(error => {
          setDeletChat(false); 
          NotificationMessage("warning", "Network request failed", "Failed to delet chat") ; 
        })
    }
  };

  const handleChatDetailsPopUp = () => {
    setChatDetails({
      ...chatDetails,
      detailPopUp: !chatDetails?.detailPopUp
    })
  }

  const handleGalleryPopUp = (data, index) => {
    setGallery({
      ...gallery,
      data: data,
      popUp: !gallery?.popUp,
      activeIndex: index
    })
  }


  return (
    <Spin spinning={loading}>
      <div className='Main-chat-data-division'>
        <div
          style={{
            height: isDrawerOpen ? '99vh' : '86vh',
            overflowY: 'hidden',
            overflowX: 'hidden'
          }}
        >
          {/* ==== Chat header information ====  */}

          <ChatHeader
            background='#6D7993'
            colors='white'
            imgIcon2={Col}
            handleGroupChatIcon={handleGroupChatIcon}
            userDetail={userDetail}
            chatDetails={chatDetails}
            originated={originated}
            handleChatDetailsPopUp={handleChatDetailsPopUp}
            value={value}
            restaurantName={restaurantName}
            isChatModule={isChatModule}
          />

          <div
            className='User-chat-messages-division'
            style={{ height: layoutHeight }}
          >
            <SingleChatMessanger
              emojiClick={emojiClick}
              messages={messages}
              ownProfileDataId={userId}
              description={description}
              chatSettingData={chatSettingData}
              classNames={isHousemateChat ? 'isHousemateChat' : ''}
              searchedMessages={forwardMessage?.chatSearchValue}
              chatSearchedResults={forwardMessage?.chatSearchedResults}
              handleGalleryPopUp={handleGalleryPopUp}
              searchIndex={forwardMessage?.searchIndex}
            />

            {/* ==== Quoted message information division ====  */}

            {quotedMessageContainer && 

              <div
                style={QuoteStyle}
                className={`quotedMessage-container isHousemateChat-quote ${
                  isChatModule && 'quotedMessage-container-position'
                }`}
              >
                <div className='quoted-details'>

                  {quotedMessageInfo?.media_option ?<>

                    {quotedMessageInfo?.media.includes(".pdf") ? <>
                  
                      <div className='quoted-document-option-division'>
                        <img className='quoted_message_media_image' src={PDFOptionImage}/>
                        <div>{quotedMessageInfo?.media?.split(".")[0]}</div>
                        <div>{quotedMessageInfo?.content}</div>
                      </div>  
                    </>:<>
                      <div className='quoted-document-option-division'>
                        <img className='quoted_message_media_image' src={quotedMessageInfo?.media}/>
                        <div>{quotedMessageInfo?.content}</div>
                      </div>  
                    </>}
                  
                  </>:<>
                  
                    <span className='quotedMessage-message'>
                      {quotedMessageInfo?.content}
                    </span>
                  
                  </>}

                
                </div>
                
                <div
                  style={{
                    fontWeight: '600',
                    color: 'rgb(109, 121, 147)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {setForwardMessage({ quoted: false }); setQuotedMessageContainer(false) ; }}
                >
                  X
                </div>

              </div>
            }


          </div>

          {/* ==== Chat message footer ====  */}

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
            layoutHeight={setLayoutHeight}
            isDrawerOpen={isDrawerOpen}
            isQuotedMessage = {quotedMessageContainer}
          />

        </div>

      </div>
    </Spin>
  )
}

export default ChatMessanger
