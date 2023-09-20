import React, { useEffect, useState } from "react";
import TableWithFilter from "../../components/TableWithFilter";
import { getFilterList } from "../../apis/studiesApi";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { Space } from "antd";
import EditActionIcon from "../../components/EditActionIcon";
import StudyFilterModal from "../../components/StudyFilterModal";

const index = () => {
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterID, setFilterID] = useState(null);
  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Filters" }]);
    retrieveFilterOptions();
  }, []);

  const retrieveFilterOptions = () => {
    getFilterList()
      .then((res) => setFilterData(res.data.data))
      .catch((err) => console.log(err));
  };

  const editActionHandler = (id) => {
    setFilterID(id);
    setIsFilterModalOpen(true);
  };

  const columns = [
    {
      title: "Filter Name",
      dataIndex: "filter_name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <TableWithFilter
        tableData={filterData}
        tableColumns={columns}
        loadingTableData={isLoading}
      />
      <StudyFilterModal
        isFilterModalOpen={isFilterModalOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        filterID={filterID}
        setFilterID={setFilterID}
        retrieveFilterOptions={retrieveFilterOptions}
      />
    </div>
  );
};

export default index;
