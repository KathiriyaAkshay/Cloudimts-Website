import React from "react";
const quotesOwn = [{ text: "Quote" }, { text: "Copy" }, { text: "Remove" }];
const quotesCommon = [{ text: "Quote" }, { text: "Copy" }];


const ChatSettingPop = ({handleSettingPopup, messageId, ownMessages, messageData}) => {
  const menus = ownMessages ? quotesOwn : quotesCommon || []
  return (
    <>
      <div className="chat-setting-pop">
        {menus?.map((item) => {
          return (
            <>
              <div className="chat-setting-pop-span" onClick={()=>handleSettingPopup(item?.text, messageId, messageData)}>{item?.text}</div>
              <hr></hr>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ChatSettingPop;
