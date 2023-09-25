import {
  Col,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getMoreDetails,
  submitNormalReportFile,
  uploadImage,
} from "../../apis/studiesApi";
import UploadImage from "../UploadImage";
import NotificationMessage from "../NotificationMessage";

const FileReport = ({
  isFileReportModalOpen,
  setIsFileReportModalOpen,
  studyID,
  setStudyID,
  modalData,
}) => {
  // const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [value, setValues] = useState({
    url: undefined,
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    console.log(values);
    let report_attach_data = [];
    if (values.url.fileList.length > 0) {
      await values.url.fileList.map(async (data) => {
        let formData = new FormData();
        formData.append("image", data)
        await uploadImage(formData)
          .then((res) => report_attach_data.push(res.data.image_url))
          .catch((err) => console.log(err));
      });
    }
    submitNormalReportFile({
      id: studyID,
      report_type: values.report_type,
      report_study_description: values.report_study_description,
      report_attach_data: report_attach_data,
    })
      .then((res) =>
        NotificationMessage("success", "File Report Submitted Successfully")
      )
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  return (
    <Modal
      title="File Report"
      open={isFileReportModalOpen}
      onOk={() => {
        // setIsFileReportModalOpen(false);
        form.submit();
      }}
      onCancel={() => {
        setIsFileReportModalOpen(false);
      }}
      width={1000}
      centered
      okText="Save Report"
    >
      <Spin spinning={isLoading}>
        <div
          style={{
            background: "#e4e4e4",
            fontWeight: "600",
            padding: "10px 24px",
            borderRadius: "0px",
            margin: "0 -24px",
          }}
        >
          Patient Info
        </div>
        <List
          style={{ marginTop: "8px" }}
          grid={{
            gutter: 5,
            column: 2,
          }}
          className="queue-status-list"
          dataSource={modalData}
          renderItem={(item) => (
            <List.Item className="queue-number-list">
              <Typography
                style={{ display: "flex", gap: "4px", fontWeight: "600" }}
              >
                {item.name}:
                <Typography style={{ fontWeight: "400" }}>
                  {item.value}
                </Typography>
              </Typography>
            </List.Item>
          )}
        />
        <Form
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmit}
          className="mt"
        >
          <Row gutter={15}>
            <Col xs={24} md={12}>
              <Form.Item
                name="report_type"
                label="Report Result"
                rules={[
                  {
                    required: true,
                    message: "Please select report result",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={1}>Normal</Radio>
                  <Radio value={2}>Abnormal</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="report_study_description"
                label="Modality Study Description"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter modality study description",
                  },
                ]}
              >
                <Input placeholder="Enter modality study description" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <UploadImage
                values={value}
                setValues={setValues}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imageURL={imageURL}
                multipleImage={true}
              />
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default FileReport;
