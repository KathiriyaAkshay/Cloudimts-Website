import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Form, Image, Input, Modal, Row } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useState } from "react";
import { dummyRequest, getBase64 } from "../helpers/utils";

const UploadImage = ({
  imageFile,
  setImageFile,
  values,
  setValues,
  imageURL,
  multipleImage,
  multipleImageFile,
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

  console.log(multipleImageFile);

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
      >
        <Dragger
          name="url"
          multiple={multipleImage ? true : false}
          accept=".png, .jpeg, .jpg"
          listType="picture-card"
          maxCount={multipleImage ? 20 : 1}
          customRequest={dummyRequest}
          onPreview={handleImagePreview}
          onDrop={(_) => {}}
          onChange={(info, _) => {
            switch (info.file.status) {
              case "error":
                setImageUploadError(info.file.response);
                // NotificationMessage("error", info.file.response);
                break;
              case "uploading":
                break;
              case "done":
                setImageUploadError("");
                setFile();
                setValues((prev) => ({
                  ...prev,
                  url: imageFile,
                }));
                break;
              case "removed":
                setImageUploadError("");
                setValues((prev) => ({
                  ...prev,
                  url: undefined,
                }));
                setImageFile();
                break;
              default:
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Drag & drop files or Browse</p>
          <p className="ant-upload-hint">
            Supported formates: JPG, JPEG, PNG, SVG
          </p>
        </Dragger>
      </Form.Item>
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
      {multipleImageFile?.length > 0 &&
        multipleImageFile.map((data) => (
          <Row
            className="ant-upload-list-item"
            style={{ gap: "20px" }}
            align="middle"
          >
            <>
              <Image
                style={{ width: "100px", height: "100px" }}
                src={data}
                onLoad={() => setImageLoaded(true)}
                alt="file"
              />
            </>
          </Row>
        ))}
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
