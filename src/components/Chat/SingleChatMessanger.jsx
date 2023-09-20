import React, { useEffect } from "react";
import MessageComp from "./MessageComp";
import moment from "moment";
import ColBlack from "../../assets/images/dotImg.svg";
import white_double from "../../assets/images/white-double-check.svg";
import greycheck from "../../assets/images/grey-check.svg";
import Col from "../../assets/images/whitcol copy.svg"

const SingleChatMessanger = (props) => {
  const {
    chatfile,
    classNames,
    emojiClick,
    messages,
    // ownProfileDataId,
    handleSettingPopup,
    description,
    chatSettingData,
    handleGalleryPopUp,
    searchedMessages,
    chatSearchedResults,
    searchIndex,
  } = props || {};

  const toDate = moment(new Date()).format("DD-MMM-YYYY")

  const ownProfileDataId = localStorage.getItem("userID")

  return (
    <div
      className={`userchat-main ${classNames ? classNames : ""} ${chatfile && "chatfile-style"
        }`}
      style={emojiClick ? { height: "40vh", marginBottom: "10px" } : {}}
    >
      {/* <div className="userchat-date">
        <span>{toDate}</span>
      </div> */}
       {messages &&
        messages?.map((messageData) => (
          <div
           style={{display: "flex", flexDirection: "column", position: "relative", marginBottom: emojiClick && "10px"}} className={`${chatfile && "chatfile-style"}`}
          >
            <div className="userchat-date">
              <span>{moment(messageData.date).format("DD-MMM-YYYY")}</span>
            </div>
            {messageData?.messages?.map((item, index) => {
              return (item?.username?.id || item?.send_from_id) == ownProfileDataId ? (
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <div
                    className={
                      chatSearchedResults &&
                      item?.uni_key &&
                      item?.uni_key ==
                        chatSearchedResults[searchIndex - 1]?.uni_key
                        ? "userchat-container black-color"
                        : "userchat-container color-test"
                    }
                  >
                    <MessageComp
                      item={item}
                      description={description}
                      handleSettingPopup={handleSettingPopup}
                      chatSettingData={chatSettingData}
                      ownMessages={true}
                      tickImage={white_double}
                      colonImage={Col}
                      groupRecieve={false}
                      searchedMessages={searchedMessages}
                      chatSearchedResults={chatSearchedResults}
                      handleGalleryPopUp={handleGalleryPopUp}
                      searchIndex={searchIndex}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={
                      chatSearchedResults &&
                      item?.uni_key &&
                      item?.uni_key ==
                        chatSearchedResults[searchIndex - 1]?.uni_key
                        ? "userchat-container userchat-reply black-color"
                        : "userchat-container userchat-reply color-test"
                    }
                  >
                    <MessageComp
                      item={item}
                      description={description}
                      handleSettingPopup={handleSettingPopup}
                      chatSettingData={chatSettingData}
                      ownMessages={false}
                      tickImage={greycheck}
                      colonImage={ColBlack}
                      groupRecieve={false}
                      searchedMessages={searchedMessages}
                      chatSearchedResults={chatSearchedResults}
                      handleGalleryPopUp={handleGalleryPopUp}
                      searchIndex={searchIndex}
                    />
                  </div>
                </>
              );
            })}
          </div>
        ))}
        {/* {messages &&
        messages?.map((item, index) => 

            <>
              <div
                className={chatSearchedResults &&
                  item?.uni_key && item?.uni_key ==
                  chatSearchedResults[searchIndex - 1]?.uni_key ? "userchat-container black-color" : "userchat-container color-test"}
              >
                <MessageComp
                  item={item}
                  description={description}
                  handleSettingPopup={handleSettingPopup}
                  chatSettingData={chatSettingData}
                  ownMessages={true}
                  tickImage={white_double}
                  colonImage={Col}
                  groupRecieve={false}
                  searchedMessages={searchedMessages}
                  chatSearchedResults={chatSearchedResults}
                  handleGalleryPopUp={handleGalleryPopUp}
                  searchIndex={searchIndex}
                />
              </div>
            </>
          )} */}
    </div>
  );
};

export default SingleChatMessanger;
