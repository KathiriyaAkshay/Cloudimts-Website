import { Divider, Space, Table, Select } from "antd";
// import React, { useEffect, useState } from "react";
import { AddButton } from "./AddButton";
import { Search } from "./Search";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { omit } from "lodash";

const TableWithFilter = ({
  csv,
  settings,
  name,
  type,
  filterHeaderStyle,
  showActiveFilters = true,
  onAddClick = () => {},
  addButtonIcon,
  addButtonTitle,
  tableData,
  tableColumns,
  pagination,
  totalRecords,
  onPaginationChange = () => {},
  loadingTableData,
  showOnlyTable = false,
  showDivider,
  setPagi = () => {},
  active,
  inActive,
  total,
  search,
  summary,
  dead,
  multiple,
  rowSelection,

}) => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [userRole, setUserRole] = useState(null);
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: totalRecords,
    search: "",
    order: "desc",
  });

  useEffect(() => {
    setPagi(Pagination);
    onPaginationChange(Pagination);
  }, [Pagination]);

  const onShowSizeChange = (current, pageSize) => {
    setLimit(pageSize);
    setPagination((prev) => ({ ...prev, page: current, limit: pageSize }));
  };

  // const setFilter = (option) => {
  //   if (option == "active") {
  //     setPagination({ ...Pagination, status: "active", isDead: 0, page: 1 });
  //   }
  //   if (option == "inactive") {
  //     setPagination({ ...Pagination, status: "inactive", isDead: 0, page: 1 });
  //   }
  //   if (option == "dead") {
  //     setPagination({ ...omit(Pagination, ["status"]), isDead: 1, page: 1 });
  //   }
  //   if (option == "all") {
  //     setPagination({ ...omit(Pagination, ["status", "isDead"]), page: 1 });
  //   }
  // };

  return (
    <>
      <div className="listing-header" style={filterHeaderStyle}>
        <div className="listing-header-right">
          <Space>
            <div>{csv}</div>
            <div>{settings}</div>
          </Space>
          {type == "Menu" && (
            <Space>
              <Select
                style={{ width: 120, marginRight: 10, borderRadius: "25px" }}
                placeholder="Filter By"
                // onChange={(e) => setFilter(e)}
                options={[
                  { value: "all", label: "All" + " " + name },
                  { value: "active", label: "Active" + " " + name },
                  {
                    value: "inactive",
                    label: "Inactive" + " " + name,
                  },
                  { value: "dead", label: "Dead" + " " + name },
                ]}
              />
            </Space>
          )}

          {search && (
            <div className="listing-search">
              <Search />
            </div>
          )}
          {addButtonIcon && addButtonTitle ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <AddButton
                push={onAddClick}
                icon={addButtonIcon}
                title={addButtonTitle}
              />
            </div>
          ) : null}
        </div>
      </div>

      {showDivider && <Divider />}
      <div className="ant-table-wrapper">
        <Table
          bordered
          dataSource={[...tableData]}
          columns={tableColumns}
          rowClassName="editable-row"
          pagination={
            !pagination
              ? {
                  current: Pagination.page,
                  pageSize: limit,
                  total: totalRecords,
                  pageSizeOptions: [5,10, 25, 50, 100, 200, 500],
                  showSizeChanger: totalRecords >= 0,
                  onChange: (page = 1, pageSize = limit) => {
                    setPagination({ ...Pagination, page, limit: pageSize });
                  },
                  onShowSizeChange: onShowSizeChange,
                }
              : false
          }
          scroll={
            !pagination
              ? window.screen.width < 1000
                ? { x: 500 }
                : {y:475}
              : { y: 375, x: window.screen.width < 1000 ? 1000 : null }
          }
          loading={loadingTableData}
          rowSelection={rowSelection && { type: "checkbox", ...rowSelection }}
          summary={summary ? summary : () => <></>}
        />
      </div>
    </>
  );
};

export default TableWithFilter;
