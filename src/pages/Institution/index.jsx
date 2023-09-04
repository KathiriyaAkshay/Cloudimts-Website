import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Drawer, Progress, Space, Tooltip } from "antd";
import { EyeFilled, PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import API from "../../apis/getApi";
import FilterModal from "../../components/FilterModal";
import {
  filterInstitutionData,
  getInstitutionLogs,
} from "../../apis/studiesApi";

const Institution = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [institutionData, setInstitutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState({ page: 1 });
  const [totalPages, setTotalPages] = useState(0);
  const [logsData, setLogsData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
        setIsDrawerOpen(true)
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: "Institution Name",
      dataIndex: "name",
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
      title: "City",
      dataIndex: "city",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "State",
      dataIndex: "state",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Usage",
      dataIndex: "institution_space_usage",
      // sorter: (a, b) => {},
      // editable: true,
      render: (text, record) => <Progress percent={text} />,
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
        rowSelection={rowSelection}
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
