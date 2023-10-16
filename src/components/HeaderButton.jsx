import { Button, Select } from "antd";
import React, { useContext } from "react";
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
import { deleteStudy } from "../apis/studiesApi";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";

const HeaderButton = ({ setIsModalOpen, id }) => {
  const navigate = useNavigate();
  const { permissionData } = useContext(UserPermissionContext);
  const { setIsRoleModalOpen } = useContext(UserRoleContext);
  const { isFilterSelected } = useContext(FilterSelectedContext);
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
  } = useContext(filterDataContext);
  const { setSelectedItem } = useContext(ReportDataContext);
  const { billingFilterData, setBillingFilterData } =
    useContext(BillingDataContext);
  const { studyIdArray } = useContext(StudyIdContext);

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
            onClick={() => setIsStudyFilterModalOpen(true)}
            className={`btn-icon-div ${isFilterSelected && "filter-selected"}`}
          >
            <FilterOutlined style={{ fontWeight: "500" }} /> Quick Filter
          </Button>
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
              }))
            }
          >
            Study Images
          </Button>
          <Button
            type="primary"
            onClick={() =>
              setSelectedItem((prev) => ({
                isPatientSelected: true,
                isInstitutionSelected: false,
                isImagesSelected: false,
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
              }))
            }
          >
            Institution Information
          </Button>
          <Select placeholder="choose template" />
        </div>
      )}
      {window.location.pathname === "/billing" && (
        <div className="iod-setting-div">
          {permissionData["Other option permission"] &&
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
    </div>
  );
};

export default HeaderButton;
