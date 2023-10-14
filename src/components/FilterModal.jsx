import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useContext } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { UserPermissionContext } from "../hooks/userPermissionContext";

const FilterModal = ({ name, setInstitutionData, retrieveInstitutionData }) => {
  const { isFilterModalOpen, setIsFilterModalOpen } =
    useContext(filterDataContext);
  const { permissionData } = useContext(UserPermissionContext);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    retrieveInstitutionData({ page: 1 }, values);
    setIsFilterModalOpen(false);
  };

  const checkPermissionStatus = (name) => {
    const permission = permissionData["InstitutionTable view"]?.find(
      (data) => data.permission === name
    )?.permission_value;
    return permission;
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        // form.resetFields();
        setIsFilterModalOpen(false);
        // retrieveInstitutionData();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            // form.resetFields();
            setIsFilterModalOpen(false);
            // retrieveInstitutionData();
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
          {checkPermissionStatus("View Institution name") && (
            <Col xs={24} lg={12}>
              <Form.Item
                name="name__icontains"
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
          )}
          {checkPermissionStatus("View Institution email") && (
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
          )}
          {checkPermissionStatus("View Institution contact number") && (
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
          )}
          {checkPermissionStatus("View Institution City") && (
            <Col xs={24} lg={12}>
              <Form.Item
                name="city__icontains"
                label="City"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter City",
                  },
                ]}
              >
                <Input placeholder="Enter City" />
              </Form.Item>
            </Col>
          )}
          {checkPermissionStatus("View Institution State") && (
            <Col xs={24} lg={12}>
              <Form.Item
                name="state__icontains"
                label="State"
                rules={[
                  {
                    required: false,
                    whitespace: true,
                    message: "Please enter State",
                  },
                ]}
              >
                <Input placeholder="Enter State" />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} lg={12}>
            <Form.Item
              name="country__icontains"
              label="Country"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Country",
                },
              ]}
            >
              <Input placeholder="Enter Country" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default FilterModal;
