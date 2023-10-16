import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";

const roleOptions = [
  {
    label: "Create role",
    value: "Create role",
  },
  {
    label: "Fetch role premission",
    value: "Fetch role premission",
  },
  {
    label: "Update role premission",
    value: "Update role premission",
  },
  {
    label: "Update role name",
    value: "Update role name",
  },
];

const RoleLogsFilter = ({
  name,
  setInstitutionData,
  retrieveRoleData,
  setFilterValues,
}) => {
  const { isRoleLogsFilterModalOpen, setIsRoleLogsFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const { setIsFilterSelected } = useContext(FilterSelectedContext);

  useEffect(() => {
    setIsFilterSelected(false);
  }, []);

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
    setIsRoleLogsFilterModalOpen(false);
    setIsFilterSelected(true);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isRoleLogsFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        // setFilterValues({});
        // form.resetFields();
        setIsRoleLogsFilterModalOpen(false);
        // retrieveRoleData({ page: 1 }, {}, true);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            // setFilterValues({});
            // form.resetFields();
            setIsRoleLogsFilterModalOpen(false);
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
            setIsRoleLogsFilterModalOpen(false);
            retrieveRoleData({ page: 1 }, {}, true);
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
              name="event"
              label="Event Name"
              className="category-select"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter event name",
                },
              ]}
            >
              <Select
                placeholder="Select Event"
                options={roleOptions}
                // onChange={appliedOnChangeHandler}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="prefrom_user__username__icontains"
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
              name="role__role_name"
              label="Role Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter role",
                },
              ]}
            >
              <Input placeholder="Enter role" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RoleLogsFilter;
