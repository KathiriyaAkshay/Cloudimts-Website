import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";
import { getModalityList, getRadiologistList } from "../apis/studiesApi";
import API from "../apis/getApi";
import { set } from "lodash";

const AdvancedSearchModal = ({
  name,
  setStudyData,
  retrieveStudyData,
  advanceSearchFilterData,
}) => {
  const { isAdvancedSearchModalOpen, setIsAdvancedSearchModalOpen } =
    useContext(filterDataContext);
  const [form] = Form.useForm();

  const { setIsFilterSelected, setIsAdvanceSearchSelected } = useContext(
    FilterSelectedContext
  );
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [radiologistOptions, setRadiologistOptions] = useState([]);
  const [modalityOptions, setModalityOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([
    {
      label: "Unassigned",
      value: "Unassigned",
    },
    {
      label: "New",
      value: "New",
    },
    {
      label: "Viewed",
      value: "Viewed",
    },
    {
      label: "Assigned",
      value: "Assigned",
    },
    {
      label: "In Reporting",
      value: "In Reporting",
    },
    {
      label: "Draft",
      value: "Draft",
    },
    {
      label: "Reported",
      value: "Reported",
    },
  ]);

  useEffect(() => {
    setIsFilterSelected(false);
    setIsAdvanceSearchSelected(false);
    retrieveInstitutionData();
    retrieveModalityData();
    retrieveRadiologistData();
  }, []);

  const handleSubmit = (values) => {
    const modifiedValues = {
      ...values,
      institution_name: values?.institution_name
        ? values?.institution_name
        : [],
      assigned_user: values?.assigned_user ? values?.assigned_user : [],
      modality: values?.modality ? values?.modality : [],
      study_status: values?.study_status ? values?.study_status : [],
      patient_name: values?.patient_name ? values?.patient_name : "",
      patient_id: values?.patient_id ? values?.patient_id : "",
      accession_number: values?.accession_number
        ? values?.accession_number
        : "",
      from_date: values?.from_date
        ? values?.from_date.format("YYYY-MM-DD")
        : "",
      to_date: values?.to_date ? values?.to_date.format("YYYY-MM-DD") : "",
    };
    advanceSearchFilterData({ page: 1 }, modifiedValues);
    setIsAdvancedSearchModalOpen(false);
    setIsFilterSelected(false);
    setIsAdvanceSearchSelected(true);
  };

  const retrieveInstitutionData = async () => {
    const token = localStorage.getItem("token");
    await API.get("/user/v1/fetch-institution-list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const resData = res.data.data.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        setInstitutionOptions(resData);
      })
      .catch((err) => console.log(err));
  };

  const retrieveRadiologistData = () => {
    getRadiologistList({ role_id: localStorage.getItem("role_id") })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setRadiologistOptions(resData);
      })
      .catch((err) => console.log(err));
  };

  const retrieveModalityData = () => {
    getModalityList()
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          label: data.name,
          value: data.name,
        }));
        setModalityOptions(resData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isAdvancedSearchModalOpen}
      onOk={() => form.submit()}
      onCancel={() => {
        // form.resetFields();
        setIsAdvancedSearchModalOpen(false);
        // retrieveStudyData();
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            // form.resetFields();
            setIsAdvancedSearchModalOpen(false);
            // retrieveStudyData();
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.resetFields();
            setIsAdvancedSearchModalOpen(false);
            retrieveStudyData();
            setIsFilterSelected(false);
            setIsAdvanceSearchSelected(false);
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
              name="patient_name"
              label="Patient Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Patient Name",
                },
              ]}
            >
              <Input placeholder="Enter Patient Name" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="patient_id"
              label="Patient Id"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Patient Id",
                },
              ]}
            >
              <Input placeholder="Enter Patient Id" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="institution_name"
              label="Institution Name"
              rules={[
                {
                  required: false,
                  message: "Please enter Institution Name",
                },
              ]}
            >
              <Select
                placeholder="Select Institution"
                options={institutionOptions}
                mode="multiple"
                // onChange={appliedOnChangeHandler}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="assigned_user"
              label="Assigned User"
              rules={[
                {
                  required: false,
                  message: "Please enter Assigned User",
                },
              ]}
            >
              <Select
                placeholder="Select Assigned User"
                options={radiologistOptions}
                mode="multiple"
                // onChange={appliedOnChangeHandler}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="modality"
              label="Modality"
              rules={[
                {
                  required: false,
                  message: "Please enter Modality",
                },
              ]}
            >
              <Select
                placeholder="Select Modality"
                options={modalityOptions}
                mode="multiple"
                // onChange={appliedOnChangeHandler}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="study_status"
              label="Status"
              rules={[
                {
                  required: false,
                  message: "Please enter Status",
                },
              ]}
            >
              <Select
                placeholder="Select Status"
                options={statusOptions}
                mode="multiple"
                // onChange={appliedOnChangeHandler}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="from_date"
              label="From Date"
              rules={[
                {
                  required: false,
                  message: "Please enter date",
                },
              ]}
            >
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="to_date"
              label="To Date"
              rules={[
                {
                  required: false,
                  message: "Please enter date",
                },
              ]}
            >
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="accession_number"
              label="Accession Number"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Accession Number",
                },
              ]}
            >
              <Input placeholder="Enter Accession Number" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AdvancedSearchModal;
