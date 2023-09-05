import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useContext } from "react";
import { filterDataContext } from "../hooks/filterDataContext";

const EmailFilterModal = ({ name, setInstitutionData, retrieveEmailData }) => {
  const { isEmailFilterModalOpen, setIsEmailFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    retrieveEmailData({ page: 1 }, values);
    setIsEmailFilterModalOpen(false);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isEmailFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setIsEmailFilterModalOpen(false);
        retrieveEmailData();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setIsEmailFilterModalOpen(false);
            retrieveEmailData();
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
              name="full_name__contains"
              label="Full Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Username",
                },
              ]}
            >
              <Input placeholder="Enter Username" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="email__contains"
              label="Email"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Email",
                },
              ]}
            >
              <Input placeholder="Enter Email" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmailFilterModal;
