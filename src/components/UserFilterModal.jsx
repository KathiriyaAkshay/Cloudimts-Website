import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useContext } from "react";
import { filterDataContext } from "../hooks/filterDataContext";

const UserFilterModal = ({ name, setInstitutionData, retrieveUsersData }) => {
  const { isUserFilterModalOpen, setIsUserFilterModalOpen} =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    retrieveUsersData({ page: 1 }, values);
    setIsUserFilterModalOpen(false);
    // filterInstitutionData({
    //   filter: values,
    //   condition: "and",
    //   page_number: 1,
    //   page_size: 10,
    // })
    //   .then((res) => {
    //     setInstitutionData(res.data.data);
    //     setIsFilterModalOpen(false);
    //   })
    //   .catch((err) => console.log(err));
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isUserFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setIsUserFilterModalOpen(false);
        retrieveUsersData();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setIsUserFilterModalOpen(false);
            retrieveUsersData();
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
              name="user__username"
              label="Username"
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
              name="user__email"
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
          <Col xs={24} lg={12}>
            <Form.Item
              name="contact"
              label="Contact"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter contact",
                },
              ]}
            >
              <Input placeholder="Enter Contact" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="role__role_name"
              label="Role Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Role Name",
                },
              ]}
            >
              <Input placeholder="Enter Role Name" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="institute__name"
              label="Institute Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Institute Name",
                },
              ]}
            >
              <Input placeholder="Enter Institute Name" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserFilterModal;
