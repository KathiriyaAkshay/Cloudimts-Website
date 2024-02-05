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

  // **** Retervie all radiologist name for assign study **** // 
  const FetchRadiologist = async () => {

    let requestPayload = {};

    let responseData = await APIHandler(
      "POST",
      requestPayload,
      "institute/v1/fetch-radiologist-name"
    );

    if (responseData["status"] === true) {

      const resData = responseData['data'].map((element) => ({
        label: element.name,
        value: element.id
      }))

      setOptions(resData);

    }
  };


  useEffect(() => {
    FetchRadiologist();
  }, []);

  const handleSubmit = async (values) => {
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
            {studyReferenceIdArray.map((element) => {
              return (
                <div className="particular_assign_study_id_information">
                  {element}
                </div>
              )
            })}

          </div>

          <div className="Assign-study-upload-option-input-layout" style={{ marginTop: 20 }}>

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
                    options={options}
                    showSearch
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                  />
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
