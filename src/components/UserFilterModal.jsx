import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";
import NotificationMessage from "./NotificationMessage";
import API from "../apis/getApi";

const UserFilterModal = ({ name, setInstitutionData, retrieveUsersData }) => {
  const { isUserFilterModalOpen, setIsUserFilterModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const { setIsFilterSelected } = useContext(FilterSelectedContext);

  useEffect(() => {
    setIsFilterSelected(false);
  }, []);

  const [institutionOptions, setInstitutionOptions] = useState([]) ; 

  const retrieveInstitutionDataFunction = async () => {
    const token = localStorage.getItem('token');
    await API.get('/user/v1/fetch-institution-list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            // ...item,
            label: item.name,
            value: item.name
          }))
          setInstitutionOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Quick Filter',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Quick Filter',
          err.response.data.message
        )
      )
  }

  useEffect(() => {
    retrieveInstitutionDataFunction() ; 
  }, [isUserFilterModalOpen])

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
      width={"70%"}
      title={name}
      open={isUserFilterModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        setIsUserFilterModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setIsUserFilterModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.resetFields();
            // setIsUserFilterModalOpen(false);
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
        style={{marginTop: "12px"}}
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
              name="user__email__icontains"
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
              name="institute__name"
              label="Institute Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Institute Name",
                },
              ]}
            >
              <Select
                placeholder = "Select institution"
                options = {institutionOptions}
              />
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
              <DatePicker format={"DD-MM-YYYY"} />
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
