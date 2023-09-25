import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import React, { useContext } from "react";
import { filterDataContext } from "../hooks/filterDataContext";

const InstitutionLogsFilter = ({
  name,
  retrieveRoleData,
  setFilterValues,
}) => {
  const {
    isInstitutionLogsFilterModalOpen,
    setIsInstitutionLogsFilterModalOpen,
  } = useContext(filterDataContext);
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
    setIsInstitutionLogsFilterModalOpen(false);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isInstitutionLogsFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setFilterValues({});
        form.resetFields();
        setIsInstitutionLogsFilterModalOpen(false);
        retrieveRoleData({ page: 1 }, {}, true);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setFilterValues({});
            form.resetFields();
            setIsInstitutionLogsFilterModalOpen(false);
            retrieveRoleData({ page: 1 }, {}, true);
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
              name="institution__name__contains"
              label="Institution Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Institution name",
                },
              ]}
            >
              <Input placeholder="Enter Institution Name" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="user__username__contains"
              label="Username"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter username",
                },
              ]}
            >
              <Input placeholder="Enter username" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="time__startswith"
              label="time"
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
          {/* <Col xs={24} lg={12}>
            <Form.Item
              name="event_info__contains"
              label="Event Type"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter event",
                },
              ]}
            >
              <Input placeholder="Enter Event" />
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    </Modal>
  );
};

export default InstitutionLogsFilter;
