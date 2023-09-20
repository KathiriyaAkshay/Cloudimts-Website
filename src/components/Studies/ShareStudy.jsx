import React, { useEffect, useState } from "react";
import { getStudyData } from "../../apis/studiesApi";
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  Typography,
} from "antd";
import { MdEmail } from "react-icons/md";

const ShareStudy = ({
  isShareStudyModalOpen,
  setIsShareStudyModalOpen,
  studyID,
  setStudyID,
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailOptions, setEmailOptions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (studyID && isShareStudyModalOpen) {
      retrieveStudyData();
    }
  }, [studyID]);

  const retrieveStudyData = () => {
    setIsLoading(true);
    getStudyData({ id: studyID })
      .then((res) => {
        const resData = res.data.data.information;
        const modifiedData = [
          {
            name: "Patient's id",
            value: resData.study__study_metadata.PatientMainDicomTags.PatientID,
          },
          {
            name: "Referring Physician Name",
            value:
              resData.study__study_metadata.MainDicomTags
                ?.ReferringPhysicianName,
          },
          {
            name: "Patient's Name",
            value:
              resData.study__study_metadata.PatientMainDicomTags.PatientName,
          },
          {
            name: "Performing Physician Name",
            value: "",
          },
          {
            name: "Accession Number",
            value: resData.study__study_metadata.MainDicomTags.AccessionNumber,
          },
          {
            name: "Modality",
            value: resData.series_metadata.MainDicomTags.Modality,
          },
          {
            name: "Gender",
            value:
              resData.study__study_metadata.PatientMainDicomTags?.PatientSex,
          },
          {
            name: "Count",
            value: "",
          },
          {
            name: "Date of birth",
            value:
              resData.study__study_metadata.PatientMainDicomTags
                ?.PatientBirthDate,
          },
          {
            name: "Study Description",
            value: resData.study_description,
          },
          {
            name: "Age Group",
            value: "",
          },
          {
            name: "Patient's comments",
            value: "",
          },
          {
            name: "UID",
            value: resData.study__study_metadata.MainDicomTags.StudyInstanceUID,
          },
        ];
        setModalData(modifiedData);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const handleSubmit = (values) => {};

  return (
    <>
      <Modal
        title="Share Study"
        open={isShareStudyModalOpen}
        onOk={() => {
          setStudyID(null);
          setIsShareStudyModalOpen(false);
        }}
        onCancel={() => {
          setStudyID(null);
          setIsShareStudyModalOpen(false);
        }}
        width={1000}
        centered
        footer={[
          <Button key="back">
            <MdEmail
              className="action-icon"
              onClick={() => setIsEmailModalOpen(true)}
            />
          </Button>,
          <Button
            key="back"
            onClick={() => {
              setStudyID(null);
              setIsShareStudyModalOpen(false);
            }}
          >
            Cancel
          </Button>,
        ]}
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
        </Spin>
      </Modal>
      <Modal
        title="Email Report"
        centered
        open={isEmailModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsEmailModalOpen(false);
        }}
        okText="Send"
        onOk={() => form.submit()}
      >
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
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item
                name="email"
                label="Email Address"
                className="category-select"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please enter valid email address",
                  },
                ]}
              >
                <Select
                  placeholder="Select Email"
                  options={emailOptions}
                  showSearch
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="attach_dicom_images"
                label="Attach Dicom Images"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ShareStudy;
