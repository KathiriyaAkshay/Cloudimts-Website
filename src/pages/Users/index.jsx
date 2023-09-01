import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import API from "../../apis/getApi";

const Users = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Users" }]);
    // setRole(localStorage.getItem("role"))
    retrieveUsersData();
  }, []);

  const retrieveUsersData = async (pagination) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    await API.post(
      "/user/v1/fetch-user-list",
      { page_number: currentPagination.page, page_limit: 10 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
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
    navigate(`/users/${id}/edit`)
  };

  const deleteActionHandler = () => {};

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
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
      title: "Contact Number",
      dataIndex: "contact",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Role",
      dataIndex: "role_name",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Institute",
      dataIndex: "institute_name",
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
          <EditActionIcon editActionHandler={() => editActionHandler(record.id)} />
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

  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        // onAddClick={() => navigate("/users/add")}
        // addButtonTitle="Add Users"
        // addButtonIcon={<PlusOutlined />}
        rowSelection={rowSelection}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveUsersData}
        loadingTableData={isLoading}
      />
    </>
  );
};

export default Users;
