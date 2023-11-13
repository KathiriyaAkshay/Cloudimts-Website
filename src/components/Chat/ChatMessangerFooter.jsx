import React, { useEffect, useState } from "react";
import { Input } from "antd";
import ChatFileUploader from "./ChatFileUploader";
import backgroundImg from "../../assets/images/backgroundImg.jpg";
import SmilyImage from "../../assets/images/smiley.png" ; 
import CameraImage from "../../assets/images/camera.png" ;
import SendImage from '../../assets/images/send.png' 
import EmojiPicker from "emoji-picker-react";
import ChatCameraUploader from "./ChatCameraUploader";
import DisableEmoji from "../../assets/images/laugh.png"

const ChatMessangerFooter = (props) => {
  const {
    emojiClick,
    handleEmoji,
    sendMessage,
    onEmojiClick,
    handleChangeText,
    chatData,
    setImageStore,
    imageStore,
    setFileStore,
    fileStore,
    isChatModule,
    layoutHeight
  } = props || {};

  const handleUploadData = (data, type) => {
    if (type === "file") {
      setFileStore(data);
    } else {
      setImageStore(data);
    }
  };

  useEffect(() => {
    if (imageStore.length !== 0){
      layoutHeight("55vh") ; 
    } else{
      layoutHeight("71vh") ;
    }
  }, [imageStore])

  const handleImageStore = (e) => {
    layoutHeight("55vh") ; 
    setImageStore((prev) => [...e.target.files]);
  };

  const handleFileStore = (e) => {
    setFileStore((prev) => [...e.target.files]);
  };

  console.log("EmojinClick information  =======>");
  console.log(emojiClick);

  return (
    <>
      <div>

        <div className="social-chatmessanger-wrap">
          
          {/* ==== Emoji Option =====  */}

          {emojiClick?<>
            <img
              src={DisableEmoji}
              alt="icon"
              onClick={() => handleEmoji()}
              className="Smiley-option-image"
            />
          
          </>:<>
            <img
              src={SmilyImage}
              alt="icon"
              onClick={() => handleEmoji()}
              className="Smiley-option-image"
            />
          </>}


          {/* ===== TextInput option division =====  */}

          <Input.TextArea
            className="Chat-message-input"
            placeholder="Message"
            value={chatData}
            rows={1}
            onChange={handleChangeText}
          ></Input.TextArea>

          {chatData !== "" && imageStore?.length ? (
            <div
              className="d-flex"
              style={{ marginLeft: "20px", cursor: "pointer" }}
            >
              <div
                style={{ display: "flex", flexWrap: "wrap", cursor: "pointer" }}
              >
                <div className="chat-camera-module">

                  <input
                    type="file"
                    id="myfile"
                    name="myfile"
                    accept="image/png, image/jpeg, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => handleImageStore(e)}
                    multiple="multiple"
                  />
                  
                  <img
                    src={CameraImage}
                    alt="alt"
                    style={{ cursor: "pointer", marginTop: "5px" }}
                  ></img>
                
                </div>
              
              </div>
            
            </div>
          ) : (
            <div
              className="d-flex"
              style={{ marginLeft: "20px", cursor: "pointer" }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                
                <div
                  className="chat-camera-module"
                  style={{ position: "relative", cursor: "pointer" }}
                >
                
                  <input
                    type="file"
                    id="myfile"
                    accept="image/png, image/jpeg"
                    name="myfile"
                    onChange={(e) => handleImageStore(e)}
                    multiple="multiple"
                    style={{ left: 0, width: "100%" }}
                  />
                
                  <img
                    src={CameraImage}
                    alt="alt"
                    style={{ cursor: "pointer", marginTop: '5px' }}
                  ></img>
                
                </div>
              
              </div>
            
            </div>
          )}

          {chatData?.length || imageStore?.length || fileStore?.length ? (
            
            <div onClick={() => sendMessage()} className="send-chat-button">
              <img src={SendImage} alt="ok" className="Send-option-image" />
            </div>
          
          ) : (
            ""
          )}
          
        </div>

        {imageStore?.length ? null : (
          <ChatFileUploader
            chatData={chatData}
            image={backgroundImg}
            handleUploadData={handleUploadData}
            multiple={true}
            setFileStore={setFileStore}
            fileStore={fileStore}
            handleFileStore={handleFileStore}
          />
        )}

        {fileStore?.length ? null : (
          <ChatCameraUploader
            chatData={chatData}
            image={backgroundImg}
            handleUploadData={handleUploadData}
            multiple={true}
            setImageStore={setImageStore}
            imageStore={imageStore}
            handleImageStore={handleImageStore}
          />
        )}
      </div>

      {/* ===== Emoji option layout =====  */}

      {emojiClick && (
        <div
          className="emoji-container"
          style={!isChatModule ? { paddingLeft: "0px", height: "310px" } : {}}
        >
          <EmojiPicker
            height="20rem"
            width="100%"
            onEmojiClick={(e) => onEmojiClick(e)}
          />
        </div>
      )}
    </>
  );
};
export default ChatMessangerFooter;
