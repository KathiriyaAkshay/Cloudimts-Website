import { Form, List, Modal, Select, Spin, Tag, Typography } from "antd";
import React, { useEffect, useState, useContext } from "react";
import {
  fetchAssignStudy,
  getStudyData,
  postAssignStudy,
  uploadImage,
} from "../../apis/studiesApi";
import { omit } from "lodash";
import NotificationMessage from "../NotificationMessage";
import APIHandler from "../../apis/apiHandler";
import { StudyIdContext } from "../../hooks/studyIdContext"; 

const AssignStudyModified = ({
  isAssignModifiedModalOpen,
  setIsAssignModifiedModalOpen,
  studyID,
  setStudyID,
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [multipleImageFile, setMultipleImageFile] = useState([]);
  const [form] = Form.useForm();
  const { studyIdArray } = useContext(StudyIdContext) ; 

  // Fetch radiologist name based on Institution id

  const FetchRadiologist = async () => {

    let requestPayload = { };

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

      setOptions(resData) ; 
     
    }
  };

  useEffect(() => {
    FetchRadiologist() ;
  }, []) ; 

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
          if (res.data.status) {
            NotificationMessage("success", "Study Assigned Successfully");
            setIsAssignModifiedModalOpen(false);
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

  return (
    <Modal
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
          <div>StudyId Info</div>
        </div>

        <div className="Study-modal-input-option-division"  style={{borderTop: "0px", paddingTop: 0}}>

          <div className="assign_studies_all_id_list">
            {studyIdArray.map((element) => {
              return(
                <div className="particular_assign_study_id_information">
                  {element}
                </div>
              )
            })}
           
          </div>

          <div className="Assign-study-upload-option-input-layout" style={{marginTop: 20  }}>

            <div className="quick-assign-study-division">

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
                style={{marginTop: "auto"}}
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

            </div>

          </div>

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
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default AssignStudyModified;
