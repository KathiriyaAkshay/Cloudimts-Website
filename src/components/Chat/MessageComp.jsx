import React, { useEffect } from "react";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router";
import moment from "moment/moment";
import ChatSettingPop from "./ChatSettingPop";
import PdfImg from "../../assets/images/pdf.svg";
import downloadImg from "../../assets/images/download-chat-img.png";
import Excel from "../../assets/images/microsoft-excel-icon.svg";
import Document from "../../assets/images/Document_chat.svg";
import chatFileImg from "../../assets/images/chat-file-icon.svg";
import Word from "../../assets/images/microsoft-word-icon.svg";
const MessageComp = (props) => {
  const navigate = useNavigate();
  const {
    item,
    description,
    handleSettingPopup,
    chatSettingData,
    ownMessages,
    tickImage,
    colonImage,
    randomColor,
    groupRecieve,
    handleGalleryPopUp,
    chatSearchedResults,
    searchIndex,
  } = props;
  const id = item?.id;
  const { media } = item || [];
  useEffect(() => {
    // chatSearchedResults?.length &&
    //   document
    //     ?.getElementById(chatSearchedResults[searchIndex - 1]?.uni_key)
    //     .scrollIntoView();
  }, [searchIndex]);

  const handleCustomSlider = (mainData = "") => {
    return (
      <div
        className={
          mainData?.includes(".pdf") ||
          mainData?.includes(".xlsx") ||
          mainData?.includes(".doc") ||
          mainData?.includes(".docx")
            ? "flex-column gap-3 showcard-containerimg"
            : "showcard-containerimg"
        }
        style={
          !(
            mainData?.includes(".pdf") ||
            mainData?.includes(".xlsx") ||
            mainData?.includes(".doc") ||
            mainData?.includes(".docx")
          )
            ? {
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                width: "232px",
                paddingBottom: "10px",
                background: "none",
              }
            : {
                background: "none",
                display: "flex",
                paddingBottom: "10px",
              }
        }
      >
        <>
          {mainData?.includes(".pdf") ? (
            <div className="d-flex justify-content-between chat-file-container align-items-center">
              <div
                className="d-flex gap-1 align-items-center"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  className="chat-doc-image"
                  src={PdfImg}
                  alt="chatFileImg"
                />
                <div className="d-flex chat-file-name-size">
                  <span className="text-break">{mainData?.split(".")[0]}</span>
                </div>
              </div>
              <img
                style={{ width: "25px", height: "25px" }}
                onClick={() => saveAs(`${mainData}`)}
                src={downloadImg}
                alt="downloadImg"
              />
            </div>
          ) : mainData?.includes(".xlsx") ? (
            <div className="d-flex justify-content-between chat-file-container align-items-center">
              <div
                className="d-flex gap-1 align-items-center"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img className="chat-doc-image" src={Excel} alt="chatFileImg" />
                <div className="d-flex chat-file-name-size">
                  <span className="text-break">{mainData?.split(".")[0]}</span>
                </div>
              </div>
              <img
                style={{ width: "25px", height: "25px" }}
                onClick={() => saveAs(`${mainData?.split(".")[0]}`)}
                src={downloadImg}
                alt="downloadImg"
              />
            </div>
          ) : mainData?.includes(".doc") || mainData?.includes(".docx") ? (
            <div className="d-flex justify-content-between chat-file-container align-items-center">
              <div
                className="d-flex gap-1 align-items-center"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img className="chat-doc-image" src={Word} alt="chatFileImg" />
                <div className="d-flex chat-file-name-size">
                  <span className="text-break">{mainData?.split(".")[0]}</span>
                </div>
              </div>
              <img
                style={{ width: "25px", height: "25px" }}
                onClick={() => saveAs(`${mainData?.split(".")[0]}`)}
                src={downloadImg}
                alt="downloadImg"
              />
            </div>
          ) : mainData?.includes("jpg") ||
            mainData?.includes("jpeg") ||
            mainData?.includes("png") ||
            mainData?.includes("PNG") ||
            mainData?.includes("avif") ? (
            <div className="userchat-container mt-3">
              <img src={`${mainData}`} />
              {/* <Slider
                          imageData={mainData}
                          numberShowMargin={true}
                          handleGalleryPopUp={handleGalleryPopUp}
                          isMessageGallery={true}
                          extensionName={extensionName}
                          fileName={fileName}
                          files={files}
                        /> */}
            </div>
          ) : mainData?.includes(".mp4") ||
            mainData?.includes(".mov") ||
            mainData?.includes(".mkv") ? (
            <video quality={100} width="100%" height="100%">
              <source
                // type={`video/${mainData[0]?.files?.split(".")?.pop()}`}
                src={`${mainData}`}
              ></source>
            </video>
          ) : (
            // <Slider
            //   imageData={mainData}
            //   numberShowMargin={true}
            //   handleGalleryPopUp={handleGalleryPopUp}
            //   isMessageGallery={true}
            // />
            <div className="d-flex justify-content-between chat-file-container align-items-center">
              <div
                className="d-flex gap-1 align-items-center"
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  className="chat-doc-image"
                  src={Document}
                  alt="chatFileImg"
                />
                <div className="d-flex chat-file-name-size">
                  <span className="text-break">{mainData?.split(".")[0]}</span>
                </div>
              </div>
              <img
                style={{ width: "25px", height: "25px" }}
                onClick={() => saveAs(`${mainData?.split(".")[0]}`)}
                src={downloadImg}
                alt="downloadImg"
              />
            </div>
          )}
        </>
        {/* {mainData[0]?.files?.includes(".pdf") ||
          mainData[0]?.files?.includes(".doc") ||
          mainData[0]?.files?.includes(".docx") ? (
          <>
            {mainData?.map((files) => {
              return (
                <>
                  <div className="d-flex justify-content-between chat-file-container align-items-center">
                    <div className="d-flex gap-1 align-items-center">
                      <img src={chatFileImg} alt="chatFileImg" />
                      <span className="text-break">
                        {files?.files?.split("/")[4]}
                      </span>
                    </div>
                    <img
                      style={{ width: "25px", height: "25px" }}
                      onClick={() =>
                        saveAs(
                          `${files?.files}`
                        )
                      }
                      src={downloadImg}
                      alt="downloadImg"
                    />
                  </div>
                </>
              );
            })}
          </>
        ) : (
          <>
            {mainData[0]?.files?.includes(".mp4") ||
              mainData[0]?.files?.includes(".mov") ||
              mainData[0]?.files?.includes(".mkv") ? (
              <>
                {mainData?.length > 1 ? (
                  <>
                    <Slider
                      imageData={mainData}
                      numberShowMargin={true}
                      handleGalleryPopUp={handleGalleryPopUp}
                      isMessageGallery={true}
                    />
                  </>
                ) : (
                  <video quality={100} width="100%" height="100%">
                    <source
                      type={`video/${mainData[0]?.files?.split(".")?.pop()}`}
                      src={`${mainData[0]?.files}`}
                    ></source>
                  </video>
                )}
                {
                  <div
                    className="show-play-button"
                    style={
                      mainData?.length > 1
                        ? { display: "none" }
                        : { display: "block" }
                    }
                  >
                    <img
                      src={playbutton}
                      alt="play"
                      onClick={() => handleGalleryPopUp(mainData[0])}
                    />
                  </div>
                }
              </>
            ) : mainData?.length > 1 ? (
              <>
                <Slider
                  imageData={mainData}
                  numberShowMargin={true}
                  handleGalleryPopUp={handleGalleryPopUp}
                  isMessageGallery={true}
                />
              </>
            ) : (
              <>
                {mainData?.map((i) => (
                  <img
                    src={`${i?.files}`}
                    alt="icon"
                    onClick={() => handleGalleryPopUp(i)}
                  />
                ))}
              </>
            )}
          </>
        )} */}
      </div>
    );
  };

  const downInternalDocFunc = (ids, data) => {
    const params = `?main_tenant_id=${ids?.split("_")[0]}&co_tenant_id=${
      ids?.split("_")[1]
    }`;
    data === "House rules sent"
      ? getCoTenantHouseRules(params)
          .then((response) => {
            const blob = new Blob([response?.data], {
              type: "text/plain",
            });
            // saveAs(blob, "house-rules.pdf")
          })
          .catch((error) => {
            console.log("err", error);
          })
      : getCotenantFormData(params)
          .then((response) => {
            const blob = new Blob([response?.data], {
              type: "text/plain",
            });
            // saveAs(blob, "co-tenant-agreement.pdf")
          })
          .catch((error) => {
            console.log("err", error);
          });
  };

  const handleInternalDocMsg = (data, ids) => {
    return (
      <div className="d-flex justify-content-between">
        <div
          className="d-flex gap-1 align-items-center"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <img src={chatFileImg} alt="chatFileImg" />
          <span>{data}</span>
        </div>
        <img
          style={{ width: "25px", height: "25px" }}
          src={downloadImg}
          alt="chatFileImg"
          onClick={() => downInternalDocFunc(ids, data)}
        />
      </div>
    );
  };

  const handleSocialPostMsg = (data, id, platformType) => {
    return (
      <b
        onClick={() =>
          navigate("/newsocial", {
            state: {
              redirected: "chat",
              platformType: platformType,
              collectionId: id[1],
            },
          })
        }
      >
        {data}
      </b>
    );
  };

  const handleQuotedScroll = (id) => {
    document.getElementById(id).scrollIntoView();
  };

  return (
    <>
      <div id={id}>
        {item?.is_quoted ? (
          <div className="forward-chat-message">
            <div className="forwardChat-data">
              <div onClick={() => handleQuotedScroll(item?.quoted_id)}>
                <i style={{ marginBottom: "6px" }}>❝ Quoted ❞ :</i>
                <p>{item?.quoted_message}</p>
              </div>
              <img
                alt="img"
                src={colonImage}
                onClick={() => chatSettingData(id)}
                style={{ cursor: "pointer" }}
              ></img>
            </div>
            <hr />
          </div>
        ) : (
          <></>
        )}
        {item?.is_forwarded && !item?.is_post ? (
          <div className="forwardChat-data">
            <span>
              <i>Forwarded:</i>
            </span>
            <img
              alt="img"
              src={colonImage}
              style={{ cursor: "pointer" }}
              onClick={() => chatSettingData(id)}
            ></img>
          </div>
        ) : (
          ""
        )}
        {!groupRecieve ? (
          <>
            <div className="userchat-data">
              <div style={{ flex: "1" }}>
                {item?.media_option &&
                  handleCustomSlider(
                    item?.is_forwarded ? item?.file_url : media
                  )}
                <span id={id} className="text-break">
                  {item?.is_internal_doc
                    ? handleInternalDocMsg(item?.content, item?.is_internal_doc)
                    : item?.is_post
                    ? handleSocialPostMsg(
                        item?.content,
                        item?.content?.split("="),
                        item?.plateform_type
                      )
                    : item?.content}
                </span>
              </div>
              {!item?.is_forwarded && !item?.is_quoted ? (
                <img
                  alt="img"
                  src={colonImage}
                  style={{ cursor: "pointer" }}
                  onClick={() => chatSettingData(id)}
                ></img>
              ) : (
                ""
              )}
            </div>
            <div className="userchat-time">
              <span>
                {moment(item?.timestamp || item?.timestamp).format("hh:mm")}
              </span>
              <img alt="img" src={tickImage}></img>
            </div>
            {description?.includes(id) && (
              <div className="chat-setting">
                <ChatSettingPop
                  type="personal"
                  handleSettingPopup={handleSettingPopup}
                  messageId={id}
                  ownMessages={ownMessages}
                  messageData={item}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="userchat-data">
              <span style={{ fontWeight: "1000", color: randomColor }}>
                {item?.user_name}:
              </span>
              {!item?.is_forwarded && !item?.is_quoted ? (
                <img
                  alt="img"
                  src={colonImage}
                  style={{ cursor: "pointer" }}
                  onClick={() => chatSettingData(id)}
                ></img>
              ) : (
                ""
              )}
            </div>
            <div className="userchat-data group-chat-user-chat">
              {item?.media_option &&
                handleCustomSlider(item?.is_forwarded ? item?.file_url : media)}
              <span>{item?.content}</span>
            </div>
            <div className="userchat-time">
              <span>{moment(item?.timestamp).format("hh:mm")}</span>
              <img alt="img" src={tickImage}></img>
            </div>
            {description?.includes(id) && (
              <div className="chat-setting">
                <ChatSettingPop
                  type="personal"
                  handleSettingPopup={handleSettingPopup}
                  messageId={id}
                  ownMessages={false}
                  messageData={item}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MessageComp;
