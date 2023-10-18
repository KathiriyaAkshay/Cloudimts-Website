import React, { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { getStudyLogs } from "../../apis/studiesApi";
import TableWithFilter from "../../components/TableWithFilter";
import { Tag } from "antd";

const StudyLogs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [pagi, setPagi] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(0);
  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Study Logs" }]);
    // setRole(localStorage.getItem("role"))
    // retrieveStudyData();
  }, []);

  const retrieveStudyData = (pagination) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    getStudyLogs({
      page_size: currentPagination.limit || 10,
      page_number: currentPagination.page,
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          target_user: data?.target_user?.username,
          perform_user: data?.perform_user?.username,
        }));
        setTableData(resData);
        setTotalPages(res.data.total_object);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const columns = [
    {
      title: "Perform User",
      dataIndex: "perform_user",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Target User",
      dataIndex: "target_user",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Time",
      dataIndex: "time",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Event Display",
      dataIndex: "event_display",
      // sorter: (a, b) => {},
      // editable: true,
      render: (text) => (
        <Tag
          color={
            text.includes("Assigned")
              ? "blue"
              : text.includes("Viewed")
              ? "green"
              : text.includes("Update study details")
              ? "warning"
              : text.includes("Image transfer start")
              ? "orange"
              : text.includes("Image transfer complete")
              ? "magenta"
              : text.includes("Remove assign user")
              ? "lime"
              : text.includes("Report study")
              ? "cyan"
              : text.includes("Delete study")
              ? "red"
              : text.includes("Report viewed")
              ? "geekblue"
              : text.includes("Closed study")
              ? "yellow"
              : text.includes("Reporting Study")
              ? "volcanos"
              : text.includes("Backup study")
              ? "gold"
              : "purple"
          }
          className="event-type-tag"
        >
          {text}
        </Tag>
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
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveStudyData}
        loadingTableData={isLoading}
      />
    </>
  );
};

export default StudyLogs;
