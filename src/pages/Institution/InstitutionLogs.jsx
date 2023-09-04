import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Progress, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import API from "../../apis/getApi";

const InstitutionLogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [institutionData, setInstitutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState({page: 1});
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Institution Logs" }]);
    // setRole(localStorage.getItem("role"))
    retrieveInstitutionData();
  }, []);

  const retrieveInstitutionData = async (pagination) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    await API.post(
      "/institute/v1/institution-logs",
      { page_number: currentPagination.page, page_limit: 10 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        setTotalPages(res.data.total_object);
        setInstitutionData(res?.data?.message?.map(data => ({...data, instituteName: data?.institution?.name, username: data?.user_info?.username})));
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const columns = [
    {
      title: "Institution Name",
      dataIndex: "instituteName",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Event Info",
      dataIndex: "event_info",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "User Name",
      dataIndex: "username",
      // sorter: (a, b) => {},
      // editable: true,
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
        rowSelection={rowSelection}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveInstitutionData}
        loadingTableData={isLoading}
      />
    </>
  );
};

export default InstitutionLogs;
