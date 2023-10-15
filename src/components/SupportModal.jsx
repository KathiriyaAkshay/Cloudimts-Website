import { Col, Form, Input, Modal, Row, Spin, Tabs } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import {
  addSupport,
  fetchParticularSupport,
  updateParticularSupport,
} from "../apis/studiesApi";
import NotificationMessage from "./NotificationMessage";

const SupportModal = ({ retrieveSupportData, setSupportId, supportId }) => {
  const { isSupportModalOpen, setIsSupportModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();
  const [currentTab, setCurrentTab] = useState("1");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (supportId) {
      retrieveParticularSupportData();
    }
  }, [supportId]);

  const retrieveParticularSupportData = async () => {
    setIsLoading(true);
    await fetchParticularSupport({ id: supportId })
      .then((res) => {
        setCurrentTab(String(res?.data?.data[0]?.option));
        form.setFieldsValue({
          option_value: res?.data?.data[0]?.option_value,
          option_description: res?.data?.data[0]?.option_description,
        });
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = async (values) => {
    if (supportId) {
      await updateParticularSupport({
        ...values,
        option: currentTab,
        id: supportId,
      })
        .then((res) => {
          setIsSupportModalOpen(false);
          form.resetFields();
          NotificationMessage("success", "Support Updated Successfully");
          retrieveSupportData();
          setSupportId(null);
          setCurrentTab("1");
        })
        .catch((err) =>
          NotificationMessage("warning", err.response.data.message)
        );
    } else {
      await addSupport({ ...values, option: currentTab })
        .then((res) => {
          setIsSupportModalOpen(false);
          form.resetFields();
          NotificationMessage("success", "New Support Added Successfully");
          retrieveSupportData();
          setSupportId(null);
          setCurrentTab("1");
        })
        .catch((err) =>
          NotificationMessage("warning", err.response.data.message)
        );
    }
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
        setSupportId(null);
        setCurrentTab("1");
      }}
    >
      <Spin spinning={isLoading}>
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
          <Tabs
            onChange={(e) => setCurrentTab(e)}
            defaultActiveKey={`${currentTab}`}
          >
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
      </Spin>
    </Modal>
  );
};

export default SupportModal;
