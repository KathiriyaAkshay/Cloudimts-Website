import React, { useState } from "react";
// import EmojiPicker from "emoji-picker-react";
import { Input } from "antd";
// import ChatCameraUploader from "./ChatCameraUploader";
import ChatFileUploader from "./ChatFileUploader";
import arrowFront from "../../assets/images/arrowfront.svg";
import backgroundImg from "../../assets/images/backgroundImg.jpg";
import camera from "../../assets/images/camera.svg";
import link from "../../assets/images/link.svg";
import smily from "../../assets/images/smily.svg";
import EmojiPicker from "emoji-picker-react";
import ChatCameraUploader from "./ChatCameraUploader";

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
  } = props || {};

  const handleUploadData = (data, type) => {
    if (type === "file") {
      setFileStore(data);
    } else {
      setImageStore(data);
    }
  };

  const handleImageStore = (e) => {
    setImageStore((prev) => [...e.target.files]);
  };

  const handleFileStore = (e) => {
    setFileStore((prev) => [...e.target.files]);
  };

  return (
    <>
      <div>
        <div className="social-chatmessanger-wrap">
          <img
            src={smily}
            alt="icon"
            onClick={() => handleEmoji()}
            style={{ cursor: "pointer" }}
          />
          <Input.TextArea
            className=""
            placeholder="Message"
            value={chatData}
            rows={1}
            onChange={handleChangeText}
          ></Input.TextArea>
          {chatData !== "" && fileStore?.length ? (
            <div className="d-flex">
              <div
                style={{ display: "flex", flexWrap: "wrap", cursor: "pointer" }}
              >
                <div
                  className="chat-camera-module"
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="file"
                    id="myfile"
                    name="myfile"
                    onChange={(e) => handleFileStore(e)}
                    multiple="multiple"
                  />
                  <img
                    className="social-chatmessanger-img"
                    src={link}
                    alt="icon"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex">
              <div
                style={{ display: "flex", flexWrap: "wrap", cursor: "pointer" }}
              >
                <div
                  className="chat-camera-module position-relative"
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="file"
                    id="myfile"
                    name="myfile"
                    onChange={(e) => handleFileStore(e)}
                    multiple="multiple"
                    className="w-100 start-0"
                  />
                  <img
                    style={{ width: 20, cursor: "pointer" }}
                    src={link}
                    alt="icon"
                  />
                </div>
              </div>
            </div>
          )}
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
                    src={camera}
                    alt="alt"
                    style={{ cursor: "pointer" }}
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
                    src={camera}
                    alt="alt"
                    style={{ cursor: "pointer" }}
                  ></img>
                </div>
              </div>
            </div>
          )}
          {chatData?.length || imageStore?.length || fileStore?.length ? (
            <div onClick={() => sendMessage()} className="send-chat-button">
              <img src={arrowFront} alt="ok" />
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
