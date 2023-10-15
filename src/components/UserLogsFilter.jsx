import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext } from "react";
import { filterDataContext } from "../hooks/filterDataContext";

const eventTypeOptions = [
  {
    label: "User create",
    value: 1,
  },
  {
    label: "User basic details update",
    value: 2,
  },
  {
    label: "User modality details update",
    value: 3,
  },
  {
    label: "User instituition details update",
    value: 4,
  },
  {
    label: "User password update",
    value: 5,
  },
  {
    label: "User login",
    value: 6,
  },
  {
    label: "Update Signature image",
    value: 7,
  },
  {
    label: "User disable",
    value: 8,
  },
  {
    label: "User enable",
    value: 9,
  },
];

const UserLogsFilter = ({ name, retrieveRoleData, setFilterValues }) => {
  const { isUserLogsFilterModalOpen, setIsUserLogsFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    setFilterValues({
      ...values,
      time__startswith:
        values?.time__startswith &&
        values?.time__startswith.format("YYYY-MM-DD"),
    });
    retrieveRoleData(
      { page: 1 },
      {
        ...values,
        time__startswith:
          values?.time__startswith &&
          values?.time__startswith.format("YYYY-MM-DD"),
      }
    );
    setIsUserLogsFilterModalOpen(false);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isUserLogsFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        // setFilterValues({});
        // form.resetFields();
        setIsUserLogsFilterModalOpen(false);
        // retrieveRoleData({ page: 1 }, {}, true);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            // setFilterValues({});
            // form.resetFields();
            setIsUserLogsFilterModalOpen(false);
            // retrieveRoleData({ page: 1 }, {}, true);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            setFilterValues({});
            form.resetFields();
            setIsUserLogsFilterModalOpen(false);
            retrieveRoleData({ page: 1 }, {}, true);
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
              name="perfrom_user__username__icontains"
              label="Perform User"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Perform User",
                },
              ]}
            >
              <Input placeholder="Enter Perform User" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="target_user__user__username__icontains"
              label="Target User"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Target User",
                },
              ]}
            >
              <Input placeholder="Enter Target User" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="time__startswith"
              label="Time"
              rules={[
                {
                  required: false,
                  message: "Please enter time",
                },
              ]}
            >
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="logs_id"
              label="Event Type"
              className="category-select"
              rules={[
                {
                  required: false,
                  message: "Please select event",
                },
              ]}
            >
              <Select placeholder="Select Event" options={eventTypeOptions} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserLogsFilter;
