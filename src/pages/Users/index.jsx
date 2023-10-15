import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
  Tag,
  Tooltip,
} from "antd";
import { EyeFilled, PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { TbLockAccess } from "react-icons/tb";
import UserFilterModal from "../../components/UserFilterModal";
import {
  disableUser,
  enableUser,
  filterUserData,
  getParticularUsersLogs,
  updateUserPassword,
} from "../../apis/studiesApi";
import { UserPermissionContext } from "../../hooks/userPermissionContext";
import NotificationMessage from "../../components/NotificationMessage";

const Users = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");
  const [logsData, setLogsData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { permissionData } = useContext(UserPermissionContext);
  const [userTablePermission, setUserTablePermission] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [userID, setUserID] = useState(null);

  const navigate = useNavigate();

  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setUserTablePermission(permissionData["UserTable view"]);
  }, [permissionData]);

  useEffect(() => {
    changeBreadcrumbs([{ name: "Users" }]);
  }, []);

  const retrieveUsersData = async (pagination, values = {}) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    filterUserData({
      filter: values,
      condition: "and",
      page_number: currentPagination.page,
      page_size: currentPagination.limit || 10,
    })
      .then((res) => {
        const resData = res.data.data.map((item) => ({
          ...item,
          role_name: item.role.role_name,
          institute_name: item.institute.name,
          username: item.user.username,
          email: item.user.email,
        }));
        setTableData(resData);
        setTotalPages(res.data.total_object);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const editActionHandler = (id) => {
    navigate(`/users/${id}/edit`);
  };

  const deleteActionHandler = () => {};

  const retrieveLogsData = (id) => {
    getParticularUsersLogs({ id: id })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          perform_user: data?.perfrom_user?.username,
          target_user: data?.target_user?.username,
        }));
        setLogsData(resData);
        setIsDrawerOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const checkPermissionStatus = (name) => {
    const permission = userTablePermission.find(
      (data) => data.permission === name
    )?.permission_value;
    return permission;
  };

  const statusChangeHandler = async (status, id) => {
    if (status) {
      if (checkPermissionStatus("Enable user")) {
        await enableUser({ id })
          .then((res) => {
            NotificationMessage("success", "User Status Updated Successfully");
            retrieveUsersData();
          })
          .catch((err) =>
            NotificationMessage("warning", err.response.data.message)
          );
      } else {
        NotificationMessage(
          "warning",
          "User Don't have Permission to Enable User"
        );
      }
    } else {
      if (checkPermissionStatus("Disable user")) {
        await disableUser({ id })
          .then((res) => {
            NotificationMessage("success", "User Status Updated Successfully");
            retrieveUsersData();
          })
          .catch((err) =>
            NotificationMessage("warning", err.response.data.message)
          );
      } else {
        NotificationMessage(
          "warning",
          "User Don't have Permission to Disable User"
        );
      }
    }
  };

  const columns = [
    checkPermissionStatus("View Username") && {
      title: "Username",
      dataIndex: "username",
      className: `${
        checkPermissionStatus("View Username") ? "" : "column-display-none"
      }`,
    },
    checkPermissionStatus("View Email") && {
      title: "Email",
      dataIndex: "email",
      className: `${
        checkPermissionStatus("View Email") ? "" : "column-display-none"
      }`,
    },
    checkPermissionStatus("View contact number") && {
      title: "Contact Number",
      dataIndex: "contact",
      className: `${
        checkPermissionStatus("View contact number")
          ? ""
          : "column-display-none"
      }`,
    },
    checkPermissionStatus("View Role name") && {
      title: "Role",
      dataIndex: "role_name",
      className: `${
        checkPermissionStatus("View Role name") ? "" : "column-display-none"
      }`,
    },
    checkPermissionStatus("View Institution name") && {
      title: "Institute",
      dataIndex: "institute_name",
      className: `${
        checkPermissionStatus("View Institution name")
          ? ""
          : "column-display-none"
      }`,
    },
    checkPermissionStatus("View Created time") && {
      title: "Created At",
      dataIndex: "created_at",
      className: `${
        checkPermissionStatus("View Created time") ? "" : "column-display-none"
      }`,
    },
    checkPermissionStatus("View last updated time") && {
      title: "Updated At",
      dataIndex: "updated_at",
      className: `${
        checkPermissionStatus("View last updated time")
          ? ""
          : "column-display-none"
      }`,
    },
    checkPermissionStatus("View Disable/Enable user option") && {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return {
          children: (
            <Popconfirm
              title="Are you sure to update status?"
              onConfirm={() =>
                statusChangeHandler(!record?.user?.is_active, record.id)
              }
            >
              <Switch
                checkedChildren="Enable"
                checked={record?.user?.is_active}
                // onChange={(state) => {
                //   changeStatus(record.id, state);
                // }}
                unCheckedChildren="Disable"
                className="table-switch"
              />
            </Popconfirm>
          ),
        };
      },
    },
    checkPermissionStatus("Actions option access") && {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      className: `${
        checkPermissionStatus("Actions option access")
          ? ""
          : "column-display-none"
      }`,
      width: window.innerWidth < 650 ? "1%" : "10%",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <EditActionIcon
            editActionHandler={() => editActionHandler(record.id)}
          />
          <Tooltip title={"View Logs"}>
            <EyeFilled
              className="action-icon"
              onClick={() => retrieveLogsData(record.id)}
            />
          </Tooltip>
          <Tooltip title={"Reset Password"}>
            <TbLockAccess
              className="action-icon"
              style={{ fontSize: "24px" }}
              onClick={() => {
                setUserID(record.id);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          {/* <DeleteActionIcon
            deleteActionHandler={() => deleteActionHandler(record)}
          /> */}
        </Space>
      ),
    },
  ].filter(Boolean);

  const logsColumn = [
    {
      title: "Perform User",
      dataIndex: "perform_user",
    },
    {
      title: "Target User",
      dataIndex: "target_user",
    },
    {
      title: "Event",
      dataIndex: "logs_id",
      render: (text) => (
        <Tag
          color={
            text.includes("User login")
              ? "blue"
              : text.includes("create")
              ? "green"
              : text.includes("basic details update")
              ? "warning"
              : text.includes("modality details update")
              ? "orange"
              : text.includes("institution details update")
              ? "magenta"
              : text.includes("password update")
              ? "lime"
              : text.includes(" Signature image")
              ? "cyan"
              : text.includes("User disable")
              ? "red"
              : "purple"
          }
          className="event-type-tag"
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
    },
  ];

  const submitHandler = async (values) => {
    setIsLoading(true);
    await updateUserPassword({
      update_password: values.update_password,
      target_id: userID,
    })
      .then((res) => {
        NotificationMessage("success", "User Password Updated Successfully");
        setUserID(null);
        setIsModalOpen(false);
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
    setIsLoading(false);
  };

  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        // rowSelection={rowSelection}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveUsersData}
        loadingTableData={isLoading}
      />
      <UserFilterModal
        retrieveUsersData={retrieveUsersData}
        name={"User Filter"}
      />
      <Drawer
        title="Users Logs"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={700}
      >
        <TableWithFilter tableData={logsData} tableColumns={logsColumn} />
      </Drawer>
      <Modal
        width={500}
        title={"Reset Password"}
        centered
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
          setUserID(null);
        }}
      >
        {" "}
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
            <Col xs={24} lg={24}>
              <Form.Item
                label="New Password"
                name="update_password"
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
                  name="update_password"
                  style={{ marginBottom: "0.5rem" }}
                  placeholder="Enter Password"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={24}>
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
                      if (
                        !value ||
                        getFieldValue("update_password") === value
                      ) {
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
                dependencies={["update_password"]}
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
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
