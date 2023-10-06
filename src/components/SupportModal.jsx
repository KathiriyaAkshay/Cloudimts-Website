import { Col, Form, Input, Modal, Row, Tabs } from "antd";
import React, { useContext, useState } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { addSupport } from "../apis/studiesApi";
import NotificationMessage from "./NotificationMessage";

const SupportModal = ({ retrieveSupportData }) => {
  const { isSupportModalOpen, setIsSupportModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();
  const [currentTab, setCurrentTab] = useState(1);

  const handleSubmit = async (values) => {
    await addSupport({ ...values, option: currentTab })
      .then((res) => {
        setIsSupportModalOpen(false);
        form.resetFields();
        NotificationMessage("success", "New Support Added Successfully");
        retrieveSupportData();
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={"Add New Support"}
      open={isSupportModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setIsSupportModalOpen(false);
      }}
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
        <Tabs onChange={(e) => setCurrentTab(e)}>
          <Tabs.TabPane key={"1"} tab="Email Support">
            <Row gutter={15}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="option_value"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      // type: "email",
                      message: "Please enter valid email",
                    },
                  ]}
                >
                  <Input placeholder="Enter Email" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="option_description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <Input placeholder="Enter Description" />
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key={"2"} tab="Phone Support">
            <Row gutter={15}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="option_value"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter valid number",
                    },
                  ]}
                >
                  <Input placeholder="Enter Phone Number" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="option_description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <Input placeholder="Enter Description" />
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default SupportModal;
