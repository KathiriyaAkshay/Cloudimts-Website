import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Col, Form, Image, Input, Modal, Row, Button, Tooltip } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useState } from "react";
import { dummyRequest, getBase64 } from "../helpers/utils";
import { DownloadOutlined } from "@ant-design/icons";
import PDFFileIcon from "../assets/images/pdf-file.png";
import DocxFileIcon from "../assets/images/docx-file.png";

const UploadImage = ({
  values,
  imageFile,
  setImageFile,
  setValues,
  imageURL,
  multipleImage,
  multipleImageFile,
  setMultipleImageFile,
  isClinicalHistory,
  isAddImageSeries,
  manualEntry,
  showManualEntry, 
  isManualSeriesUpload
}) => {

  const [file, setFile] = useState(imageURL);
  const [imageUploadError, setImageUploadError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [drawerHeight, setDrawerHeight] = useState(11);

  useEffect(() => {
    setFile(imageURL);
  }, [imageURL]);

  const handleImagePreviewCancel = () => setPreviewOpen((prev) => false);

  // Image Preview option handle 
  const handleImagePreview = async (file) => {
    if (
      !imageUploadError ||
      imageUploadError === "" ||
      imageUploadError === undefined
    ) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    }
  };

  // Check Particular URL stand for PDF or not 
  function isPDF(url) {

    let pdfFileExtensionList = ["pdf"];
    let WordFileExtensionList = ["docx"];

    const fileExtension = url.split('.').pop().toLowerCase();

    if (pdfFileExtensionList.includes(fileExtension)) {
      return "pdf"
    } else if (WordFileExtensionList.includes(fileExtension)) {
      return "word"
    } else {
      return 'image';
    }
  }

  function getFileNameFromURL(url) {
    // Extract the last part of the URL after the last slash
    const pathSegments = url.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Extract the file name using a regular expression to remove query parameters
    const fileName = lastSegment.replace(/[\?|#].*$/, '');

    return fileName;
  }

  // Download option button handler
  const handleDownload = (imageUrl) => {
    // URL of the PDF file
    var pdfUrl = imageUrl;

    // Create a temporary anchor element
    var downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = 'filename.pdf'; // Optional, specify a filename for the downloaded file

    // Append the anchor element to the body
    document.body.appendChild(downloadLink);

    // Trigger a click event on the anchor element
    downloadLink.click();

    // Remove the anchor element from the body
    document.body.removeChild(downloadLink);

    // const link = document.createElement('a');
    // link.href = imageUrl;
    // link.download = imageURL
    // link.click();
  };

  // Delete option handler 

  const DeleteOptionHandler = (data) => {
    const newArray = multipleImageFile.filter(url => url !== data);
    setMultipleImageFile(newArray)
  }


  const DeleteValues=(name)=>{
    setValues((obj)=>obj.filter(item => item.url.name !== name))
  }


  return (
    <>
      <Form.Item
        label="Upload Image"
        name="url"
        onChange={(e) => {
          setImageFile(e.target.files[0]);
        }}
        valuePropName="value1"
        className="upload-image-selection-division"
        preserve={false}
      >
        {file && (
          <Row
            className="ant-upload-list-item"
            style={{ gap: "20px", marginBottom: "20px" }}
            align="middle"
          >
            <>
              <Image
                style={{ width: "100px", height: "100px" }}
                src={file}
                onLoad={() => setImageLoaded(true)}
                alt="file"
              />
            </>
          </Row>
        )}

        <div>
          {multipleImageFile?.length > 0 && (
            <div className="all-upload-document-list-div">
              {multipleImageFile.map((data) => (

                isPDF(data) === "pdf" ? <>

                  {/* ==== Pdf file option ====  */}
                  <div className="Report-reference-document">

                    <div className="Reference-option-button-layout">

                      {/* Particular pdf file delete option  */}
                      <Tooltip title={getFileNameFromURL(data)}>
                        <Button danger className="Reference-download-option-button"
                          icon={<DeleteOutlined />}
                          onClick={() => DeleteOptionHandler(data)}>
                        </Button>
                      </Tooltip>

                      {/* Particular pdf file download option  */}
                      <Tooltip title={getFileNameFromURL(data)}>
                        <Button type="primary" className="Reference-download-option-button"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(data)}>
                        </Button>
                      </Tooltip>
                    </div>

                    <img
                      style={{ width: "100px", height: "100px" }}
                      src={PDFFileIcon}
                      onLoad={() => setImageLoaded(true)}
                      alt="file"
                      className="Reference-image"
                    />
                  </div>

                </> : <>

                  {isPDF(data) === "image" ? <>

                    {/* ==== Image File option ====  */}
                    <div className="Report-reference-document">

                      <div className="Reference-option-button-layout">

                        {/* Image file delete option  */}
                        <Tooltip title={getFileNameFromURL(data)}>
                          <Button danger className="Reference-download-option-button"
                            icon={<DeleteOutlined />}
                            onClick={() => DeleteOptionHandler(data)}>
                          </Button>
                        </Tooltip>

                        {/* Image file download option  */}
                        <Tooltip title={getFileNameFromURL(data)}>
                          <Button type="primary" className="Reference-download-option-button"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(data)}>
                          </Button>
                        </Tooltip>

                      </div>

                      <Image
                        style={{ width: "100px", height: "100px" }}
                        src={data}
                        onLoad={() => setImageLoaded(true)}
                        alt="file"
                        className="Reference-image"
                      />
                    </div>

                  </> : <>

                    {/* ==== Other file option ====  */}
                    <div className="Report-reference-document">

                      <div className="Reference-option-button-layout">

                        <Tooltip title={getFileNameFromURL(data)}>
                          <Button danger className="Reference-download-option-button"
                            icon={<DeleteOutlined />}
                            onClick={() => DeleteOptionHandler(data)}>
                          </Button>
                        </Tooltip>

                        <Tooltip title={getFileNameFromURL(data)}>
                          <Button type="primary" className="Reference-download-option-button"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(data)}>
                          </Button>
                        </Tooltip>

                      </div>

                      <Image
                        style={{ width: "100px", height: "100px" }}
                        src={DocxFileIcon}
                        onLoad={() => setImageLoaded(true)}
                        alt="file"
                        className="Reference-image"
                      />
                    </div>

                  </>}
                </>
              ))}

            </div>
          )}
        </div>

        {showManualEntry && (
            <div className="all-upload-document-list-div">
            {values.map((file) => {
              return(
                <div className="Report-reference-document">

                <div className="Reference-option-button-layout">

                  <Tooltip title={file.url.name}>
                    <Button danger className="Reference-download-option-button"
                      icon={<DeleteOutlined />}
                      onClick={() => DeleteValues(file.url.name)}>
                    </Button>
                  </Tooltip>

                </div>

                <Image
                  style={{ width: "100px", height: "100px" }}
                  src={URL.createObjectURL(file.url)}
                  onLoad={() => setImageLoaded(true)}
                  alt="file"
                  className="Reference-image"
                />
              </div>
              )
            })}
          </div>
        )}

        {/* ==== File selection drawer ====  */}
        <div style={{...{ maxHeight: `${drawerHeight}rem`, minHeight: isClinicalHistory ? "6.8rem" : "11rem", overflowX: "auto" , overflowY: isManualSeriesUpload == true?"hidden":null}}}>
          <Dragger
            name="url"
            style={{ height: "100%" }}
            multiple={multipleImage ? true : false}
            accept={isClinicalHistory ? ".png,.jpeg,.jpg,.pdf" : isAddImageSeries ? ".png,.jpeg,.jpg" : ".png,.jpeg,.jpg,.pdf,.docx"}
            listType="picture-card"
            maxCount={multipleImage ? (manualEntry ? 12 : 10) : 1}
            customRequest={dummyRequest}
            onPreview={handleImagePreview}
            onDrop={(_) => { }}
            onChange={(info, _) => {
              switch (info.file.status) {
                case "error":
                  setImageUploadError(info.file.response);
                  break;
                case "uploading":
                  break;
                case "done":
                  setImageUploadError("");
                  setDrawerHeight((prev) => prev + 4)
                  setValues((prev) => ([
                    ...prev,
                    { url: info?.file?.originFileObj }
                  ]));
                  break;
                case "removed":
                  break;
                default:
                  console.log("rer");
              }
            }}
          >

            {isClinicalHistory ? <></> :
              <>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
              </>}

            <p className="ant-upload-text">Drag & drop files or Browse</p>
            <p className="ant-upload-hint">
              {
                isClinicalHistory ? <>Supported formates: JPG, JPEG, PNG, PDF</> : isAddImageSeries ? <></> : <>Supported formates: JPG, JPEG, PNG, PDF, DOCX</>
              }

            </p>
          </Dragger>
        </div>

      

      </Form.Item>

      {/* Image preview modal  */}

      

      <Modal
        open={previewOpen}
        onCancel={handleImagePreviewCancel}
        footer={false}
        title={previewTitle}
      >
        <img src={previewImage} alt={previewTitle} width="100%" />
      </Modal>
    </>
  );
};

export default UploadImage;
