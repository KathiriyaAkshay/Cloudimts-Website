import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Col, Form, Image, Input, Modal, Row, Button, Tooltip } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useState } from "react";
import { dummyRequest, getBase64 } from "../helpers/utils";
import { DownloadOutlined } from "@ant-design/icons";
import PDFFileIcon from "../assets/images/pdf-file.png";
import DocxFileIcon from "../assets/images/docx-file.png";

const UploadImage = ({
  imageFile,
  setImageFile,
  setValues,
  imageURL,
  multipleImage,
  multipleImageFile,
  setMultipleImageFile,
  isClinicalHistory,
}) => {

  const [file, setFile] = useState(imageURL);
  const [imageUploadError, setImageUploadError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");

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
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageURL
    link.click();
  };

  // Delete option handler 

  const DeleteOptionHandler = (data) => {
    const newArray = multipleImageFile.filter(url => url !== data);
    setMultipleImageFile(newArray)
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
        preserve={false}
        // style={{overflow:"auto"}}
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
            <Row className="ant-upload-list-item">
              {multipleImageFile.map((data) => (

                isPDF(data) === "pdf" ? <>

                  {/* ==== Pdf file option ====  */}
                  <Col xs={4} className="Report-reference-document">

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
                      src={PDFFileIcon}
                      onLoad={() => setImageLoaded(true)}
                      alt="file"
                      className="Reference-image"
                    />
                  </Col>

                </> : <>

                  {isPDF(data) === "image" ? <>

                    {/* ==== Image File option ====  */}
                    <Col xs={4} className="Report-reference-document">

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
                        src={data}
                        onLoad={() => setImageLoaded(true)}
                        alt="file"
                        className="Reference-image"
                      />
                    </Col>

                  </> : <>
                    {/* ==== Other file option ====  */}
                    <Col xs={4} className="Report-reference-document">

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
                    </Col>

                  </>}
                </>
              ))}
            </Row>
          )}
        </div>

        {/* ==== File selection drawer ====  */}
        <div style={{maxHeight:"11rem",minHeight:isClinicalHistory?"6.8rem":"11rem",overflowX:"auto"}}>
          <Dragger
            name="url"
            style={{ height: "100%" }}
            multiple={multipleImage ? true : false}
            accept={isClinicalHistory?".png,.jpeg,.jpg,.pdf":".png,.jpeg,.jpg,.pdf,.docx"}
            listType="picture-card"
            maxCount={multipleImage ? 10 : 1}
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
                  // setFile(info?.file);
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

            {isClinicalHistory?<></>:
            <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            </>}
            
            <p className="ant-upload-text">Drag & drop files or Browse</p>
            <p className="ant-upload-hint">
              {
                isClinicalHistory?<>Supported formates: JPG, JPEG, PNG, PDF</>:<>Supported formates: JPG, JPEG, PNG, PDF, DOCX</>
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
