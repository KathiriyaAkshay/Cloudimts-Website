import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Modal, Space, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import API from "../../apis/getApi";
import NotificationMessage from "../../components/NotificationMessage";
import { TbLockAccess } from "react-icons/tb";
import { UserRoleContext } from "../../hooks/usersRolesContext";

const Roles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isRoleModalOpen, setIsRoleModalOpen } = useContext(UserRoleContext);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [roleID, setRoleID] = useState(null);
  const [form] = Form.useForm();
  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = tableData.slice(firstIndex, lastIndex);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Roles" }]);
    // setRole(localStorage.getItem("role"))
    retrieveRoleData();
  }, []);

  const editActionHandler = (record) => {
    form.setFieldsValue(record);
    setRoleID(record.id);
    setIsRoleModalOpen(true);
  };

  const deleteActionHandler = () => {};

  const retrieveRoleData = async () => {
    setIsLoading(true);
    await API.post(
      "/role/v1/fetch_role_list",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => setTableData(res.data.data))
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Last Updated",
      dataIndex: "role_updated_at",
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
          <EditActionIcon editActionHandler={() => editActionHandler(record)} />
          <Tooltip title={"Add Permissions"}>
            <TbLockAccess
              className="action-icon"
              style={{ fontSize: "24px" }}
              onClick={() => navigate(`/users/roles/${record.id}/permissions`)}
            />
          </Tooltip>
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
    if (!roleID) {
      await API.post("/role/v1/create_role", values, {headers: {Authorization: `Bearer ${token}`}})
        .then((res) => {
          NotificationMessage("success", "Role Created Successfully");
          setIsRoleModalOpen(false);
          form.resetFields();
          retrieveRoleData();
          setRoleID(null);
        })
        .catch((err) =>
          NotificationMessage("warning", err.response.data.message)
        );
    } else if (roleID) {
      await API.post("/role/v1/update_user_role_name", {
        update_role_name: values.role_name,
        role_id: roleID,
      }, {headers: {Authorization: `Bearer ${token}`}})
        .then((res) => {
          NotificationMessage("success", "Role Updated Successfully");
          setIsRoleModalOpen(false);
          form.resetFields();
          retrieveRoleData();
          setRoleID(null);
        })
        .catch((err) =>
          NotificationMessage("warning", err.response.data.memssage)
        );
    }
    setIsLoading(false);
  };

  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        // onAddClick={() => setIsModalOpen(true)}
        // addButtonTitle="Add Role"
        // addButtonIcon={<PlusOutlined />}
        // rowSelection={rowSelection}
        loadingTableData={isLoading}
      />
      <Modal
        title="Add New Role"
        centered
        open={isRoleModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields();
          setIsRoleModalOpen(false);
          setRoleID(null);
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
            name="role_name"
            label="Role Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter role name",
              },
            ]}
          >
            <Input
              style={{ marginBottom: "0.5rem" }}
              placeholder="Enter Role"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Roles;
