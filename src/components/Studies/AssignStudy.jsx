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
  Row,
  Col
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
  const [institutionRadiologist, setInstitutionRadiologist] = useState([]) ; 
  const [multipleImageFile, setMultipleImageFile] = useState([]);
  const [value, setValues] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [assignUserId, setAssignUserId] = useState(null) ; 

  // **** Reterive particular assign study details **** // 
  const retrieveAssignStudyDetails = async () => {
    setIsLoading(true);
    await fetchAssignStudy({ id: studyID })
      .then((res) => {
        if (res.data.status) {
          setAssignUserId(res?.data?.assign_user[0]?.assign_user_id) ; 
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

  // **** Reterive particular study data **** // 
  const retrieveStudyData = async () => {
    setIsLoading(true);
    getStudyData({ id: studyID })
      .then((res) => {
        if (res.data.status) {
          const resData = res.data.data;
          const modifiedData = [
            {
              name: "Patient id",
              value: resData?.Patient_id
            },

            {
              name: "Patient Name",
              value: resData?.Patient_name,
            },


            {
              name: "Assign time",
              value: resData?.study_assign_time,
            },

            {
              name: "Assign Radiologist",
              value: resData?.study_assign_username,
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

          // **** Fetch particular institution radiologist **** // 

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

              setInstitutionRadiologist(institutionRadiologist=>[ ...resData]) ; 
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

  // **** Retervice all radiologist data **** // 

  const FetchRadiologist = async () => {

    let requestPayload = {};

    let responseData = await APIHandler(
      "POST",
      requestPayload,
      "institute/v1/fetch-radiologist-name"
    );

    if (responseData["status"] === true) {

      responseData?.data?.map((element) => {
        if (element?.id === assignUserId){
          const exists=institutionRadiologist.indexOf({label: element?.name, value:element?.id});
          if(exists!=-1){
            setInstitutionRadiologist(institutionRadiologist=>[...institutionRadiologist, {label: element?.name, value:element?.id}])
          } 
        }
      })


    }
  };

  // **** Retervice particular institution radiologist *** // 

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setIsLoading(true);

    const payloadObj = omit(values, ["radiologist", "url"]);
    const images = [];

    if (value?.length !== null) {

      for (const data of value) {
        try {
          const formData = {
            image: data?.url,
          };

          const res = await uploadImage(formData);
          images.push(res.data.image_url);

        } catch (err) {
          console.error(err);
        }
      }
    }

    try {

      let modifiedPayload = {
        ...payloadObj,
        id: studyID,
        assign_user: values.radiologist,
        study_data: {
          images: [],
        },
      };

      if (multipleImageFile !== undefined) {
        modifiedPayload['study_data']['images'] = [...multipleImageFile, ...images]
      } else {
        modifiedPayload['study_data']['images'] = [...images]
      }

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


  useEffect(() => {
    if (studyID && isAssignModalOpen) {
      retrieveStudyData();
      retrieveAssignStudyDetails();
      setValues([]);
    }
  }, [studyID]);

  useEffect(() => {
    FetchRadiologist() ; 
    if (assignUserId !== null){
    }
  }, [assignUserId, studyID]) ; 


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
        setInstitutionRadiologist([]);
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
                  <div style={{ width: "29%", color: "#000000" }}>{item.name}</div>
                  <div style={{ width: "4%" }}>:</div>
                  <div style={{ width: "65%" }}>
                    {item.name === "Patient id" ||
                      item.name === "Patient Name" ||
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

          <div className="Study-modal-input-option-division" style={{ width: "50%", height: "100%",overflow:"hidden" }}>
            <Form
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              form={form}
              onFinish={handleSubmit}
              className=""
              style={{ height: "100%" }}
            >
              <div className="Assign-study-upload-option-input-layout">
                <div className="Assign-study-specific-option ">

                  <Row justify="space-between">
                    <Col span={11}>

                  {/* **** Show paarticular institution radiologist ****  */}

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
                      options={institutionRadiologist}
                      showSearch
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                    />
                  </Form.Item>
                  </Col>
                  <Col span={11}>

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

                    </Col>
                  </Row>





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
