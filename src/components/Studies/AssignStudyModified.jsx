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
  const [form] = Form.useForm();
  const { studyIdArray, setStudyIdArray, studyReferenceIdArray } = useContext(StudyIdContext);
  const [seriesIdList, setSeriesIdList] = useState([]) ; 

  const [radiologistType, setRadiologistType] = useState(undefined);
  const [referralRadiologist, setReferralRadiologist] = useState(undefined) ; 

  const [options, setOptions] = useState([]);
  const [referralRadiologistOption, setReferralRadiologistOption] = useState([]) ; 

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
    let request_url = `institute/v1/fetch-radiologist-name`; 
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
      
      const referralData = responseData["radiologist"]?.map((element) => ({
        label: element?.name, 
        value: element?.id, 
        ...element
      }))
      setReferralRadiologistOption(referralData)
    }
  };

  useEffect(() => {
    FetchRadiologist();
  }, []);

  // Quick assign related handler =========================================
  const handleSubmit = async (values) => {

    if (radiologistType == undefined && referralRadiologist == undefined){
      NotificationMessage("warning", "Please, Select cloudimts radiologist or Referral radiologist") ; 
    } else {
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
        let requestPayload = { "studyId": studyIdArray, "assign_user": radiologistType == undefined?referralRadiologist:radiologistType };
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
                className="mt"
              >

                {/* Cloudimts radiologist selection option  */}
                <Form.Item
                  label = "Cloudimts Radiologist"
                  name="radiologist_type"
                  className="category-select"
                  style={{ marginTop: "auto", width: "100%" }}
                >
                  <Select
                    placeholder="Cloudimts Radiologist"
                    showSearch
                    value={radiologistType}
                    onChange={(event) => {
                      setRadiologistType(event)
                      setReferralRadiologist(undefined) ;
                    }}
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

                {/* Refferal Radiologist selection  */}
                <Form.Item
                  label="Referral Radiologist"
                  name="radiologist"
                  className="category-select"
                  style={{ marginTop: "auto", width: "100%" }}
                >
                  <Select
                    placeholder="Select Referral Radiologist"
                    showSearch
                    value = {referralRadiologist}
                    onChange={(event) => {
                      setReferralRadiologist(event) ; 
                      setRadiologistType(undefined) ; 
                    }}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                  >
                    {referralRadiologistOption?.map((element) => (
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
