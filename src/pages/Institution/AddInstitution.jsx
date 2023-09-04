import React, { useEffect, useState } from "react";
import {
  Steps,
  Button,
  message,
  Form,
  Input,
  Card,
  Row,
  Col,
  DatePicker,
  Switch,
  Select,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import TableWithFilter from "../../components/TableWithFilter";
import API from "../../apis/getApi";
import NotificationMessage from "../../components/NotificationMessage";
import dayjs from "dayjs";
import {
  getRadiologistList,
  updateBlockUsers,
  updateInHouseUser,
} from "../../apis/studiesApi";

const { Step } = Steps;

const AddInstitution = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { changeBreadcrumbs } = useBreadcrumbs();
  const token = localStorage.getItem("token");
  const [payload, setPayload] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [radiologistOptions, setRadiologistOptions] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const crumbs = [{ name: "Institution", to: "/institutions" }];
    crumbs.push({
      name: "Add",
    });
    changeBreadcrumbs(crumbs);
    if (id) {
      retrieveInstitutionData();
      retrieveModalityData();
      retrieveRadiologistData();
    } else {
      retrieveModalityData();
      retrieveRadiologistData();
    }
  }, []);

  const convertToInitialObject = (data) => {
    console.log(data);
    let initialObject = {};
    for (let i = 1; i <= 47; i++) {
      initialObject[`${i}_reporting_charge`] = data[i].reporting_charge;
      initialObject[`${i}_communication_charge`] = data[i].communication_charge;
    }
    return initialObject;
  };

  const retrieveInstitutionData = async () => {
    setIsLoading(true);
    await API.post(
      "/institute/v1/institute-particular-details-fetch",
      { id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        const modalityData = convertToInitialObject(res.data.data.modality);
        const formData = {
          ...res.data.data,
          ...modalityData,
          contract_valid_date: dayjs(res.data.data.contract_valid_date),
          radiologist: res.data?.blocked_user?.map((data) => data.id),
          house_radiologist: res.data.data?.house_radiologist?.data,
        };
        form.setFieldsValue(formData);
      })
      .catch((err) => navigate("/not-found"));
    setIsLoading(false);
  };

  const retrieveModalityData = async () => {
    const auth = "Bearer " + `${token}`;
    await API.get("/institute/v1/institute-modality", {
      headers: { Authorization: auth },
    }).then((res) => {
      const resData = res.data.data.map((item) => ({
        ...item,
        reporting_charge: 0,
        communication_charge: 0,
      }));
      setTableData(resData);
    });
  };

  const retrieveRadiologistData = () => {
    getRadiologistList({ role_id: 2 }).then((res) => {
      const resData = res.data.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setRadiologistOptions(resData);
    });
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const convertToObject = (data) => {
    let modifiedObject = { modality: {} };
    for (let i = 1; i <= tableData.length; i++) {
      modifiedObject.modality[i] = {
        reporting_charge: data[`${i}_reporting_charge`],
        communication_charge: data[`${i}_communication_charge`],
      };
    }
    return modifiedObject;
  };

  const handleSubmit = async (values) => {
    if (currentStep === 0) {
      const resData = {
        ...values,
        contract_valid_date: values.contract_valid_date.format("YYYY-MM-DD"),
        active_status: values.active_status ? values.active_status : false,
        active_whatsapp: values.active_whatsapp
          ? values.active_whatsapp
          : false,
        allow_offline_download: values.allow_offline_download
          ? values.allow_offline_download
          : false,
      };
      setPayload(resData);
      if (id) {
        setIsLoading(true);
        await API.post(
          "/institute/v1/institute-details-update",
          { ...resData, id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        setIsLoading(false);
      }
      handleNextStep();
    } else if (currentStep === 1) {
      setPayload((prev) => ({ ...prev, ...convertToObject(values) }));
      if (id) {
        setIsLoading(true);
        await API.post(
          "/institute/v1/institute-modality-update",
          {
            id: id,
            modality_details: { ...convertToObject(values).modality },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        setIsLoading(false);
      }
      handleNextStep();
    } else if (currentStep === 2) {
      console.log(values);
      setPayload((prev) => ({
        ...prev,
        blocked_user: { data: values.radiologist },
      }));
      if (id) {
        updateBlockUsers({
          id: id,
          blocked_user: {
            data: values.radiologist,
          },
        })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
      handleNextStep();
    } else if (currentStep === 3) {
      setPayload((prev) => ({
        ...prev,
        house_radiologist: { data: values.house_radiologist },
      }));
      if (id) {
        updateInHouseUser({
          id: id,
          in_house_radiologist: {
            data: values.house_radiologist,
          },
        })
          .then((res) => {
            NotificationMessage("success", "Institute Updated Successfully");
            navigate("/institutions");
          })
          .catch((err) => console.log(err));
      } else {
        setIsLoading(true);
        await API.post(
          "/institute/v1/institute-create",
          { ...payload, house_radiologist: { data: values.house_radiologist } },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
          .then((res) => {
            NotificationMessage("success", "Institution Created Successfully");
            form.resetFields();
            navigate("/institutions");
          })
          .catch((err) =>
            NotificationMessage("warning", err.response.data.message)
          );
        setIsLoading(false);
      }
    }
  };

  const columns = [
    {
      title: "Modality",
      dataIndex: "name",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Reporting Charge",
      dataIndex: "reporting_charge",
      // sorter: (a, b) => {},
      // editable: true,
      render: (text, record) => (
        <Form.Item name={`${record.id}_reporting_charge`} initialValue={text}>
          <Input />
        </Form.Item>
      ),
    },
    {
      title: "Communication Charge",
      dataIndex: "communication_charge",
      // sorter: (a, b) => {},
      // editable: true,
      render: (text, record) => (
        <Form.Item
          name={`${record.id}_communication_charge`}
          initialValue={text}
        >
          <Input />
        </Form.Item>
      ),
    },
  ];

  const reportColumns = [
    {
      title: "Report Options",
      dataIndex: "report_option",
    },
    {
      title: "Value for institution",
      dataIndex: "report_option_value",
      render: (text, record) => {
        if (record.value_field === "switch") {
          return {
            children: (
              <Form.Item name={record.record_option}>
                {" "}
                <Switch />
              </Form.Item>
            ),
          };
        } else if (record.value_field === "select") {
          return {
            children: (
              <Form.Item
                name={record.record_option}
                className="category-select"
              >
                <Select placeholder="Select Value" />
              </Form.Item>
            ),
          };
        } else {
          return {
            children: (
              <Form.Item name={record.record_option}>
                {" "}
                <Input />
              </Form.Item>
            ),
          };
        }
      },
    },
  ];

  const reportTableData = [
    {
      report_option: "Attach institution info to report header",
      report_option_value: false,
      value_field: "switch",
    },
    {
      report_option: "Attach QR Code to report",
      report_option_value: false,
      value_field: "switch",
    },
    {
      report_option: "Show patient info as",
      report_option_value: "",
      value_field: "select",
    },
    {
      report_option: "dataSet",
      report_option_value: "",
      value_field: "input",
    },
  ];

  return (
    <div>
      <Card>
        <Spin spinning={isLoading}>
          <Steps current={currentStep} className="mb">
            <Step title="Basic Info" />
            <Step title="Modality Charges" />
            {/* <Steps title="Set Password" /> */}
            <Steps title="Blocked Users" />
            <Steps title="In house Radiologist" />
            {/* <Steps title="Report Settings" /> */}
          </Steps>
          {currentStep === 0 && (
            <Form
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              form={form}
              onFinish={handleSubmit}
              className="mt"
            >
              <Row gutter={15}>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="name"
                    label="Institution"
                    rules={[
                      {
                        whitespace: true,
                        required: true,
                        message: "Please enter institution name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Institution name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      {
                        type: "email",
                        required: true,
                        message: "Please enter valid email",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="contact"
                    label="Contact Number"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter contact number",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Contact Number" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="contract_valid_date"
                    label="Contract Valid Till"
                    rules={[
                      {
                        required: true,
                        message: "Please enter valid date",
                      },
                    ]}
                  >
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter city",
                      },
                    ]}
                  >
                    <Input placeholder="Enter City" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter state",
                      },
                    ]}
                  >
                    <Input placeholder="Enter State" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter country",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Country" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Form.Item
                    name="website"
                    label="Website"
                    rules={[
                      {
                        required: false,
                        message: "Please enter website name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Website" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter address",
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="Enter Address" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                  <Form.Item
                    name="allocated_storage"
                    label="Storage Allocated"
                    rules={[
                      {
                        required: true,
                        // type: "number",
                        message: "Enter storage allocated Limit",
                      },
                    ]}
                  >
                    <Input placeholder="Enter storage allocated Limit" />
                  </Form.Item>
                </Col>
                <Col xs={4} sm={4} md={4} lg={2}>
                  <Form.Item
                    name="active_status"
                    label="Active"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={4} sm={4} md={4} lg={3}>
                  <Form.Item
                    name="active_whatsapp"
                    label="Active Whatsapp"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={4} sm={4} md={4} lg={4}>
                  <Form.Item
                    name="allow_offline_download"
                    label="Allow Offline Download"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} className="justify-end">
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {currentStep === 1 && (
            <Form
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row>
                <Col xs={0} sm={0} md={4} lg={5}></Col>
                <Col xs={24} sm={24} md={15} lg={15}>
                  <TableWithFilter
                    tableColumns={columns}
                    tableData={tableData}
                    pagination
                  />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} className="justify-end">
                  <Button type="primary" onClick={handlePrevStep}>
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginLeft: "10px" }}
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {/* {currentStep === 2 && (
          <Form
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            form={form}
            onFinish={handleSubmit}
          >
            <Row gutter={30}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      whitespace: true,
                      required: true,
                      message: "Please enter password",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    autoComplete="off"
                    name="password"
                    style={{ marginBottom: "0.5rem" }}
                    placeholder="Enter Password"
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                  dependencies={["password"]}
                  hasFeedback
                >
                  <Input.Password
                    autoComplete="off"
                    name="confirmPassword"
                    style={{ marginBottom: "0.5rem" }}
                    placeholder="Enter Confirm Password"
                  />
                </Form.Item>
              </Col>
              <Col lg={24} md={24} sm={24} className="justify-end">
                <Button type="primary" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: "10px" }}
                >
                  Next
                </Button>
              </Col>
            </Row>
          </Form>
        )} */}
          {currentStep === 2 && (
            <Form
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={30}>
                <Col lg={12} md={12} sm={12}>
                  <Form.Item
                    label="Choose Radiologist"
                    name="radiologist"
                    // className="category-select"
                    rules={[
                      {
                        required: false,
                        message: "Please select radiologist",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Radiologist"
                      options={radiologistOptions}
                      showSearch
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
                <Col lg={24} md={24} sm={24} className="justify-end">
                  <Button type="primary" onClick={handlePrevStep}>
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginLeft: "10px" }}
                  >
                    Next
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {currentStep === 3 && (
            <Form
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              form={form}
              onFinish={handleSubmit}
            >
              <Row gutter={30}>
                <Col lg={12} md={12} sm={12}>
                  <Form.Item
                    label="Choose Radiologist"
                    name="house_radiologist"
                    className="category-select"
                    rules={[
                      {
                        required: false,
                        message: "Please select radiologist",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Radiologist"
                      options={radiologistOptions}
                      showSearch
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      // onChange={appliedOnChangeHandler}
                    />
                  </Form.Item>
                </Col>
                <Col
                  lg={24}
                  md={24}
                  sm={24}
                  className="justify-end display-flex"
                >
                  <Button type="primary" onClick={handlePrevStep}>
                    Previous
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {/* {currentStep === 5 && (
          <Form
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            form={form}
            onFinish={handleSubmit}
          >
            <Row gutter={30}>
              <Col lg={12} md={12} sm={24}>
                <TableWithFilter
                  tableColumns={reportColumns}
                  tableData={reportTableData}
                  pagination
                />
              </Col>
              <Col
                lg={24}
                md={24}
                sm={24}
                className="justify-end display-flex"
                style={{ marginTop: "10px" }}
              >
                <Button type="primary" onClick={handlePrevStep}>
                  Previous
                </Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        )} */}
        </Spin>
      </Card>
    </div>
  );
};

export default AddInstitution;
