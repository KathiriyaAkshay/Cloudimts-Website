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
  TimePicker,
  Checkbox,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import TableWithFilter from "../../components/TableWithFilter";
import API from "../../apis/getApi";
import NotificationMessage from "../../components/NotificationMessage";
import dayjs from "dayjs";
import UploadImage from "../../components/UploadImage";
// import AWS from "aws-sdk";
const S3_BUCKET = import.meta.env.VITE_APP_AMAZON_S3_BUCKET_NAME;
const accessKeyId = import.meta.env.VITE_APP_AMAZON_ACCESS_KEY;
const secretAccessKey = import.meta.env.VITE_APP_AMAZON_SECRET_KEY;

const { Step } = Steps;

const AddUsers = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { changeBreadcrumbs } = useBreadcrumbs();
  const token = localStorage.getItem("token");
  const [payload, setPayload] = useState({});
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [value, setValues] = useState({
    url: undefined,
  });

  useEffect(() => {
    const crumbs = [{ name: "Users", to: "/users" }];
    crumbs.push({
      name: "Add",
    });
    changeBreadcrumbs(crumbs);
    retrieveInstitutionData();
    retrieveRolesData();
    retrieveModalityList();
    if (id) {
      retrieveUserData();
    }
  }, []);

  const retrieveUserData = async () => {
    await API.post(
      "/user/v1/particular-user-fetch",
      { user_id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        const instituteData = convertToInitialObject(
          res.data.data.institution_details
        );
        const modalityData = convertToInitialModalityObject(
          res.data.data.modality_details
        );
        const resData = {
          ...res.data.data,
          username: res.data.data.user.username,
          email: res.data.data.user.email,
          role_id: res.data.data.role.id,
          institute_id: res.data.data.institute.id,
          availability: [
            dayjs(res.data.data.availability_start_time, "HH:mm:ss"),
            dayjs(res.data.data.availability_end_time, "HH:mm:ss"),
          ],
          ...instituteData,
          ...modalityData,
        };
        form.setFieldsValue(resData);
      })
      .catch((err) => console.log(err));
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const convertToInitialModalityObject = (data) => {
    let initialObject = {};
    for (let i = 1; i <= Object.keys(data).length; i++) {
      initialObject[`${i}_isAllowed`] = data[i].isAllowed;
    }
    return initialObject;
  };

  const convertToInitialObject = (data) => {
    let initialObject = {};
    for (let i = 1; i <= Object.keys(data).length; i++) {
      initialObject[`${i}_viewAssign`] = data[i].viewAssign;
      initialObject[`${i}_viewAll`] = data[i].viewAll;
    }
    return initialObject;
  };

  const retrieveInstitutionData = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const retrieveRolesData = async () => {
    setIsLoading(true);
    await API.get("/user/v1/fetch-role-list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const resData = res.data.data.map((item) => ({
          label: item.role_name,
          value: item.id,
        }));
        setRoleOptions(resData);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const retrieveModalityList = async () => {
    setIsLoading(true);
    await API.get("/user/v1/fetch-modality-list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const resData = res.data.data.map((item) => ({
          ...item,
          isAllowed: false,
        }));
        setTableData(resData);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const convertToObject = (data) => {
    let modifiedObject = { institution_details: {} };
    for (let i = 1; i <= institutionOptions.length; i++) {
      modifiedObject.institution_details[i] = {
        viewAssign: data[`${i}_viewAssign`] ? data[`${i}_viewAssign`] : false,
        viewAll: data[`${i}_viewAll`] ? data[`${i}_viewAll`] : false,
      };
    }
    return modifiedObject;
  };

  const convertModalityToObject = (data) => {
    let modifiedObject = { modality_details: {} };
    for (let i = 1; i <= tableData.length; i++) {
      modifiedObject.modality_details[i] = {
        isAllowed: data[`${i}_isAllowed`] ? data[`${i}_isAllowed`] : false,
      };
    }
    return modifiedObject;
  };

  const handleSubmit = async (values) => {
    if (currentStep === 0) {
      setPayload({
        ...values,
        allow_offline_download: values.allow_offline_download
          ? values.allow_offline_download
          : false,
        allow: values.allow ? values.allow : false,
      });
      handleNextStep();
    } else if (currentStep === 1) {
      setPayload((prev) => ({
        ...prev,
        start_time: values.availability[0].format("HH:mm:ss"),
        end_time: values.availability[1].format("HH:mm:ss"),
      }));
      if (id) {
        setIsLoading(true);
        await API.post(
          "/user/v1/user-update-basic-details",
          {
            ...payload,
            start_time: values.availability[0].format("HH:mm:ss"),
            end_time: values.availability[1].format("HH:mm:ss"),
            user_id: id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        setIsLoading(false);
      }
      handleNextStep();
    } else if (currentStep === 2) {
      setPayload((prev) => ({ ...prev, ...convertToObject(values) }));
      if (id) {
        setIsLoading(true);
        await API.post(
          "/user/v1/user-update-institution-details",
          {
            user_id: id,
            institution_update: {
              ...convertToObject(values).institution_details,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        setIsLoading(false);
      }
      handleNextStep();
    } else if (currentStep === 3) {
      console.log(values);

      // S3 Credentials
      AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      });
      const s3 = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: "us-east",
      });

      // Files Parameters

      const params = {
        Bucket: S3_BUCKET,
        Key: "notfound.png",
        Body: value.url,
      };

      // Uploading file to s3

      const upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          // File uploading progress
          console.log(
            "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
          );
        })
        .promise();

      await upload.then((err, data) => {
        console.log(err);
        // Fille successfully uploaded
        // alert("File uploaded successfully.");
        console.log(data);
      });
    } else if (currentStep === 4) {
      setIsLoading(true);
      const modalityData = { ...convertModalityToObject(values) };
      setPayload((prev) => ({ ...prev, ...convertModalityToObject(values) }));
      if (id) {
        await API.post(
          "/user/v1/user-update-modality-details",
          {
            user_id: id,
            modality_update: {
              ...convertModalityToObject(values).modality_details,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => {
            NotificationMessage("success", "User Updated Successfully");
            form.resetFields();
            navigate("/users");
          })
          .catch((err) => console.log(err));
      } else {
        await API.post(
          "/user/v1/create-user",
          { ...payload, ...modalityData },
          { headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => {
            NotificationMessage("success", "User Created Successfully");
            form.resetFields();
            navigate("/users");
          })
          .catch((err) =>
            NotificationMessage("warning", err.response.data.message)
          );
      }
      setIsLoading(false);
    }
  };

  const institutionColumn = [
    {
      title: "Institution",
      dataIndex: "name",
    },
    {
      title: "View Assigned Studies",
      dataIndex: "viewAssign",
      render: (text, record) => (
        <Form.Item name={`${record.id}_viewAssign`} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      ),
    },
    {
      title: "View All Studies",
      dataIndex: "viewAll",
      render: (text, record) => (
        <Form.Item name={`${record.id}_viewAll`} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      ),
    },
  ];

  const columns = [
    {
      title: "Modality",
      dataIndex: "name",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Allowed",
      dataIndex: "isAllowed",
      // sorter: (a, b) => {},
      // editable: true,
      render: (text, record) => (
        <Form.Item name={`${record.id}_isAllowed`} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Steps current={currentStep} className="mb">
          <Step title="Basic Info" />
          <Step title="Availability" />
          <Step title="Assigned Details" />
          <Step title="Upload Signature" />
          <Step title="Modality" />
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
                  name="username"
                  label="Username"
                  rules={[
                    {
                      whitespace: true,
                      required: true,
                      message: "Please enter username",
                    },
                  ]}
                >
                  <Input placeholder="Enter Username" />
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
              <Col lg={6} md={12} sm={12}>
                <Form.Item
                  label="Institution"
                  name="institute_id"
                  className="category-select"
                  rules={[
                    {
                      required: true,
                      message: "Please select Institution",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Institution"
                    options={institutionOptions}
                    // onChange={appliedOnChangeHandler}
                  />
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={12}>
                <Form.Item
                  label="Role"
                  name="role_id"
                  className="category-select"
                  rules={[
                    {
                      required: true,
                      message: "Please select Role",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Role"
                    options={roleOptions}
                    // onChange={appliedOnChangeHandler}
                  />
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
              <Col lg={6} md={12} sm={12}>
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
              <Col lg={6} md={12} sm={12}>
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
              <Col xs={4} sm={4} md={4} lg={2}>
                <Form.Item name="allow" label="Active" valuePropName="checked">
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
            <Row>
              <Col xs={0} sm={0} md={4} lg={5}></Col>
              <Col xs={24} sm={24} md={15} lg={15}>
                <TableWithFilter
                  tableColumns={institutionColumn}
                  tableData={institutionOptions}
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
            <Row gutter={30}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item
                  label="Availability"
                  name="availability"
                  rules={[
                    {
                      required: true,
                      message: "Please enter availability",
                    },
                  ]}
                >
                  <TimePicker.RangePicker />
                </Form.Item>
              </Col>
              <Col lg={24} md={24} sm={24} className="justify-end display-flex">
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
            <Row>
              <Col lg={12} xs={24}>
                <UploadImage
                  values={value}
                  setValues={setValues}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  imageURL={imageURL}
                />
              </Col>
              <Col lg={24} md={24} sm={24} className="justify-end display-flex">
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
        {currentStep === 4 && (
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
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AddUsers;
