import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Progress, Space, Tooltip } from "antd";
import { EyeFilled, PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import FilterModal from "../../components/FilterModal";
import {
  filterInstitutionData,
  getInstitutionLogs,
} from "../../apis/studiesApi";
import { UserPermissionContext } from "../../hooks/userPermissionContext";

const Institution = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [institutionData, setInstitutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState({ page: 1 });
  const [totalPages, setTotalPages] = useState(0);
  const [logsData, setLogsData] = useState([]);
  const navigate = useNavigate();
  const { permissionData } = useContext(UserPermissionContext);

  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Institution" }]);
    // setRole(localStorage.getItem("role"))
    retrieveInstitutionData();
  }, []);

  const retrieveInstitutionData = async (pagination, values = {}) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    filterInstitutionData({
      filter: values,
      condition: "and",
      page_number: currentPagination.page,
      page_size: 10,
    })
      .then((res) => {
        setTotalPages(res.data.total_object);
        setInstitutionData(res.data.data);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const editActionHandler = (id) => {
    navigate(`/institutions/${id}/edit`);
  };

  const deleteActionHandler = () => {};

  const retrieveLogsData = (id) => {
    getInstitutionLogs({ id: id })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          institution: data.institution.name,
          username: data.user_info.username,
        }));
        setLogsData(resData);
        setIsDrawerOpen(true);
      })
      .catch((err) => console.log(err));
  };

  const checkPermissionStatus = (name) => {
    const permission = permissionData["InstitutionTable view"]?.find(
      (data) => data.permission === name
    )?.permission_value;
    return permission;
  };

  const columns = [
    {
      title: "Institution Name",
      dataIndex: "name",
      className: `${
        checkPermissionStatus("View Institution name")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Email",
      dataIndex: "email",
      className: `${
        checkPermissionStatus("View Institution email")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Contact Number",
      dataIndex: "contact",
      className: `${
        checkPermissionStatus("View Institution contact number")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "City",
      dataIndex: "city",
      className: `${
        checkPermissionStatus("View Institution City")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "State",
      dataIndex: "state",
      className: `${
        checkPermissionStatus("View Institution State")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Country",
      dataIndex: "country",
      // className: `${
      //   checkPermissionStatus("View Username") ? "" : "column-display-none"
      // }`,
    },
    {
      title: "Usage",
      dataIndex: "institution_space_usage",
      className: `${
        checkPermissionStatus("View Institution space usage")
          ? ""
          : "column-display-none"
      }`,
      render: (text, record) => <Progress percent={text} />,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      className: `${
        checkPermissionStatus("View Institution created at")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      className: `${
        checkPermissionStatus("View Institution last updated at")
          ? ""
          : "column-display-none"
      }`,
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
          <DeleteActionIcon
            deleteActionHandler={() => deleteActionHandler(record)}
          />
        </Space>
      ),
    },
  ].filter(Boolean);

  const logsColumn = [
    {
      title: "Institution Name",
      dataIndex: "institution",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Event",
      dataIndex: "event_info",
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
        tableData={institutionData}
        tableColumns={columns}
        // onAddClick={() => navigate("/institutions/add")}
        // addButtonTitle="Add Institution"
        // addButtonIcon={<PlusOutlined />}
        // rowSelection={rowSelection}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveInstitutionData}
        loadingTableData={isLoading}
      />
      <FilterModal
        name="Institution Filter"
        setInstitutionData={setInstitutionData}
        retrieveInstitutionData={retrieveInstitutionData}
      />
      <Drawer
        title="Institution Logs"
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

export default Institution;
