import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Space, Tooltip } from "antd";
import { EyeFilled, PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import API from "../../apis/getApi";
import UserFilterModal from "../../components/UserFilterModal";
import { filterUserData, getParticularUsersLogs } from "../../apis/studiesApi";
import { UserPermissionContext } from "../../hooks/userPermissionContext";

const Users = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState({ page: 1 });
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");
  const [logsData, setLogsData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { permissionData } = useContext(UserPermissionContext);
  const [userTablePermission, setUserTablePermission] = useState([]);

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
      page_size: 10,
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

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      className: `${
        checkPermissionStatus("View Username") ? "" : "column-display-none"
      }`,
    },
    {
      title: "Email",
      dataIndex: "email",
      className: `${
        checkPermissionStatus("View Email") ? "" : "column-display-none"
      }`,
    },
    {
      title: "Contact Number",
      dataIndex: "contact",
      className: `${
        checkPermissionStatus("View contact number")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Role",
      dataIndex: "role_name",
      className: `${
        checkPermissionStatus("View Role name") ? "" : "column-display-none"
      }`,
    },
    {
      title: "Institute",
      dataIndex: "institute_name",
      className: `${
        checkPermissionStatus("View Institution name")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      className: `${
        checkPermissionStatus("View Created time") ? "" : "column-display-none"
      }`,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      className: `${
        checkPermissionStatus("View last updated time")
          ? ""
          : "column-display-none"
      }`,
    },
    {
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
          <DeleteActionIcon
            deleteActionHandler={() => deleteActionHandler(record)}
          />
        </Space>
      ),
    },
  ];

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
    },
    {
      title: "Time",
      dataIndex: "time",
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
        title="Study Logs"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={600}
      >
        <TableWithFilter tableData={logsData} tableColumns={logsColumn} />
      </Drawer>
    </>
  );
};

export default Users;
