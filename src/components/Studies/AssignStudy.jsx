import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  fetchAssignStudy,
  getRadiologistList,
  getStudyData,
  postAssignStudy,
  uploadImage,
} from "../../apis/studiesApi";
import UploadImage from "../UploadImage";
import { omit } from "lodash";
import NotificationMessage from "../NotificationMessage";

const AssignStudy = ({
  isAssignModalOpen,
  setIsAssignModalOpen,
  studyID,
  setStudyID,
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [multipleImageFile, setMultipleImageFile] = useState([])
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setIsLoading(true)
    const payloadObj = omit(values, ["radiologist", "url"]);
    const images = [];
    for (const data of values.url.fileList) {
      try {
        const formData = {
          image: data.originFileObj,
        };

        const res = await uploadImage(formData);
        images.push(res.data.image_url);
      } catch (err) {
        console.error(err);
      }
    }
    try {
      const modifiedPayload = {
        ...payloadObj,
        id: studyID,
        assign_user: values.radiologist,
        study_data: {
          images: images,
        },
      };
      await postAssignStudy(modifiedPayload)
        .then((res) => {
          NotificationMessage("success", "Study Assigned Successfully");
          setIsAssignModalOpen(false);
          setStudyID(null);
          form.resetFields();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (studyID && isAssignModalOpen) {
      retrieveStudyData();
      retrieveRadiologistData();
      retrieveAssignStudyDetails();
    }
  }, [studyID]);

  const retrieveAssignStudyDetails = async () => {
    setIsLoading(true);
    await fetchAssignStudy({ id: studyID })
      .then((res) => {
        form.setFieldsValue({
          ...res.data?.data,
          radiologist: res.data?.assign_user?.map(
            (data) => data?.assign_user_id
          )[0],
        });
        setMultipleImageFile(res.data.data?.study_data?.images)
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const retrieveRadiologistData = () => {
    getRadiologistList({
      role_id: localStorage.getItem("role_id"),
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setOptions(resData);
      })
      .catch((err) => console.log(err));
  };

  const retrieveStudyData = () => {
    setIsLoading(true);
    getStudyData({ id: studyID })
      .then((res) => {
        const resData = res.data.data;
        const modifiedData = [
          {
            name: "Patient's id",
            value: resData?.Patient_id,
          },
          {
            name: "Referring Physician Name",
            value: resData?.Referring_physician_name,
          },
          {
            name: "Patient's Name",
            value: resData?.Patient_name,
          },
          {
            name: "Performing Physician Name",
            value: resData?.Performing_physician_name,
          },
          {
            name: "Accession Number",
            value: resData?.Accession_number,
          },
          {
            name: "Modality",
            value: resData?.Modality,
          },
          {
            name: "Gender",
            value: resData?.Gender,
          },
          // {
          //   name: "Count",
          //   value: "",
          // },
          {
            name: "Date of birth",
            value: resData?.DOB,
          },
          {
            name: "Study Description",
            value: resData?.Study_description,
          },
          // {
          //   name: "Age Group",
          //   value: "",
          // },
          {
            name: "Patient's comments",
            value: resData?.Patient_comments,
          },
          {
            name: "Body Part",
            value: resData?.Study_body_part,
          },
          {
            name: "Study UID",
            value: resData?.Study_UID,
          },
          {
            name: "Series UID",
            value: resData?.Series_UID,
          },
        ];
        setModalData(modifiedData);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  return (
    <Modal
      title="Clinical History"
      open={isAssignModalOpen}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setStudyID(null);
        setIsAssignModalOpen(false);
        form.resetFields();
      }}
      width={1000}
      centered
    >
      <Spin spinning={isLoading}>
        <div
          style={{
            background: "#ebf7fd",
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
                {item.name === "Patient's id" ||
                item.name === "Patient's Name" ||
                item.name === "Study UID" ||
                item.name === "Institution Name" ||
                item.name === "Series UID" ? (
                  <Tag color="#87d068">{item.value}</Tag>
                ) : (
                  <Typography style={{ fontWeight: "400" }}>
                    {item.value}
                  </Typography>
                )}
              </Typography>
            </List.Item>
          )}
        />
        <div>
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
            <Row gutter={30}>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label="Choose Radiologist"
                  name="radiologist"
                  className="category-select"
                  rules={[
                    {
                      required: false,
                      message: "Please select radiologist",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Radiologist"
                    options={options}
                    // mode="multiple"
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
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="study_description"
                  label="Modality Study Description"
                  rules={[
                    {
                      required: false,
                      message: "Please enter Modality Study Description",
                    },
                  ]}
                >
                  <Input placeholder="Enter Modality Study Description" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item
                  name="study_history"
                  label="Clinical History"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please enter clinical history",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="Enter Clinical History" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <Form.Item name="urgent_case" label="Report Required">
                  <Radio.Group>
                    <Radio value={false}>Regular</Radio>
                    <Radio value={true}>Urgent</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <UploadImage multipleImage={true} multipleImageFile={multipleImageFile} />
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default AssignStudy;
