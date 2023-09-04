import React, { useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { getUsersLogs } from "../../apis/studiesApi";
import TableWithFilter from "../../components/TableWithFilter";

const UsersLogs = () => {
  const [tableData, setTableData] = useState([]);
  const { changeBreadcrumbs } = useBreadcrumbs();
  const [isLoading, setIsLoading] = useState(false);
  const [pagi, setPagi] = useState({ page: 1 });
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    changeBreadcrumbs([{ name: "Users Logs" }]);
    retrieveStudyData();
  }, []);

  const retrieveStudyData = (pagination) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    getUsersLogs({
      page_number: currentPagination.page,
      page_limit: 10,
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          perform_user: data?.perfrom_user?.username,
          target_user: data?.target_user?.username,
        }));
        setTableData(resData);
        setTotalPages(resData.length);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const columns = [
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
    <div>
      <TableWithFilter
        tableData={tableData}
        tableColumns={columns}
        rowSelection={rowSelection}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveStudyData}
        loadingTableData={isLoading}
      />
    </div>
  );
};

export default UsersLogs;
