import React, { useEffect, useState } from "react";
import SupportModal from "../../components/SupportModal";
import TableWithFilter from "../../components/TableWithFilter";
import { Space } from "antd";
import EditActionIcon from "../../components/EditActionIcon";
import DeleteActionIcon from "../../components/DeleteActionIcon";
import {
  deleteStudy,
  deleteSupport,
  fetchSupport,
} from "../../apis/studiesApi";
import NotificationMessage from "../../components/NotificationMessage";

const index = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    retrieveSupportData();
  }, []);

  const retrieveSupportData = async () => {
    setIsLoading(true);
    await fetchSupport()
      .then((res) => setTableData(res.data.data))
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const editActionHandler = (record) => {};

  const deleteActionHandler = async (id) => {
    await deleteSupport({ id })
      .then((res) => {
        NotificationMessage("success", "Support deleted Successfully");
        retrieveSupportData();
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
  };
  const columns = [
    {
      title: "Email",
      dataIndex: "option_value",
      render: (text, record) => (record?.option === 1 ? text : "-"),
    },
    {
      title: "Phone Number",
      dataIndex: "option_value",
      render: (text, record) => (record?.option === 2 ? text : "-"),
    },
    {
      title: "Description",
      dataIndex: "option_description",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: window.innerWidth < 650 ? "1%" : "10%",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <EditActionIcon editActionHandler={() => editActionHandler(record)} />
          <DeleteActionIcon
            deleteActionHandler={() => deleteActionHandler(record.id)}
          />
        </Space>
      ),
    },
  ];
  return (
    <>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        loadingTableData={isLoading}
      />
      <SupportModal retrieveSupportData={retrieveSupportData} />
    </>
  );
};

export default index;
