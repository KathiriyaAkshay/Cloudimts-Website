import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Modal, Select, Space, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import API from "../../apis/getApi";
import NotificationMessage from "../../components/NotificationMessage";
import { UserEmailContext } from "../../hooks/userEmailContext";

const Email = () => {
  const [emailData, setEmailData] = useState([]);
  const {isEmailModalOpen, setIsEmailModalOpen} = useContext(UserEmailContext);
  const [form] = Form.useForm();
  const [roleOptions, setRoleOptions] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [pagi, setPagi] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [emailID, setEmailID] = useState(null);

  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Email" }]);
    retrieveRoleOptions();
    // setRole(localStorage.getItem("role"))
  }, []);

  const editActionHandler = async (id) => {
    setEmailID(id);
    await API.post(
      "/email/v1/fetch-particular-email",
      { id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
      form.setFieldsValue(res.data.datat);
      setIsEmailModalOpen(true);
    }).catch(err => console.log(err));
  };

  const deleteActionHandler = () => {};

  const retrieveEmailData = async (pagination) => {
    const currentPagination = pagination || pagi;
    setIsLoading(true);
    await API.post(
      "/email/v1/fetch-email-list",
      {
        page_limit: 10,
        page_number: currentPagination.page,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        setEmailData(res.data.data);
        setTotalPages(res.data.totat_object);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const retrieveRoleOptions = async () => {
    setIsLoading(true);
    await API.get("/email/v1/role-fetch", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const resData = res.data.data.map((role) => ({
          label: role.role_name,
          value: role.id,
        }));
        setRoleOptions(resData);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: window.innerWidth < 650 ? "1%" : "10%",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <EditActionIcon
            editActionHandler={() => editActionHandler(record.id)}
          />
          <DeleteActionIcon
            deleteActionHandler={() => deleteActionHandler(record)}
          />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.email,
    }),
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    await API.post("/email/v1/insert-email", values, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        NotificationMessage("success", "Email Added Successfully");
        form.resetFields();
        setIsEmailModalOpen(false);
        retrieveEmailData();
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
    setIsLoading(false);
  };

  return (
    <>
      <TableWithFilter
        tableData={emailData}
        tableColumns={columns}
        // onAddClick={() => setIsModalOpen(true)}
        // addButtonTitle="Add Email"
        // addButtonIcon={<PlusOutlined />}
        rowSelection={rowSelection}
        loadingTableData={isLoading}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveEmailData}
      />
      <Modal
        title="Add New Email"
        open={isEmailModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields();
          setIsEmailModalOpen(false);
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
        >
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter full name",
              },
            ]}
          >
            <Input placeholder="Enter Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please enter email",
              },
            ]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact"
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
          <Form.Item
            label="Role"
            name="role_id"
            className="category-select"
            rules={[
              {
                required: false,
                message: "Please select radiologist",
              },
            ]}
          >
            <Select
              placeholder="Select Role"
              options={roleOptions}
              showSearch
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              // onChange={appliedOnChangeHandler}
            />
          </Form.Item>
          <Form.Item
            name="active_status"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Email;
