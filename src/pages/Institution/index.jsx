import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Progress, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableWithFilter from "../../components/TableWithFilter";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import API from "../../apis/getApi";

const Institution = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [institutionData, setInstitutionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { changeBreadcrumbs } = useBreadcrumbs();

  const dummyData = [
    {
      name: "Institute 1",
      email: "harsh@gmail.com",
      usage: "20",
      contact: 123456,
      city: "surat",
      state: "gujarat",
      country: "india"
    }
  ]

  useEffect(() => {
    changeBreadcrumbs([{ name: "Institution" }]);
    // setRole(localStorage.getItem("role"))
    retrieveInstitutionData();
  }, []);

  const retrieveInstitutionData = async (pagination) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    await API.post(
      "/institute/v1/institution-list",
      { page_number: currentPagination.page, page_limit: 10 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
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
      dataIndex: "usage",
      // sorter: (a, b) => {},
      // editable: true,
      render: (text, record) => <Progress percent={20} />
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

  return (
    <>
      <TableWithFilter
        tableData={dummyData}
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
    </>
  );
};

export default Institution;
