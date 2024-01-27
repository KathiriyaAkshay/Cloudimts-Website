import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";

const EmailFilterModal = ({ name, setInstitutionData, retrieveEmailData }) => {
  const { isEmailFilterModalOpen, setIsEmailFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();
  const { setIsFilterSelected } = useContext(FilterSelectedContext);

  useEffect(() => {
    setIsFilterSelected(false);
  }, []);

  const handleSubmit = (values) => {

    let modifiedValues = {
      ...values,
      created_at__startswith:
        values?.created_at__startswith &&
        values?.created_at__startswith?.format("YYYY-MM-DD"),
    };

    if (values?.active_status !== undefined){
      modifiedValues['active_status'] = values?.active_status === "active"?true:false

    }

    retrieveEmailData({ page: 1 }, modifiedValues);
    setIsEmailFilterModalOpen(false);
    setIsFilterSelected(true);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isEmailFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setIsEmailFilterModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setIsEmailFilterModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            setIsEmailFilterModalOpen(false);
            retrieveEmailData();
            form.resetFields();
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
        style={{ marginTop: "12px" }}
      >
        <Row gutter={15}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="full_name__icontains"
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
              name="email"
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
              name="created_at__startswith"
              label="Date"
              rules={[
                {
                  required: false,
                  message: "Please enter date",
                },
              ]}
            >
              <DatePicker format={"DD-MM-YYYY"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="contact__icontains"
              label="Contact No."
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Contact Number",
                },
                
                {
                  validator: (rule, value) => {
                    if (!value) {
                      return Promise.resolve(); // No validation if value is not provided
                    }
            
                    // Validate Indian contact number
                    const indianPhoneNumberRegex = /^[6-9]\d{9}$/;
            
                    if (indianPhoneNumberRegex.test(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject("Invalid contact number");
                    }
                  },
                },
              ]}
            >
              <Input placeholder="Enter Contact Number" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12} className="custom-select-email">
            <Form.Item
              name="active_status"
              label="Status"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Contact Number",
                }
              ]}
            >
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Select a Value"
                // defaultValue="Select a Value"
                options={[
                  {
                    value: 'active',
                    label: 'Active',
                  },
                  {
                    value: 'inactive',
                    label: 'Inactive',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmailFilterModal;
