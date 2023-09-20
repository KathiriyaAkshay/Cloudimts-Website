import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import React, { useContext } from "react";
import { filterDataContext } from "../hooks/filterDataContext";

const QuickFilterModal = ({ name, setInstitutionData, retrieveStudyData }) => {
  const { isStudyFilterModalOpen, setIsStudyFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    retrieveStudyData({ page: 1 }, values);
    setIsStudyFilterModalOpen(false);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isStudyFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setIsStudyFilterModalOpen(false);
        retrieveStudyData();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setIsStudyFilterModalOpen(false);
            retrieveStudyData();
          }}
        >
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.resetFields()}>
          Clear Filter
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Apply
        </Button>,
      ]}
    >
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        form={form}
        onFinish={handleSubmit}
        autoComplete={"off"}
      >
        <Row gutter={15}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="study__patient_name__icontains"
              label="Patient Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Patient Name",
                },
              ]}
            >
              <Input placeholder="Enter Patient Name" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="study__patient_id__icontains"
              label="Patient Id"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Patient Id",
                },
              ]}
            >
              <Input placeholder="Enter Patient Id" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="modality__icontains"
              label="Modality"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Modality",
                },
              ]}
            >
              <Input placeholder="Enter Modality" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="status__icontains"
              label="Status"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Status",
                },
              ]}
            >
              <Input placeholder="Enter Status" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="institution__name__icontains"
              label="Institution Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Institution Name",
                },
              ]}
            >
              <Input placeholder="Enter Institution Name" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="created_at__startswith"
              label="Created At"
              rules={[
                {
                  required: false,
                  message: "Please enter date",
                },
              ]}
            >
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default QuickFilterModal;
