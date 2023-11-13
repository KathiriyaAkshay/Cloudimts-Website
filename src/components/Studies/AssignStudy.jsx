import {
  Form,
  Input,
  List,
  Modal,
  Radio,
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
import { descriptionOptions } from "../../helpers/utils"; 
import APIHandler from "../../apis/apiHandler";

const AssignStudy = ({
  isAssignModalOpen,
  setIsAssignModalOpen,
  studyID,
  setStudyID,
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [multipleImageFile, setMultipleImageFile] = useState([]);
  const [form] = Form.useForm();
  const [value, setValues] = useState({ url: undefined });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const payloadObj = omit(values, ["radiologist", "url"]);
    const images = [];
    if (values?.url?.fileList) {
      for (const data of values?.url?.fileList) {
        try {
          const formData = {
            image: data?.originFileObj,
          };
          console.log(formData);

          const res = await uploadImage(formData);
          images.push(res.data.image_url);
        } catch (err) {
          console.error(err);
        }
      }
    }
    try {
      const modifiedPayload = {
        ...payloadObj,
        id: studyID,
        assign_user: values.radiologist,
        study_data: {
          images: !values?.url ? multipleImageFile : images,
        },
      };
      await postAssignStudy(modifiedPayload)
        .then((res) => {
          NotificationMessage("success", "Study Assigned Successfully");
          setIsAssignModalOpen(false);
          setStudyID(null);
          form.resetFields();
        })
        .catch((err) =>
          NotificationMessage("warning", err.response.data.message)
        );
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (studyID && isAssignModalOpen) {
      retrieveStudyData();
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
        setMultipleImageFile(res.data.data?.study_data?.images);
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
    setIsLoading(false);
  };

  const retrieveStudyData = async () => {
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
          {
            name: "Date of birth",
            value: resData?.DOB,
          },
          {
            name: "Study Description",
            value: resData?.Study_description,
          },
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
          {
            name: "urgent_case",
            value: resData?.assigned_study_data,
          },
        ];

        setModalData(modifiedData);

        // Fetch radiologist name based on Institution id 

        const FetchRadiologist = async () => {

          let requestPayload = {
            institution_id: resData?.institution_id,
          };

          let responseData = await APIHandler("POST", requestPayload, 'studies/v1/fetch-institution-radiologist');

          if (responseData['status'] === true){
            const resData = responseData.data.map((data) => ({
              label: data.name,
              value: data.id,
            }));
            setOptions(resData);
          }
        };

        FetchRadiologist() ; 
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
      width={1300}
      style={{
        top: 20,
      }}
      className="assign-study-modal"
    >
      <Spin spinning={isLoading}>
        <div
          style={{
            background: "#ebf7fd",
            fontWeight: "600",
            padding: "10px 24px",
            borderRadius: "0px",
            margin: "0 -24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Patient Info</div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {modalData.find((data) => data.name === "urgent_case")?.value
              ?.urgent_case && <Tag color="error">Urgent</Tag>}
          </div>
        </div>

        <List
          style={{ marginTop: "8px"}}
          grid={{
            gutter: 5,
            column: 2,
          }}
          className="assign-queue-status-list study-modal-patient-info-layout"
          dataSource={modalData?.filter((data) => data.name !== "urgent_case")}
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
                  <Tag color="#87d068" className="Assign-study-info-tag">
                    {item.value}
                  </Tag>
                ) : (
                  <Typography style={{ fontWeight: "400" }}>
                    {item.value}
                  </Typography>
                )}
              </Typography>
            </List.Item>
          )}
        />

        <div className="Study-modal-input-option-division">
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
            <div className="Assign-study-upload-option-input-layout">
              <div className="Assign-study-specific-option">
                <Form.Item
                  label="Choose Radiologist"
                  name="radiologist"
                  className="category-select"
                  rules={[
                    {
                      required: true,
                      message: "Please select radiologist",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Radiologist"
                    options={options}
                    showSearch
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="study_description"
                  label="Modality Study Description"
                  className="category-select"
                  rules={[
                    {
                      required: true,
                      message: "Please select Modality Study Description",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Study Description"
                    options={descriptionOptions}
                    // mode="multiple"
                    showSearch
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                  />
                </Form.Item>

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
              </div>

              <div className="Assign-study-specific-option">
                <Form.Item
                  name="urgent_case"
                  label="Report Required"
                  rules={[
                    {
                      required: true,
                      message: "Please select Report Required",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={false}>Regular</Radio>
                    <Radio value={true}>Urgent</Radio>
                  </Radio.Group>
                </Form.Item>

                <UploadImage
                  multipleImage={true}
                  multipleImageFile={multipleImageFile}
                  values={value}
                  setValues={setValues}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                />
              </div>
            </div>
          </Form>
        </div>
      
      </Spin>
    </Modal>
  );
};

export default AssignStudy;
