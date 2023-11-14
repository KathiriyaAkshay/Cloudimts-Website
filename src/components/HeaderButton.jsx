import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Menu,
  Popover,
  Select,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../hooks/usersRolesContext";
import { UserEmailContext } from "../hooks/userEmailContext";
import { filterDataContext } from "../hooks/filterDataContext";
import { ReportDataContext } from "../hooks/reportDataContext";
import { UserPermissionContext } from "../hooks/userPermissionContext";
import { SiMicrosoftexcel } from "react-icons/si";
import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { handleDownloadPDF, handleExport } from "../helpers/billingTemplate";
import { BillingDataContext } from "../hooks/billingDataContext";
import { StudyIdContext } from "../hooks/studyIdContext";
import NotificationMessage from "./NotificationMessage";
import { deleteStudy, getReportList } from "../apis/studiesApi";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";
import { AiOutlineFilter, AiOutlinePlus } from "react-icons/ai";
import StudyFilterModal from "./StudyFilterModal";
import { StudyDataContext } from "../hooks/studyDataContext";
import {
  applyMainFilter,
  applySystemFilter,
  retrieveSystemFilters,
} from "../helpers/studyDataFilter";
import { set } from "lodash";

const HeaderButton = ({
  setIsModalOpen,
  id,
  filterOptions,
  retrieveFilterOptions,
}) => {
  const navigate = useNavigate();
  const { permissionData } = useContext(UserPermissionContext);
  const { setIsRoleModalOpen } = useContext(UserRoleContext);
  const {
    isFilterSelected,
    isAdvanceSearchSelected,
    setIsAdvanceSearchSelected,
  } = useContext(FilterSelectedContext);
  const { setIsEmailModalOpen } = useContext(UserEmailContext);
  const {
    setIsFilterModalOpen,
    setIsUserFilterModalOpen,
    setIsEmailFilterModalOpen,
    setIsStudyFilterModalOpen,
    setIsBillingFilterModalOpen,
    setIsRoleLogsFilterModalOpen,
    setIsInstitutionLogsFilterModalOpen,
    setIsUserLogsFilterModalOpen,
    setIsSupportModalOpen,
    setIsAdvancedSearchModalOpen,
  } = useContext(filterDataContext);
  const { setSelectedItem } = useContext(ReportDataContext);
  const { billingFilterData, setBillingFilterData } =
    useContext(BillingDataContext);
  const { studyIdArray } = useContext(StudyIdContext);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [isAddFilterModalOpen, setIsAddFilterModalOpen] = useState(false);
  const {
    setStudyDataPayload,
    setStudyData,
    setSystemFilterPayload,
    studyDataPayload,
    systemFilterPayload,
  } = useContext(StudyDataContext);
  const [systemFilters, setSystemsFilters] = useState([]);
  const [isFilterCollapseOpen, setIsFilterCollapseOpen] = useState(false);
  const [isFilterChecked, setIsFilterChecked] = useState(null);
  const [isSystemFilterChecked, setIsSystemFilterChecked] = useState(null);

  useEffect(() => {
    if (window.location.pathname === `/reports/${id}`) {
      retrieveTemplateOptions();
    }
  }, [window.location.pathname]);

  useEffect(() => {
    if (window.location.pathname === "/studies") {
      fetchSystemFilter();
    }
  }, [window.location.pathname]);

  const fetchSystemFilter = async () => {
    const response = await retrieveSystemFilters();
    console.log(response);
    const modifiedOptions = response.map((data) => ({
      label: data.name,
      value: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      key: `${data?.filter_data?.option} ${data?.filter_data?.filter?.status__icontains}`,
      details: data.filter_data,
    }));
    setSystemsFilters(modifiedOptions);
  };

  const retrieveTemplateOptions = async () => {
    await getReportList({ page_number: 1, page_limit: 50 })
      .then((res) => {
        const resData = res.data.data?.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setTemplateOptions(resData);
      })
      .catch((err) => console.log(err));
  };

  const deleteStudyData = async () => {
    if (studyIdArray.length > 0) {
      deleteStudy({ id: studyIdArray })
        .then((res) => {})
        .catch((err) =>
          NotificationMessage("warning", err.response.data.message)
        );
    } else {
      NotificationMessage("warning", "Please select study");
    }
  };

  const checkPermissionStatus = (name) => {
    const permission = permissionData["Menu Permission"]?.find(
      (data) => data.permission === name
    )?.permission_value;
    return permission;
  };

  const menuLabel = (title) => (
    <div className="display-flex-between" style={{ gap: "4px" }}>
      {title}
      {/* <AiOutlineDown className="down-icon" /> */}
    </div>
  );

  const menuItems = [
    checkPermissionStatus("Show Filter option") && {
      label: "Filters",
      key: "filters",
      icon: <AiOutlineFilter />,
      children: [
        ...filterOptions,
        checkPermissionStatus("Show Add Filter option") && {
          label: (
            <div onClick={() => setIsAddFilterModalOpen(true)}>
              <AiOutlinePlus /> Add Filter
            </div>
          ),
        },
      ].filter(Boolean),
    },
  ].filter(Boolean);

  const systemsFilterMenu = [
    {
      label: "System Filters",
      key: "filters",
      icon: <AiOutlineFilter />,
      children: systemFilters,
    },
  ];

  const content = (
    <Collapse
      bordered={true}
      expandIconPosition="end"
      // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      className="setting-main-div"
      // style={{
      //   position: "absolute",
      //   top: "100%",
      //   zIndex: "999",
      //   width: "200px",
      // }}
      accordion
    >
      <Collapse.Panel
        header="Main Filter"
        key="1"
        className="setting-panel mb-0"
      >
        {filterOptions?.map((data) => (
          <div>
            <Checkbox
              name={data?.label}
              key={data?.key}
              checked={isFilterChecked === data?.key}
              onClick={() => {
                setIsSystemFilterChecked(null);
                if (data?.key === isFilterChecked) {
                  setIsFilterChecked(null);
                  setStudyDataPayload({});
                } else {
                  setIsFilterChecked(data?.key);
                  setStudyDataPayload({
                    id: data.key,
                    page_number: 1,
                    page_size: 10,
                    deleted_skip: false,
                    all_premission_id: JSON.parse(
                      localStorage.getItem("all_permission_id")
                    ),
                    all_assign_id: JSON.parse(
                      localStorage.getItem("all_assign_id")
                    ),
                  });
                  applyMainFilter(
                    {
                      id: data.key,
                      page_number: 1,
                      page_size: 10,
                      deleted_skip: false,
                      all_premission_id: JSON.parse(
                        localStorage.getItem("all_permission_id")
                      ),
                      all_assign_id: JSON.parse(
                        localStorage.getItem("all_assign_id")
                      ),
                    },
                    setStudyData
                  );
                }
                setSystemFilterPayload({});
                setIsAdvanceSearchSelected(false);
              }}
            >
              {data?.label}
            </Checkbox>
          </div>
        ))}
        <Divider style={{ margin: "10px 0px" }} />
        <div
          onClick={() => setIsAddFilterModalOpen(true)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: "500",
          }}
        >
          <AiOutlinePlus /> Add Filter
        </div>
      </Collapse.Panel>
      <Collapse.Panel
        header="System Filter"
        key="2"
        className="setting-panel mb-0"
      >
        {systemFilters?.map((data) => (
          <div>
            <Checkbox
              name={data?.label}
              key={data?.key}
              checked={isSystemFilterChecked === data?.key}
              onClick={() => {
                setIsFilterChecked(null);
                setIsSystemFilterChecked(data?.key);
                if (data?.key === isSystemFilterChecked) {
                  setIsSystemFilterChecked(null);
                  setSystemFilterPayload({});
                } else {
                  const option = data?.key?.split(" ")[0];
                  const filterOption = data?.key?.split(" ")[1];
                  setSystemFilterPayload({
                    option,
                    page_number: 1,
                    page_size: 10,
                    deleted_skip: false,
                    filter:
                      filterOption !== "undefined"
                        ? {
                            status__icontains: filterOption,
                          }
                        : {},
                    all_premission_id: JSON.parse(
                      localStorage.getItem("all_permission_id")
                    ),
                    all_assign_id: JSON.parse(
                      localStorage.getItem("all_assign_id")
                    ),
                  });
                  applySystemFilter(
                    {
                      option,
                      page_number: 1,
                      page_size: 10,
                      deleted_skip: false,
                      filter:
                        filterOption !== "undefined"
                          ? {
                              status__icontains: filterOption,
                            }
                          : {},
                      all_premission_id: JSON.parse(
                        localStorage.getItem("all_permission_id")
                      ),
                      all_assign_id: JSON.parse(
                        localStorage.getItem("all_assign_id")
                      ),
                    },
                    setStudyData
                  );
                }
                setStudyDataPayload({});
                setIsAdvanceSearchSelected(false);
              }}
            >
              {data?.label}
            </Checkbox>
          </div>
        ))}
      </Collapse.Panel>
    </Collapse>
  );

  return (
    <div>
      {window.location.pathname === "/iod-settings" && (
        <div className="iod-setting-div">
          <Button type="primary">Upload</Button>
          <Button>Connect IOD</Button>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Configure IOD settings
          </Button>
        </div>
      )}
      {window.location.pathname === "/institutions" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() => setIsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> Filter
          </Button>
          <Button type="primary" onClick={() => navigate("/institutions-logs")}>
            Institution Logs
          </Button>
          <Button
            type="primary"
            onClick={() => navigate("/institutions/add")}
            className="btn-icon-div"
          >
            <PlusOutlined style={{ fontWeight: "500" }} /> Add Institution
          </Button>
        </div>
      )}
      {window.location.pathname === "/institutions-logs" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() => setIsInstitutionLogsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> Institution Logs
            Filter
          </Button>
        </div>
      )}
      {window.location.pathname === "/users" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() => setIsUserFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> Filter
          </Button>
          <Button type="primary" onClick={() => navigate("/users-logs")}>
            Users Logs
          </Button>
          <Button
            type="primary"
            onClick={() => navigate("/users/add")}
            className="btn-icon-div"
          >
            <PlusOutlined style={{ fontWeight: "500" }} /> Add Users
          </Button>
        </div>
      )}
      {window.location.pathname === "/users-logs" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() => setIsUserLogsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> User Logs Filter
          </Button>
        </div>
      )}
      {window.location.pathname === "/users/roles" && (
        <div className="iod-setting-div">
          {permissionData["Other option permission"] &&
            permissionData["Other option permission"].find(
              (data) => data.permission === "Create New UserRole"
            )?.permission_value && (
              <Button
                type="primary"
                onClick={() => setIsRoleModalOpen(true)}
                className="btn-icon-div"
              >
                <PlusOutlined style={{ fontWeight: "500" }} /> Add Role
              </Button>
            )}
          <Button type="primary" onClick={() => navigate("/role-logs")}>
            Role Logs
          </Button>
        </div>
      )}
      {window.location.pathname === "/role-logs" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() => setIsRoleLogsFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> Logs Filter
          </Button>
        </div>
      )}
      {window.location.pathname === "/users/email" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() => setIsEmailFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> Filter
          </Button>
          {permissionData["Other option permission"] &&
            permissionData["Other option permission"].find(
              (data) => data.permission === "Create New Email"
            )?.permission_value && (
              <Button
                type="primary"
                onClick={() => setIsEmailModalOpen(true)}
                className="btn-icon-div"
              >
                <PlusOutlined style={{ fontWeight: "500" }} /> Add Email
              </Button>
            )}
        </div>
      )}
      {window.location.pathname === "/studies" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            className="error-btn-primary"
            onClick={deleteStudyData}
          >
            Delete Studies
          </Button>
          <Button
            type="primary"
            className={`btn-icon-div ${
              isAdvanceSearchSelected && "filter-selected"
            }`}
            onClick={() => setIsAdvancedSearchModalOpen(true)}
          >
            <SearchOutlined style={{ fontWeight: "500" }} />
            Advance Search
          </Button>
          <Button
            type="primary"
            onClick={() => setIsStudyFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> Quick Filter
          </Button>
          {/* {checkPermissionStatus("Show Filter option") && (
            <Menu
              onClick={(e) => {
                setStudyDataPayload({
                  id: e.key,
                  page_number: 1,
                  page_size: 10,
                  deleted_skip: false,
                });
                applyMainFilter(
                  {
                    id: e.key,
                    page_number: 1,
                    page_size: 10,
                    deleted_skip: false,
                  },
                  setStudyData
                );
              }}
              style={{
                width: 100,
                height: 32,
                // padding: "0px 0px 4px 0px",
              }}
              mode="horizontal"
              items={menuItems}
              className="filter-menu"
            />
          )}
          <Menu
            onSelect={(e) => {
              const option = e?.key?.split(" ")[0];
              const filterOption = e?.key?.split(" ")[1];
              setSystemFilterPayload({
                option,
                page_number: 1,
                page_size: 10,
                deleted_skip: false,
                filter: {
                  status__icontains: filterOption,
                },
              });
              applySystemFilter(
                {
                  option,
                  page_number: 1,
                  page_size: 10,
                  deleted_skip: false,
                  filter: {
                    status__icontains: filterOption,
                  },
                },
                setStudyData
              );
            }}
            style={{
              width: 154,
              height: 32,
              // padding: "0px 0px 4px 0px",
            }}
            mode="horizontal"
            items={systemsFilterMenu}
            className="filter-menu"
          /> */}
          <div style={{ position: "relative" }}>
            <Popover
              content={content}
              title={null}
              trigger="click"
              style={{ minWidth: "300px" }}
              className="filter-popover"
            >
              <Button
                type="primary"
                className={`btn-icon-div ${
                  (Object.keys(systemFilterPayload)?.length !== 0 ||
                    Object.keys(studyDataPayload)?.length !== 0) &&
                  "filter-selected"
                }`}
                onClick={() => setIsFilterCollapseOpen((prev) => !prev)}
              >
                <FilterOutlined style={{ fontWeight: "500" }} /> Filters
              </Button>
            </Popover>
          </div>
          <Button type="primary" onClick={() => navigate("/study-logs")}>
            Study Logs
          </Button>
        </div>
      )}
      {window.location.pathname === "/reports" && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() => navigate("/reports/add")}
            className="btn-icon-div"
          >
            <PlusOutlined style={{ fontWeight: "500" }} /> Add Report Template
          </Button>
        </div>
      )}
      {window.location.pathname === `/reports/${id}` && (
        <div className="iod-setting-div">
          <Button
            type="primary"
            onClick={() =>
              setSelectedItem((prev) => ({
                isPatientSelected: false,
                isInstitutionSelected: false,
                isImagesSelected: true,
                templateId: prev?.templateId,
                isStudyDescriptionSelected: false,
              }))
            }
          >
            Study Images
          </Button>
          <Button
            type="primary"
            onClick={() =>
              setSelectedItem((prev) => ({
                isPatientSelected: false,
                isInstitutionSelected: false,
                isImagesSelected: false,
                templateId: prev?.templateId,
                isStudyDescriptionSelected: true,
              }))
            }
          >
            Study Description
          </Button>
          <Button
            type="primary"
            onClick={() =>
              setSelectedItem((prev) => ({
                isPatientSelected: true,
                isInstitutionSelected: false,
                isImagesSelected: false,
                templateId: prev?.templateId,
                isStudyDescriptionSelected: false,
              }))
            }
          >
            Patient Information
          </Button>
          <Button
            type="primary"
            onClick={() =>
              setSelectedItem((prev) => ({
                isPatientSelected: false,
                isInstitutionSelected: true,
                isImagesSelected: false,
                templateId: prev?.templateId,
                isStudyDescriptionSelected: false,
              }))
            }
          >
            Institution Information
          </Button>
          <Select
            placeholder="choose template"
            options={templateOptions}
            onChange={(e) =>
              setSelectedItem((prev) => ({
                isPatientSelected: prev?.isPatientSelected,
                isInstitutionSelected: prev?.isInstitutionSelected,
                isImagesSelected: prev?.isImagesSelected,
                templateId: e,
                isStudyDescriptionSelected: prev?.isStudyDescriptionSelected,
              }))
            }
          />
        </div>
      )}
      {window.location.pathname === "/billing" && (
        <div className="iod-setting-div">
          {permissionData["Other option permission"] &&
            
            // ==== Download to excel option ==== 

            permissionData["Other option permission"].find(
              (data) =>
                data.permission === "Show Billing - export to excel option"
            )?.permission_value && (
              <Button
                type="primary"
                className="btn-icon-div"
                onClick={() => handleExport(billingFilterData)}
              >
                <SiMicrosoftexcel style={{ fontWeight: "500" }} /> Export Excel
              </Button>
            )}

            <Button
              type="primary"
              className="btn-icon-div"
              onClick={() => handleDownloadPDF(billingFilterData)}
            >
              <DownloadOutlined /> Download Bill
            </Button>
          
            <Button
              type="primary"
              className="btn-icon-div"
              onClick={() => setIsBillingFilterModalOpen(true)}
            >
              <SearchOutlined style={{ fontWeight: "500" }} /> Search Billing
            </Button>
        </div>
      )}
      {window.location.pathname === "/support" && (
        <div className="iod-setting-div">
          {permissionData["Support permission"] &&
            permissionData["Support permission"].find(
              (data) => data.permission === "Add Support details"
            )?.permission_value && (
              <Button
                type="primary"
                onClick={() => setIsSupportModalOpen(true)}
                className="btn-icon-div"
              >
                <PlusOutlined style={{ fontWeight: "500" }} /> Add New Support
              </Button>
            )}
        </div>
      )}
      <StudyFilterModal
        isFilterModalOpen={isAddFilterModalOpen}
        setIsFilterModalOpen={setIsAddFilterModalOpen}
        retrieveFilterOptions={retrieveFilterOptions}
      />
    </div>
  );
};

export default HeaderButton;
