import React, { useState, useEffect } from "react";
import PdfImg from "../../assets/images/pdf.svg";
import Document from "../../assets/images/document.svg";
import Excel from "../../assets/images/microsoft-excel-icon.svg";
import Word from "../../assets/images/microsoft-word-icon.svg";
import { MdOutlineClear } from "react-icons/md";

const ChatCameraUploader = (props) => {
  const {
    handleUploadData,
    chatData,
    imageStore,
    setImageStore,
    handleImageStore,
  } = props || {};

  useEffect(() => {
    if (imageStore) {
      handleUploadData(imageStore);
    }
  }, [imageStore]);

  // const handleImageStore = (e) => {
  //   setImageStore((prev) => [...e.target.files, ...prev]);
  // };

  const clickedPhotoIndex = (image) => {
    setImageStore((oldState) =>
      oldState.filter((item) => item.lastModified !== image?.lastModified)
    );
  };

  return (
    <>
      {imageStore?.length ? (
        <div
          className={`chat-upload-images ${
            imageStore?.length > 6 && "handle-scroll"
          }`}
        >
          {imageStore?.map((image, index) => {
            const data = image.name.split(".");
            return (
              <div
                className={
                  data[1] === "jpg" ||
                  data[1] === "jpeg" ||
                  data[1] === "png" ||
                  data[1] === "avif" ||
                  image?.type?.includes("video")
                    ? "wrap_img_collection collection_img collectionNameAddBtnContainer pos_rel"
                    : ""
                }
              >
                {image?.type?.includes("video") ? (
                  <div>
                    <video
                      quality={100}
                      width="100%"
                      height="100%"
                      controls
                      className="video-part"
                    >
                      <source
                        type="video/mp4"
                        src={URL.createObjectURL(image)}
                      ></source>
                    </video>
                    <MdOutlineClear
                      className={
                        image?.type?.includes("pdf") ||
                        data[1] === "xlsx" ||
                        data[1] === "docx" ||
                        data[1] === "doc"
                          ? "collectionNameCrossBtn fileChat-cross-icon"
                          : "collectionNameCrossBtn filecross-btn"
                      }
                      onClick={() => clickedPhotoIndex(image)}
                    />
                  </div>
                ) : image?.type?.includes("pdf") ? (
                  <div className="pdf-issue-fix-cross-btn">
                    <div className="icon-chat-center">
                      <div className="icon-chat-center">
                        <img style={{ height: "50px" }} src={PdfImg} />
                      </div>
                    </div>
                    <div className="align-text-pdf-data">
                      <p className="text-pdf-data">
                        {image?.name.length > 14 ? image?.name : image?.name}
                      </p>
                    </div>
                    <MdOutlineClear
                      className={
                        data[1] === "jpg" ||
                        data[1] === "jpeg" ||
                        data[1] === "png" ||
                        data[1] === "avif"
                          ? "collectionNameCrossBtn filecross-btn"
                          : `collectionNameCrossBtn ${
                              image?.name.length > 7
                                ? "fileChat-cross-icon "
                                : "fileChat-cross-icon-direct"
                            }`
                      }
                      onClick={() => clickedPhotoIndex(image)}
                    />
                  </div>
                ) : data[1] === "xlsx" ? (
                  <div className="pdf-issue-fix-cross-btn">
                    <div className="icon-chat-center">
                      <img style={{ height: "50px" }} src={Excel} />
                    </div>
                    <div className="align-text-pdf-data">
                      <p className="text-pdf-data">
                        {image?.name.length > 14 ? image?.name : image?.name}
                      </p>
                    </div>
                    <MdOutlineClear
                      className={
                        data[1] === "jpg" ||
                        data[1] === "jpeg" ||
                        data[1] === "png" ||
                        data[1] === "avif"
                          ? "collectionNameCrossBtn filecross-btn"
                          : `collectionNameCrossBtn ${
                              image?.name.length > 7
                                ? "fileChat-cross-icon "
                                : "fileChat-cross-icon-direct"
                            }`
                      }
                      onClick={() => clickedPhotoIndex(image)}
                    />
                  </div>
                ) : data[1] === "doc" || data[1] === "docx" ? (
                  <div className="pdf-issue-fix-cross-btn">
                    <div className="icon-chat-center">
                      <img style={{ height: "50px" }} src={Word} />
                    </div>
                    <div className="align-text-pdf-data">
                      <p className="text-pdf-data">
                        {image?.name.length > 14 ? image?.name : image?.name}
                      </p>
                    </div>
                    <MdOutlineClear
                      className={
                        data[1] === "jpg" ||
                        data[1] === "jpeg" ||
                        data[1] === "png" ||
                        data[1] === "avif"
                          ? "collectionNameCrossBtn filecross-btn"
                          : `collectionNameCrossBtn ${
                              image?.name.length > 7
                                ? "fileChat-cross-icon "
                                : "fileChat-cross-icon-direct"
                            }`
                      }
                      onClick={() => clickedPhotoIndex(image)}
                    />
                  </div>
                ) : data[1] === "jpg" ||
                  data[1] === "jpeg" ||
                  data[1] === "png" ||
                  data[1] === "PNG" ||
                  data[1] === "avif" ? (
                  <div>
                    <img
                      className="Img_store"
                      alt="icon"
                      src={URL.createObjectURL(image)}
                    />
                    <MdOutlineClear
                      className={
                        data[1] === "jpg" ||
                        data[1] === "jpeg" ||
                        data[1] === "png" ||
                        data[1] === "PNG" ||
                        data[1] === "avif"
                          ? "collectionNameCrossBtn filecross-btn"
                          : `collectionNameCrossBtn ${
                              image?.name.length > 7
                                ? "fileChat-cross-icon "
                                : "fileChat-cross-icon-direct"
                            }`
                      }
                      onClick={() => clickedPhotoIndex(image)}
                    />
                  </div>
                ) : (
                  <div className="pdf-issue-fix-cross-btn">
                    <div className="icon-chat-center">
                      <img
                        style={{ height: "50px" }}
                        alt="icon"
                        src={Document}
                      />
                    </div>
                    <div className="align-text-pdf-data">
                      <p className="text-pdf-data">
                        {image?.name.length > 10 ? image?.name : image?.name}
                      </p>
                    </div>
                    <MdOutlineClear
                      className={
                        data[1] === "jpg" ||
                        data[1] === "jpeg" ||
                        data[1] === "png" ||
                        data[1] === "avif"
                          ? "collectionNameCrossBtn filecross-btn"
                          : `collectionNameCrossBtn ${
                              image?.name.length > 7
                                ? "fileChat-cross-icon "
                                : "fileChat-cross-icon-direct"
                            }`
                      }
                      onClick={() => clickedPhotoIndex(image)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
      {/* {chatData !== "" && imageStore?.length ? (
        <div className="d-flex" style={{ marginLeft: '20px'}}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div className="chat-camera-module">
              <input
                type="file"
                id="myfile"
                name="myfile"
                accept="image/png, image/jpeg"
                onChange={(e) => handleImageStore(e)}
                multiple="multiple"
              />
              <img src={camera} alt="alt"></img>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex"  style={{ marginLeft: '20px'}}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div className="chat-camera-module" style={{position:"relative"}}>
              <input
                type="file"
                id="myfile"
                accept="image/png, image/jpeg"
                name="myfile"
                onChange={(e) => handleImageStore(e)}
                multiple="multiple"
                style={{left:0,width:"100%"}}
              />
              <img src={camera} alt="alt"></img>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default ChatCameraUploader;
