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
  dashboard,
  isAuditModal,
}) => {
  const [limit, setLimit] = useState(localStorage.getItem("pageSize")||10);
  const [userRole, setUserRole] = useState(null);
  const [Pagination, setPagination] = useState({
    page: 1,
    limit:limit,
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
          dataSource={[...tableData]}
          columns={tableColumns}
          rowClassName="editable-row"
          pagination={
            !pagination
              ? {
                  current: Pagination.page,
                  pageSize:Pagination.limit,
                  total: totalRecords,
                  pageSizeOptions: [10, 25, 50, 100, 200, 500],
                  showSizeChanger: totalRecords >= 0,
                  onChange: (page = 1, pageSize = Pagination.limit) => {
                    localStorage.setItem("pageSize",pageSize)
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
                : {y:dashboard?375:isAuditModal?240:465}
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
