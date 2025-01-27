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
  Col,
  Button,
  Divider,
  Space
} from "antd";
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  createStudyDescription,
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
import { UserPermissionContext } from "../../hooks/userPermissionContext";
import { PlusOutlined } from "@ant-design/icons";
import { RADIOLOGIST } from "../../constant/radiologist.role";
import { getStudyModalityList, getStudyDescriptionList } from "../../apis/studiesApi";

const AssignStudy = ({
  isAssignModalOpen,
  setIsAssignModalOpen,
  studyID,
  setStudyID,
  studyReference
}) => {

  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [institutionRadiologist, setInstitutionRadiologist] = useState([]);
  const [multipleImageFile, setMultipleImageFile] = useState([]);
  const [value, setValues] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [assignUserId, setAssignUserId] = useState(null);
  const [modalityOptions, setModalityOptions] = useState([]);
  const [modalityOptionsLoading, setModalityOptionsLoading] = useState(false) ; 
  const [items, setItems] = useState([]);
  const [studyDescriptionLoading, setStudyDescriptionLoading] = useState(false) ; 
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = async (e) => {
    try {
      e.preventDefault();
    } catch (error) {
    }

    if (name !== "" && name !== undefined && name !== null){
      setItems([{ label: name, value: name }, ...items]);
      await InsertStudyDescription({study_description: name})
      setName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const InsertStudyDescription = async (params) => {
    await createStudyDescription(params)
      .then((res) => {
        
      }).catch((error) => {

      })
  }

  // Permission information context
  const { permissionData } = useContext(UserPermissionContext);

  const otherPremissionStatus = (title, permission_name) => {
    const permission = permissionData[title]?.find(
      data => data.permission === permission_name
    )?.permission_value
    return permission
  }

  // **** Reterive particular assign study details **** // 
  const retrieveAssignStudyDetails = async () => {
    setIsLoading(true);
    await fetchAssignStudy({ id: studyID })
      .then((res) => {
        if (res.data.status) {
          setAssignUserId(res?.data?.assign_user[0]?.assign_user_id);
          let study_description = res?.data?.study_description ; 
          // Check existing study description related records 
          let findElement = items?.filter((element) => String(element?.value).toLowerCase() == String(study_description).toLowerCase()) ; 
          if (findElement?.length == 0){
            setName(study_description)
            addItem() ; 
          }

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
              value: resData?.Patient_id ?? "-",
            },
            {
              name: "Patient Name",
              value: resData?.Patient_name ?? "-",
            },
            {
              name: "Institution Name",
              value: resData?.institution?.Institution_name ?? "-",
            },
            {
              name: "Study UID",
              value: resData?.Study_UID ?? "-",
            },
            {
              name: "Series UID",
              value: resData?.Series_UID ?? "-",
            },
            {
              name: "Assign time",
              value: resData?.study_assign_time ?? "-",
            },
            {
              name: "Assign Radiologist",
              value: resData?.study_assign_username ?? "-",
            },
            {
              name: "Reporting Time",
              value: resData?.reporting_time ?? "-",
            },
            {
              name: "Accession Number",
              value: resData?.Accession_number ?? "-",
            },
            {
              name: "Modality",
              value: resData?.Modality ?? "-",
            },
            {
              name: "Gender",
              value: resData?.Gender ?? "-",
            },
            {
              name: "Date of birth",
              value: resData?.DOB ?? "-",
            },
            {
              name: "Study Description",
              value: resData?.Study_description ?? "-",
            },
            {
              name: "Study history",
              value: resData?.Patient_comments ?? "-",
            },
            {
              name: "Study date",
              value: resData?.Created_at ?? "-",
            },
            {
              name: "Urgent Case",
              value: resData?.urgent_case ?? "-",
            },
            {
              name: "Performing Physician Name",
              value: resData?.Performing_physician_name ?? "-",
            },
            {
              name: "Referring Physician Name",
              value: resData?.Referring_physician_name ?? "-",
            },
          ];

          setModalData(modifiedData);

          // ******** Fetch particular institution radiologist ******* // 
          const FetchRadiologist = async () => {
            let requestPayload = {
              institution_id: resData?.institution_id,
            };

            let responseData = await APIHandler(
              "POST",
              requestPayload,
              "studies/v1/fetch-institution-radiologist?is_central_radiologist=true"
            );

            if (responseData["status"] === true) {
              const resData = responseData.data.map((data) => ({
                label: data.name,
                value: data.id,
                "role": RADIOLOGIST,
                "time": data?.time
              }));

              const center_owner_radiologist = responseData?.center_owner_radiologist?.map((element) => ({
                label: element.name,
                value: element.id,
                "role": element?.role,
                "time": element?.time
              }))

              let temp = [...center_owner_radiologist, ...resData] ; 
              const uniqueData = temp.reduce((acc, current) => {
                const existing = acc.find(item => item.value === current.value);
                if (!existing) {
                  acc.push(current);
                }
                return acc;
              }, []);
              setInstitutionRadiologist([...uniqueData]);
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
        if (element?.id === assignUserId) {
          const exists = institutionRadiologist.indexOf({ label: element?.name, value: element?.id });
          if (exists != -1) {
            setInstitutionRadiologist(institutionRadiologist => [...institutionRadiologist, { label: element?.name, value: element?.id }])
          }
        }
      })


    }
  };

  // **** Retervice particular institution radiologist *** // 
  const [form] = Form.useForm();

  // **** Assign study handler **** // 
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
        study_data: {
          images: [],
        },
        number_of_report: values?.number_of_report
      };

      if (values?.radiologist !== undefined) {
        modifiedPayload['assign_user'] = values?.radiologist
      } else {
        modifiedPayload['assign_user'] = null;
      }

      if (multipleImageFile !== undefined) {
        modifiedPayload['study_data']['images'] = [...multipleImageFile, ...images]
      } else {
        modifiedPayload['study_data']['images'] = [...images]
      }

      modifiedPayload["modality"] = values?.modality;

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

  // **** Reterive institution modality name list options **** // 
  const FetchInstitutionModalityList = async () => {
    let requestPayload = {};
    let responseData = await APIHandler(
      "GET",
      requestPayload,
      "institute/v1/modality/fetch"
    );
    if (responseData?.status) {

      // Add Institution radiologist related information
      const resData = responseData?.data?.map((element) => ({
        label: element?.name,
        value: element?.id
      }))

      setModalityOptions([...resData]);
    }

  }

  // ***** Reterive all modality list related information ***** // 
  const FetchModalityList = async () => {
    setModalityOptionsLoading(true); 
    await getStudyModalityList({})
      .then((res) => {
        let tempOptions = res?.data?.data?.map((element) => {
          return {
            label : element?.modality, 
            value: element?.modality
          }
        })
        setModalityOptions(tempOptions) ; 
      }).catch((error) => {
      })
    setModalityOptionsLoading(false); 
  }

  // **** Reterive all study description list related information **** // 
  const FetchStudyDescriptionList = async () => {
    setStudyDescriptionLoading(true) ; 
    await getStudyDescriptionList({})
      .then((res) => {
        let tempOtion = res?.data?.data?.map((element) => {
          return {
            label: element?.study_description, 
            value: element?.study_description
          }
        })
        setItems(tempOtion) ; 
      }).catch((error) => {})
    setStudyDescriptionLoading(false) ; 
  }
  


  useEffect(() => {
    if (studyID && isAssignModalOpen) {
      retrieveStudyData();
      setValues([]);
      // FetchRadiologist();
      // FetchInstitutionModalityList();
      retrieveAssignStudyDetails();
      FetchStudyDescriptionList() ; 
      FetchModalityList() ; 
    }
  }, [studyID, isAssignModalOpen]);

  return (
    <Modal
      title="Clinical History"
      open={isAssignModalOpen}
      footer={
        otherPremissionStatus("Studies permission", "Clinical Assign")
          ? <>
            <Button type="primary" onClick={() => {
              form.submit()
            }}>
              Ok
            </Button>
          </>   // Empty footer if permission exists
          : null // Hide footer if no permission
      }
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

          <div className="Study-modal-input-option-division" style={{ width: "50%", height: "100%", overflow: "hidden" }}>
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
                      >
                        <Select
                          placeholder="Select Radiologist"
                          showSearch
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.label ?? "").toLowerCase())
                          }
                        >
                          {institutionRadiologist?.map((element) => (
                            <Select.Option key={element?.value} value={element?.value}>
                              <div>
                                <span style={{fontWeight: 600}}>
                                  {String(element?.label).toUpperCase()}
                                </span>
                                {/* <span style={{marginLeft: 4, marginRight: 4}}>|</span> */}
                                {/* <span style={{marginLeft: "auto"}}>
                                  {element?.role}
                                </span> */}
                              </div>
                            </Select.Option>
                          ))}
                        </Select>

                      </Form.Item>
                    </Col>
                    <Col span={11}>

                      {/* Study description selection  */}

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
                          showSearch
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare((optionB?.label ?? "").toLowerCase())
                          }
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider
                                style={{
                                  margin: '8px 0',
                                }}
                              />
                              <Space
                                style={{
                                  padding: '0 8px 4px',
                                }}
                              >
                                <Input
                                  placeholder="Please enter item"
                                  ref={inputRef}
                                  value={name}
                                  onChange={onNameChange}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                  Add item
                                </Button>
                              </Space>
                            </>
                          )}
                          options={items.map((item) => ({
                            label: item?.label,
                            value: item?.value,
                          }))}

                        />
                      </Form.Item>

                    </Col>
                  </Row>

                  <Row justify="space-between">

                    {/* Number of report information  */}
                    <Col span={5}>
                      <Form.Item
                        name="number_of_report"
                        label="Num of Report"
                        rules={[
                          {
                            required: true,
                            message: "Please enter number of report value"
                          }
                        ]}
                      >
                        <Input />
                      </Form.Item>

                    </Col>
                    
                    {/* Modality selection  */}
                    {modalityOptions?.length > 0 && (

                      <Col span={5}>
                        <Form.Item
                          name="modality"
                          label="Modality"
                          rules={[
                            {
                              required: true,
                              message: "Please Seelct modality"
                            }
                          ]}
                        >
                          <Select
                            className="clinical-history-modality-selection"
                            placeholder="Select Study Description"
                            options={modalityOptions}
                            loading = {modalityOptionsLoading}
                            showSearch
                            onChange={(values, option) => {
                              form.setFieldValue("modality", option?.label);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    )}

                    <Col span={11}>

                      {/* Case type selection  */}
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

                    </Col>
                  </Row>

                  <Row>
                    {/* Clinical history information  */}
                    <Col span={24}>
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
                        <Input.TextArea placeholder="Enter Clinical History" rows={5} />
                      </Form.Item>
                    </Col>
                  </Row>

                </div>

                <div className="Assign-study-specific-option">

                  {/* Upload image information  */}
                  <UploadImage
                    multipleImage={true}
                    multipleImageFile={multipleImageFile}
                    values={value}
                    setValues={setValues}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    setMultipleImageFile={setMultipleImageFile}
                    isClinicalHistory={true}
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
