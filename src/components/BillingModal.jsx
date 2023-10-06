import { Col, DatePicker, Form, Modal, Row, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  getBillingData,
  getInstitutionList,
  getRadiologistList,
} from "../apis/studiesApi";
import { filterDataContext } from "../hooks/filterDataContext";
import { BillingDataContext } from "../hooks/billingDataContext";

const BillingModal = ({ setBillingData, setIsLoading, setCharges }) => {
  const { isBillingFilterModalOpen, setIsBillingFilterModalOpen } =
    useContext(filterDataContext);
  const { billingFilterData, setBillingFilterData } =
    useContext(BillingDataContext);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [radiologistOptions, setRadiologistOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([
    {
      label: "All",
      value: "all",
    },
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
    retrieveInstitutionData();
    retrieveRadiologistData();
  }, []);

  const retrieveInstitutionData = () => {
    getInstitutionList()
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          value: data.id,
          label: data.name,
        }));
        setInstitutionOptions([{ value: "all", label: "All" }, ...resData]);
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
        setRadiologistOptions([{ value: "all", label: "All" }, ...resData]);
      })
      .catch((err) => console.log(err));
  };

  const handleInstitutionSelectChange = (value) => {
    if (value.includes("all")) {
      form.setFieldsValue({ institution_list: ["all"] });
    } else {
      form.setFieldsValue({
        institution_list: value.filter((val) => val !== "all"),
      });
    }
  };

  const handleUserSelectChange = (value) => {
    if (value.includes("all")) {
      form.setFieldsValue({ user: ["all"] });
    } else {
      form.setFieldsValue({ user: value.filter((val) => val !== "all") });
    }
  };

  // const handleStatusSelectChange = (value) => {
  //   if (value.includes("all")) {
  //     form.setFieldsValue({ study_status: ["all"] });
  //   } else {
  //     form.setFieldsValue({
  //       study_status: value.filter((val) => val !== "all"),
  //     });
  //   }
  // };

  const [form] = Form.useForm();

  const submitHandler = (values) => {
    setIsLoading(true);
    const modifiedObj = {
      ...values,
      from_date: values?.from_date?.format("YYYY-MM-DD"),
      to_date: values?.to_date?.format("YYYY-MM-DD"),
      institution_list: values?.institution_list?.includes("all")
        ? []
        : values?.institution_list,
      institution_all_option: values?.institution_list?.includes("all")
        ? true
        : false,
      user: values?.user?.includes("all") ? [] : values?.user,
      user_all_option: values?.user?.includes("all") ? true : false,
      page_number: 1,
      page_size: 10,
      study_status: values?.study_status?.includes("all")
        ? "all"
        : values?.study_status,
      study_status_all_option: values?.study_status?.includes("all")
        ? true
        : false,
    };
    
    getBillingData(modifiedObj)
      .then((res) => {
        setBillingData(res.data.data);
        setBillingFilterData(res.data.data);
        setCharges({
          total_reporting_charge: res.data.total_reporting_charge,
          total_communication_charge: res.data.total_communication_charge,
          total_midnight_charge: res.data.total_midnight_charge,
        });
        setIsBillingFilterModalOpen(false);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  return (
    <div>
      <Modal
        title="Search Billing"
        width={"50%"}
        centered
        open={isBillingFilterModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsBillingFilterModalOpen(false)}
      >
        <Form
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
          onFinish={submitHandler}
          autoComplete={"off"}
        >
          <Row gutter={15}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="institution_list"
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
                  onChange={handleInstitutionSelectChange}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  showSearch
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="user"
                label="User"
                rules={[
                  {
                    required: false,
                    message: "Please enter Assigned User",
                  },
                ]}
              >
                <Select
                  placeholder="Select Radiologist"
                  options={radiologistOptions}
                  showSearch
                  onChange={handleUserSelectChange}
                  mode="multiple"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
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
                    message: "Please enter From Date",
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
                    message: "Please enter to date",
                  },
                ]}
              >
                <DatePicker format={"YYYY-MM-DD"} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="study_status"
                label="Study Status"
                className="category-select"
                rules={[
                  {
                    required: false,
                    message: "Please enter Study Status",
                  },
                ]}
              >
                <Select
                  placeholder="Select Status"
                  options={statusOptions}
                  showSearch
                  // onChange={handleStatusSelectChange}
                  // mode="multiple"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default BillingModal;
