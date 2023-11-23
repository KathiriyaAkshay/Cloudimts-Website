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

const ChatMessanger = props => {
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
    isDrawerOpen, 
    urgentCase
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
  const roomName = `${orderId}/${user}/${userId}`
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

  useEffect(() => {
    let id = messages?.length ? messages[messages?.length - 1]?.uni_key : 1 ; 
    ScrollToBottom() ; 
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

  useEffect(() => {

    if (orderId) {
    
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/personal/${roomName}/`)

      ws.onopen = () => {
        console.log('WebSocket connection opened')
      }

      ws.onmessage = event => {
        ;(JSON.parse(event.data).id != null ||
          JSON.parse(event.data).id != undefined) &&
          localStorage.setItem('roomID', JSON.parse(event.data).id)
        setRoomID(prev =>
          JSON.parse(event.data).id != null ||
          JSON.parse(event.data).id != undefined
            ? JSON.parse(event.data).id
            : prev
        )

        handleAllChatHistory(
          true,
          JSON.parse(event.data).id != null ||
            JSON.parse(event.data).id != undefined
            ? true
            : false,
          JSON.parse(event.data)
        )
      }

      ws.onclose = () => {
        console.log('WebSocket connection closed')
      }

      setWs(ws)

      return () => {
        ws.close()
      }
    }
  }, [orderId])

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

  const sendMessage = async () => {

    if (chatData) {

      let modifiedObj  = {}; 

      if (quotedMessageContainer){

        modifiedObj = { 
          content: chatData,
          send_from_id: Number(user),
          room_name: orderId,
          media: '',
          media_option: false,
          room_id: roomID,
          is_quoted: true,
          quoted_message: quotedMessageInfo?.content, 
          urgent_case: urgentCase
        } ;
        
      } else{

        modifiedObj = { 
          content: chatData,
          send_from_id: Number(user),
          room_name: orderId,
          media: '',
          media_option: false,
          room_id: roomID,
          is_quoted: false,
          quoted_message: '', 
          urgent_case: urgentCase
        } ;

      }
      setChatData('') ; 
      setQuotedMessageContainer(false) ; 
      setQuotedMessageInfo(null) ; 

      sendChatMessage(modifiedObj)
        .then(res => {
          if (res.data.status) {
            NotificationMessage('success', "Message send successfully")
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
      ScrollToBottom() ; 

    } ; 

    let formData = {}

    if (imageStore?.length || fileStore?.length) {

      // Create unique id for image 
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

      formData = {
        ...formData,
        media_option: 'True',
        content: chatData,
        send_from_id: Number(user),
        room_name: orderId,
        room_id: roomID,
        is_quoted: forwardMessage?.quoted ? true : 'False',
        quoted_message: forwardMessage?.quoted
          ? forwardMessage?.quotedMessage?.content
          : 'None'
        
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
      setImageStore([])
      setFileStore([])
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

  const chatSettingData = (id, item) => {
    setQuotedMessageContainer(true) ; 
    setQuotedMessageInfo({...item}) ; 
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
          />

        </div>

      </div>
    </Spin>
  )
}

export default ChatMessanger
