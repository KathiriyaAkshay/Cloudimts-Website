import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";

const UserFilterModal = ({ name, setInstitutionData, retrieveUsersData }) => {
  const { isUserFilterModalOpen, setIsUserFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const { setIsFilterSelected } = useContext(FilterSelectedContext);

  useEffect(() => {
    setIsFilterSelected(false);
  }, []);

  const handleSubmit = (values) => {
    const modifiedValues = {
      ...values,
      created_at__startswith:
        values?.created_at__startswith &&
        values?.created_at__startswith?.format("YYYY-MM-DD"),
    };
    retrieveUsersData({ page: 1 }, modifiedValues);
    setIsUserFilterModalOpen(false);
    setIsFilterSelected(true);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isUserFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        // form.resetFields();
        setIsUserFilterModalOpen(false);
        // retrieveUsersData();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            // form.resetFields();
            setIsUserFilterModalOpen(false);
            // retrieveUsersData();
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.resetFields();
            setIsUserFilterModalOpen(false);
            retrieveUsersData();
            setIsFilterSelected(false);
          }}
        >
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
              name="user__username__icontains"
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
              name="email__icontains"
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
              name="contact__icontains"
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
              name="role__role_name__icontains"
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
              name="institution__name__icontains"
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
          <Col xs={24} lg={12}>
            <Form.Item
              name="created_at__startswith"
              label="Created At"
              rules={[
                {
                  required: false,
                  message: "Please enter Created At",
                },
              ]}
            >
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="user__is_active"
              label="User Status"
              className="category-select"
              rules={[
                {
                  required: false,
                  message: "Please enter User Status",
                },
              ]}
            >
              <Select
                placeholder="Select Status"
                options={[
                  { label: "Disabled", value: false },
                  { label: "Enabled", value: true },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserFilterModal;
