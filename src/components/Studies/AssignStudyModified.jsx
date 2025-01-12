import { Form, Modal, Select, Spin } from "antd";
import React, { useEffect, useState, useContext } from "react";
import NotificationMessage from "../NotificationMessage";
import APIHandler from "../../apis/apiHandler";
import { StudyIdContext } from "../../hooks/studyIdContext";

const AssignStudyModified = ({
  isAssignModifiedModalOpen,
  setIsAssignModifiedModalOpen,
  setStudyID,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [form] = Form.useForm();
  const { studyIdArray, setStudyIdArray, studyReferenceIdArray } = useContext(StudyIdContext);
  const [seriesIdList, setSeriesIdList] = useState([]) ; 
  const [radiologistType, setRadiologistType] = useState("cloudimts_radiologist");  

  useEffect(() => {
    let temp = [] ; 
    studyReferenceIdArray?.map((element) => {
      temp.push(element?.refernce_id)
    })
    setSeriesIdList(temp) ;
  }, []) ; 
  

  // **** Retervie all radiologist name for assign study **** // 
  const FetchRadiologist = async () => {
    let requestPayload = {};
    let request_url = undefined ; 
    if (radiologistType == "cloudimts_radiologist"){
      request_url = `institute/v1/fetch-radiologist-name?is_cloudimts_radiologist=true`
    } else {
      request_url = `institute/v1/fetch-radiologist-name`
    }
    let responseData = await APIHandler(
      "POST",
      requestPayload,
      request_url
    );
    if (responseData["status"] === true) {
      const resData = responseData['data'].map((element) => ({
        label: element.name,
        value: element.id, 
        ...element
      }))

      setOptions(resData);

    }
  };


  useEffect(() => {
    FetchRadiologist();
  }, [radiologistType]);

  const handleSubmit = async (values) => {

    let is_assign = true;  

    studyReferenceIdArray?.map((element) => {
      if (element?.study_description == null || element?.study_description == ""){
        NotificationMessage("warning", `Please provide a study description for the study with reference ID: ${element?.refernce_id}`);
        is_assign = false ; 
        return ; 
      }
    })

    if (is_assign){
      setIsLoading(true);
  
      let requestPayload = { "studyId": studyIdArray, "assign_user": values?.radiologist };
  
      let responseData = await APIHandler("POST", requestPayload, "studies/v1/quick-assign-study");
  
      setIsLoading(false);
  
      if (responseData === false) {
        NotificationMessage("warning", "Network request failed");
      } else if (responseData['status'] === true) {
        setIsAssignModifiedModalOpen(false);
        setStudyIdArray([]);
        NotificationMessage("success", "Study assigned successfully");
      } else {
        NotificationMessage("warning", "Network request failed", responseData['message']);
      }
    }

  };

  return (
    <Modal
      className="quick-assign-study-modal"
      title="Quick Assign study"
      open={isAssignModifiedModalOpen}
      centered
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setStudyID(null);
        setIsAssignModifiedModalOpen(false);
        form.resetFields();
      }}
      width={"40%"}

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
          <div>Reference ids</div>
        </div>

        <div style={{ marginTop: "1rem" }}>

          <div className="assign_studies_all_id_list">
            {seriesIdList.map((element) => {
              return (
                <div className="particular_assign_study_id_information">
                  {element}
                </div>
              )
            })}

          </div>

          <div className="Assign-study-upload-option-input-layout" style={{ marginTop: 5 }}>

            <div className="quick-assign-study-division w-100">

              <Form
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                  radiologist_type: "cloudimts_radiologist"
                }}
                className="mt"
              >

                {/* Radiologist option selection  */}
                <Form.Item
                  name="radiologist_type"
                  className="category-select"
                  rules={[
                    {
                      required: true,
                      message: "Please select radiologist",
                    },
                  ]}
                  style={{ marginTop: "auto", width: "100%" }}
                >
                  <Select
                    placeholder="Radiologist type"
                    options={[
                      {label: "Cloudimts Radiologist", value: "cloudimts_radiologist"}, 
                      {label: "Radiologist / Referral Physicians", value: "radiologist"}
                    ]}
                    showSearch
                    value={radiologistType}
                    onChange={(event) => {
                      setRadiologistType(event)
                    }}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                  />
                </Form.Item>

                {/* Radiologist selection  */}
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
                  style={{ marginTop: "auto", width: "100%" }}
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
                    {options?.map((element) => (
                      <Select.Option key={element?.value} value = {element?.value}>
                        <div>
                          <span style={{fontWeight: 600}}>
                            {String(element?.label).toUpperCase()}
                          </span>
                          <span style={{marginLeft: 4, marginRight: 4}}>|</span>
                          <span style={{color: "blue", marginRight: 4}}>
                            {`${element?.role } => ${element?.institution}`}
                          </span>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

              </Form>

            </div>

          </div>

        </div>
      </Spin>
    </Modal>
  );
};

export default AssignStudyModified;
