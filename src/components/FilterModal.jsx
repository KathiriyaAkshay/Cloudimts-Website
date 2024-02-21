import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { UserPermissionContext } from "../hooks/userPermissionContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";
import NotificationMessage from "./NotificationMessage";
import API from "../apis/getApi";

const FilterModal = ({ name, setInstitutionData, retrieveInstitutionData }) => {
  const { isFilterModalOpen, setIsFilterModalOpen } =
    useContext(filterDataContext);
  const { permissionData } = useContext(UserPermissionContext);

  const [form] = Form.useForm();

  const { setIsFilterSelected } = useContext(FilterSelectedContext);
  const [institutionOptions, setInstitutionOptions] = useState([]) ; 

  // **** Reterive instittuion data **** // 
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
    setIsFilterSelected(false);
  }, []);

  useEffect(() => {
    if (isFilterModalOpen === true) {retrieveInstitutionDataFunction() ; form.resetFields(); }
  }, [isFilterModalOpen])
  

  const handleSubmit = (values) => {
    const modifiedValues = {
      ...values,
      created_at__startswith:
        values?.created_at__startswith &&
        values?.created_at__startswith?.format("YYYY-MM-DD"),
    };
    retrieveInstitutionData({ page: 1 }, modifiedValues);
    setIsFilterModalOpen(false);
    setIsFilterSelected(true);
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
        setIsFilterModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setIsFilterModalOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.resetFields();
            retrieveInstitutionData();
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
                <Select
                  placeholder = "Select Institution"
                  options = {institutionOptions}
                />
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
          {checkPermissionStatus("View Institution created at") && (
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
          )}
          {checkPermissionStatus("View Disable/Enable Institution option") && (
            <Col xs={24} lg={12}>
              <Form.Item
                name="disable"
                label="Institution Status"
                className="category-select"
                rules={[
                  {
                    required: false,
                    message: "Please enter Institution Status",
                  },
                ]}
              >
                <Select
                  placeholder="Select Status"
                  options={[
                    { label: "Disabled", value: true },
                    { label: "Enabled", value: false },
                  ]}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default FilterModal;
