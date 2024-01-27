import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";

const eventTypeOptions = [
  {
    label: "Institution create",
    value: 1,
  },
  {
    label: "Institution basic details update",
    value: 2,
  },
  {
    label: "Institution modality charge update",
    value: 3,
  },
  {
    label: "Default modality details update",
    value: 4,
  },
  {
    label: "Institution report settings update",
    value: 5,
  },
  {
    label: "Insitution blocked user details update",
    value: 6,
  },
  {
    label: "Institution in house radiologist update",
    value: 7,
  },
  {
    label: "Institution studyID setting update",
    value: 8,
  },
  {
    label: "Institution Disable",
    value: 9,
  },
  {
    label: "Institution Enable",
    value: 10,
  },
];

const InstitutionLogsFilter = ({ name, retrieveRoleData, setFilterValues }) => {
  const {
    isInstitutionLogsFilterModalOpen,
    setIsInstitutionLogsFilterModalOpen,
  } = useContext(filterDataContext);
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
    setIsInstitutionLogsFilterModalOpen(false);
    setIsFilterSelected(true);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isInstitutionLogsFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setIsInstitutionLogsFilterModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setIsInstitutionLogsFilterModalOpen(false);
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
            // setIsInstitutionLogsFilterModalOpen(false);
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
        className="pt-1"  
      >
        <Row gutter={15}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="institution__name__icontains"
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
              name="user__username__icontains"
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
              <DatePicker format={"DD-MM-YYYY"} />
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

export default InstitutionLogsFilter;
