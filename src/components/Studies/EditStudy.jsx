import { Col, DatePicker, Form, Input, Modal, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getStudyData, updateStudyData } from "../../apis/studiesApi";
import NotificationMessage from "../NotificationMessage";
import dayjs from "dayjs";

const EditStudy = ({
  isEditModalOpen,
  setIsEditModalOpen,
  studyID,
  setStudyID,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (studyID && isEditModalOpen) {
      retrieveStudyData();
    }
  }, [studyID]);

  const retrieveStudyData = () => {
    setIsLoading(true);
    getStudyData({ id: studyID })
      .then((res) => {
        const resData = res.data.data.information;
        const modifiedData = {
          patient_id:
            resData.study__study_metadata.PatientMainDicomTags.PatientID,
          patient_name:
            resData.study__study_metadata.PatientMainDicomTags.PatientName,
          accession_number:
            resData.study__study_metadata.MainDicomTags.AccessionNumber,
          study_description: resData.study_description,
          dob:
            resData.study__study_metadata.PatientMainDicomTags
              .PatientBirthDate &&
            dayjs(
              resData.study__study_metadata.PatientMainDicomTags
                .PatientBirthDate,
              "DD/MM/YYYY"
            ),
          gender:
            resData.study__study_metadata.PatientMainDicomTags?.PatientSex,
          referring_physician:
            resData.study__study_metadata.MainDicomTags?.ReferringPhysicianName,
        };
        form.setFieldsValue(modifiedData);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const handleSubmit = (values) => {
    console.log(values);
    const modifiedData = {
      ...values,
      id: studyID,
      dob: values.dob.format("DD/MM/YYYY"),
    };
    updateStudyData(modifiedData)
      .then((res) => {
        NotificationMessage("success", "Study Updated Successfully");
        setStudyID(null);
        setIsEditModalOpen(false);
        form.resetFields();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      title="Edit Study"
      open={isEditModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setStudyID(null);
        setIsEditModalOpen(false);
      }}
      width={1000}
      centered
    >
      <Spin spinning={isLoading}>
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
            <Col lg={12}>
              <Form.Item
                name="patient_id"
                label="Patient's Id"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Patient's Id",
                  },
                ]}
              >
                <Input placeholder="Enter Patient's Id" disabled />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                name="patient_name"
                label="Patient's Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Patient's Name",
                  },
                ]}
              >
                <Input placeholder="Enter Patient's Name" />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                name="accession_number"
                label="Accession Number"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Accession Number",
                  },
                ]}
              >
                <Input placeholder="Enter Accession Number" />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[
                  {
                    required: true,
                    message: "Please enter DOB",
                  },
                ]}
              >
                <DatePicker format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                name="study_description"
                label="Description"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Description",
                  },
                ]}
              >
                <Input placeholder="Enter Description" />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Gender",
                  },
                ]}
              >
                <Input placeholder="Enter Gender" />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                name="referring_physician"
                label="Referring Physician"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Referring Physician",
                  },
                ]}
              >
                <Input placeholder="Enter Referring Physician" />
              </Form.Item>
            </Col>
            {/* <Col lg={12}>
              <Form.Item
                name="country"
                label="Study Series Count"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Study Series Count",
                  },
                ]}
              >
                <Input placeholder="Enter Study Series Count" />
              </Form.Item>
            </Col> */}
            {/* <Col lg={12}>
              <Form.Item
                name="country"
                label="Operator Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Operator Name",
                  },
                ]}
              >
                <Input placeholder="Enter Operator Name" />
              </Form.Item>
            </Col> */}
            {/* <Col lg={12}>
              <Form.Item
                name="country"
                label="Institution Name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter Institution Name",
                  },
                ]}
              >
                <Input placeholder="Enter Institution Name" />
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditStudy;
