import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useContext } from "react";
import { filterDataContext } from "../hooks/filterDataContext";

const FilterModal = ({ name, setInstitutionData, retrieveInstitutionData }) => {
  const { isFilterModalOpen, setIsFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    retrieveInstitutionData({ page: 1 }, values);
    setIsFilterModalOpen(false);
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
      open={isFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setIsFilterModalOpen(false);
        retrieveInstitutionData();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setIsFilterModalOpen(false);
            retrieveInstitutionData();
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
              name="name"
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
              name="city"
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
          <Col xs={24} lg={12}>
            <Form.Item
              name="state"
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
          <Col xs={24} lg={12}>
            <Form.Item
              name="country"
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
