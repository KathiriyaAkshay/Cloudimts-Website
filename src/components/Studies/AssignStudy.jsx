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
  studyReference
}) => {

  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [multipleImageFile, setMultipleImageFile] = useState([]);
  const [value, setValues] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setIsLoading(true);

    const payloadObj = omit(values, ["radiologist", "url"]);
    const images = [];

    if (value?.length !== null) {
      
      for (const data of value) {
        try {
          const formData = {
            image: data?.url  ,
          };

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
          images: [...multipleImageFile, ...images],
        },
      };
    
      await postAssignStudy(modifiedPayload)
        .then((res) => {
          if (res.data.status) {
            NotificationMessage("success", "Study Assigned Successfully");
            setIsAssignModalOpen(false);
            setStudyID(null);
            form.resetFields();
          } else {
            NotificationMessage(
              "warning",
              "Network request failed",
              res.data.message
            );
          }
        })
        .catch((err) =>
          NotificationMessage(
            "warning",
            "Network request failed",
            err.response.data.message
          )
        );
    } catch (err) {
      NotificationMessage("warning", err);
    }
    setIsLoading(false);
  };

  const retrieveAssignStudyDetails = async () => {
    setIsLoading(true);
    await fetchAssignStudy({ id: studyID })
      .then((res) => {
        if (res.data.status) {
          form.setFieldsValue({
            ...res.data?.data,
            radiologist: res.data?.assign_user?.map(
              (data) => data?.assign_user_id
            )[0],
          });
          setMultipleImageFile(res.data.data?.study_data?.images);
        } else {
          NotificationMessage(
            "warning",
            "Assign Study",
            res.data.message
          );
        }
      })
      .catch((err) =>
        NotificationMessage(
          "warning",
          "Assign Study",
          err.response.data.message
        )
      );
    setIsLoading(false);
  };

  const retrieveStudyData = async () => {
    setIsLoading(true);
    getStudyData({ id: studyID })
      .then((res) => {
        if (res.data.status) {
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
              name: "Assign study time",
              value: resData?.study_assign_time,
            },

            {
              name: "Assign study username",
              value: resData?.study_assign_username,
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
            {
              name: "Patient's comments",
              value: resData?.Patient_comments,
            },
          ];

          setModalData(modifiedData);

          // Fetch radiologist name based on Institution id

          const FetchRadiologist = async () => {
            let requestPayload = {
              institution_id: resData?.institution_id,
            };

            let responseData = await APIHandler(
              "POST",
              requestPayload,
              "studies/v1/fetch-institution-radiologist"
            );

            if (responseData["status"] === true) {
              const resData = responseData.data.map((data) => ({
                label: data.name,
                value: data.id,
              }));

              setOptions(resData);
            }
          };

          FetchRadiologist();
        } else {
          NotificationMessage(
            "warning",
            "Assign Study",
            res.data.message
          );
        }
      })
      .catch((err) =>
        NotificationMessage(
          "warning",
          "Assign Study",
          err.response.data.message
        )
      );
    setIsLoading(false);
  };


  useEffect(() => {
    if (studyID && isAssignModalOpen) {
      retrieveStudyData();
      retrieveAssignStudyDetails();
    }
  }, [studyID]);


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
        height: '80vh'
      }}
      className="assign-study-modal clinical-history-modal"
    >
      <Spin spinning={isLoading} style={{ height: "100%" }}>
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
          <div>Patient Info | Reference id : {studyReference}</div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {modalData.find((data) => data.name === "urgent_case")?.value
              ?.urgent_case && <Tag color="error">Urgent</Tag>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
          <List
            style={{ marginTop: "8px", width: "50%" }}
            grid={{
              gutter: 1,
              column: 1,
            }}
            className="assign-queue-status-list study-modal-patient-info-layout"
            dataSource={modalData?.filter((data) => data.name !== "urgent_case")}
            renderItem={(item) => (
              <List.Item className="queue-number-list">
                <Typography
                  style={{ display: "flex", gap: "2px", fontWeight: "600", flexWrap: "wrap" }}
                >
                  <div style={{ width: "29%" }}>{item.name}</div><div style={{ width: "4%" }}>:</div><div style={{ width: "60%" }}>
                    {item.name === "Patient's id" ||
                      item.name === "Patient's Name" ||
                      item.name === "Study UID" ||
                      item.name === "Institution Name" ||
                      item.name === "Series UID" ||
                      item.name === "Assign study time" ||
                      item.name === "Assign study username" ? (
                      item.value !== undefined ? <>
                        <Tag color="#87d068" className="Assign-study-info-tag">
                          {item.value}
                        </Tag>
                      </> : <></>
                    ) : (
                      <Typography style={{ fontWeight: "400" }}>
                        {item.value}
                      </Typography>
                    )}
                  </div>
                </Typography>
              </List.Item>
            )}
          />

          <div className="Study-modal-input-option-division" style={{ width: "50%", height: "100%" }}>
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
              style={{ height: "100%" }}
            >
              <div className="Assign-study-upload-option-input-layout">
                <div className="Assign-study-specific-option">

                  {/* Radiologist selection dropDown  */}

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

                  {/* Study description  */}

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
                      showSearch
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                    />
                  </Form.Item>
                  
                  {/* Clinical history information  */}

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
                  
                  {/* Uregent case information  */}

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

                  {/* Upload image information  */}

                  <UploadImage
                    multipleImage={true}
                    multipleImageFile={multipleImageFile}
                    values={value}
                    setValues={setValues}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    setMultipleImageFile={setMultipleImageFile}
                  />
                </div>
              </div>
            </Form>
          </div>


        </div>

      </Spin>
    </Modal>
  );
};

export default AssignStudy;
