import React, { useContext, useEffect, useState } from "react";
import { Drawer, Space, Table, Tag, Tooltip, Typography } from "antd";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import ChatMain from "../../components/Chat/ChatMain";
import DicomViewer from "../../components/DicomViewer";
import EditStudy from "../../components/Studies/EditStudy";
import PatientDetails from "../../components/Studies/PatientDetails";
import StudyAudits from "../../components/Studies/StudyAudits";
import StudyReports from "../../components/Studies/StudyReports";
import ShareStudy from "../../components/Studies/ShareStudy";
import {
  advanceSearchFilter,
  closeStudy,
  filterStudyData,
  getAllStudyData,
  getInstanceData,
  updateStudyStatus,
  updateStudyStatusReported,
} from "../../apis/studiesApi";
import AssignStudy from "../../components/Studies/AssignStudy";
import QuickFilterModal from "../../components/QuickFilterModal";
import { BsChat, BsEyeFill } from "react-icons/bs";
import { IoIosDocument, IoIosShareAlt } from "react-icons/io";
import { MdOutlineHistory } from "react-icons/md";
import { AuditOutlined } from "@ant-design/icons";
import EditActionIcon from "../../components/EditActionIcon";
import { UserPermissionContext } from "../../hooks/userPermissionContext";
import { StudyDataContext } from "../../hooks/studyDataContext";
import { StudyIdContext } from "../../hooks/studyIdContext";
import {
  applyMainFilter,
  applySystemFilter,
} from "../../helpers/studyDataFilter";
import { set } from "lodash";
import { FilterSelectedContext } from "../../hooks/filterSelectedContext";
import AdvancedSearchModal from "../../components/AdvancedSearchModal";

const Dicom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isShareStudyModalOpen, setIsShareStudyModalOpen] = useState(false);
  const { changeBreadcrumbs } = useBreadcrumbs();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [pagi, setPagi] = useState({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [studyID, setStudyID] = useState(null);
  const [seriesID, setSeriesID] = useState(null);
  const [personName, setPersonName] = useState(null);
  const { permissionData } = useContext(UserPermissionContext);
  const {
    studyData,
    setStudyData,
    studyDataPayload,
    setStudyDataPayload,
    systemFilterPayload,
    setSystemFilterPayload,
  } = useContext(StudyDataContext);
  const { studyIdArray, setStudyIdArray } = useContext(StudyIdContext);
  const { isFilterSelected, isAdvanceSearchSelected } = useContext(
    FilterSelectedContext
  );
  const [studyStatus, setStudyStatus] = useState("");
  const [limit, setLimit] = useState(10);
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: totalPages,
    search: "",
    order: "desc",
  });
  const [quickFilterPayload, setQuickFilterPayload] = useState({});
  const [advanceSearchPayload, setAdvanceSearchPayload] = useState({});

  useEffect(() => {
    setSystemFilterPayload({});
    setStudyDataPayload({});
  }, []);

  useEffect(() => {
    setPagi(Pagination);
    if (
      !isFilterSelected &&
      Object.keys(systemFilterPayload).length === 0 &&
      Object.keys(studyDataPayload).length === 0 &&
      !isAdvanceSearchSelected
    ) {
      retrieveStudyData(Pagination);
    }
  }, [Pagination, isFilterSelected, studyDataPayload, systemFilterPayload]);

  const onShowSizeChange = (current, pageSize) => {
    setLimit(pageSize);
    if (Object.keys(studyDataPayload).length > 0) {
      // applyMainFilter(
      //   { ...studyDataPayload, page_number: current, page_size: pageSize },
      //   setStudyData
      // );
    } else if (Object.keys(systemFilterPayload).length > 0) {
      // applySystemFilter(
      //   { ...systemFilterPayload, page_number: current, page_size: pageSize },
      //   setStudyData
      // );
    } else {
      setPagination((prev) => ({ ...prev, page: current, limit: pageSize }));
    }
  };

  useEffect(() => {
    changeBreadcrumbs([{ name: "Study Data" }]);
    // retrieveStudyData();
    setStudyIdArray([]);
  }, []);

  const retrieveStudyData = (pagination, values = {}) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    getAllStudyData({
      // filter: values,
      page_size: currentPagination.limit || 10,
      page_number: currentPagination.page,
      all_premission_id: JSON.parse(localStorage.getItem("all_permission_id")),
      all_assign_id: JSON.parse(localStorage.getItem("all_assign_id")),
      deleted: false,
      deleted_skip: true,
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          name: data.study.patient_name,
          institution: data.institution.name,
          patient_id: data?.study?.patient_id,
          study_id: data?.study?.id,
          key: data.id,
        }));
        setStudyData(resData);
        setTotalPages(res.data.total_object);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const quickFilterStudyData = (pagination, values = {}) => {
    setIsLoading(true);
    setQuickFilterPayload(values);
    filterStudyData({
      filter: values,
      page_size: pagination?.limit || 10,
      page_number: pagination?.page || 1,
      all_permission_id: JSON.parse(localStorage.getItem("all_permission_id")),
      all_assign_id: JSON.parse(localStorage.getItem("all_assign_id")),
      deleted_skip: true,
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          name: data.study.patient_name,
          institution: data.institution.name,
          patient_id: data?.study?.patient_id,
          study_id: data?.study?.id,
          key: data.id,
        }));
        setStudyData(resData);
        setTotalPages(res.data.total_object);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const advanceSearchFilterData = (pagination, values = {}) => {
    setIsLoading(true);
    setAdvanceSearchPayload(values);
    advanceSearchFilter({
      ...values,
      page_size: pagination?.limit || 10,
      page_number: pagination?.page || 1,
      all_premission_id: JSON.parse(localStorage.getItem("all_permission_id")),
      all_assign_id: JSON.parse(localStorage.getItem("all_assign_id")),
      // deleted_skip: true,
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          name: data.study.patient_name,
          institution: data.institution.name,
          patient_id: data?.study?.patient_id,
          study_id: data?.study?.id,
          key: data.id,
        }));
        setStudyData(resData);
        setTotalPages(res.data.total_object);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const editActionHandler = (id) => {
    setStudyID(id);
    setIsEditModalOpen(true);
  };

  const checkPermissionStatus = (name) => {
    const permission = permissionData["StudyTable view"].find(
      (data) => data.permission === name
    )?.permission_value;
    return permission;
  };

  const studyStatusHandler = async () => {
    if (studyStatus === "Viewed" || studyStatus === "Assigned") {
      await updateStudyStatusReported({ id: studyID })
        .then((res) => {})
        .catch((err) => console.log(err));
    }
  };

  const studyCloseHandler = async () => {
    await closeStudy({ id: studyID })
      .then((res) => {
        setIsReportModalOpen(false);
        setStudyID(null);
        retrieveStudyData();
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    checkPermissionStatus("View Patient id") && {
      title: "Patient's Id",
      dataIndex: "patient_id",
      className: `${
        checkPermissionStatus("View Patient id") ? "" : "column-display-none"
      }`,
    },
    checkPermissionStatus("View Patient name") && {
      title: "Patient's Name",
      dataIndex: "name",
      className: `${
        checkPermissionStatus("View Patient name") ? "" : "column-display-none"
      }`,
    },
    checkPermissionStatus("Study id") && {
      title: "Study Id",
      dataIndex: "study_id",
      className: `${
        checkPermissionStatus("Study id") ? "" : "column-display-none"
      }`,
    },
    {
      title: "Status",
      dataIndex: "status",
      // className: `${
      //   checkPermissionStatus("View Institution name")
      //     ? ""
      //     : "column-display-none"
      // }`,
      render: (text, record) => (
        <Tag
          color={
            text === "New"
              ? "success"
              : text === "Assigned"
              ? "blue"
              : text === "Viewed"
              ? "cyan"
              : text === "ViewReport"
              ? "lime"
              : text === "Reporting"
              ? "magenta"
              : text === "CloseStudy"
              ? "red"
              : "warning"
          }
          style={{ textAlign: "center", fontWeight: "600" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Modality",
      dataIndex: "modality",
      // className: `${
      //   checkPermissionStatus("View Institution name")
      //     ? ""
      //     : "column-display-none"
      // }`,
    },
    {
      title: "Date Time",
      dataIndex: "created_at",
      // className: `${
      //   checkPermissionStatus("View Institution name")
      //     ? ""
      //     : "column-display-none"
      // }`,
    },
    checkPermissionStatus("View Institution name") && {
      title: "Institution",
      dataIndex: "institution",
      className: `${
        checkPermissionStatus("View Institution name")
          ? ""
          : "column-display-none"
      }`,
    },
    checkPermissionStatus("View Study description") && {
      title: "Description",
      dataIndex: "study_description",
      className: `${
        checkPermissionStatus("View Study description")
          ? ""
          : "column-display-none"
      }`,
    },
    checkPermissionStatus("Study chat option") && {
      title: "Chat",
      dataIndex: "chat",
      className: `${
        checkPermissionStatus("Study chat option") ? "" : "column-display-none"
      }`,
      render: (text, record) => (
        <Tooltip title="Chat">
          <BsChat
            className="action-icon action-icon-primary"
            onClick={() => {
              setSeriesID(record.series_id);
              setStudyID(record.id);
              setIsDrawerOpen(true);
              setPersonName(`${record.study.patient_id} | ${record.name}`);
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: window.innerWidth < 650 ? "1%" : "10%",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          {checkPermissionStatus("Study clinical history option") && (
            <Tooltip title="Clinical History">
              <MdOutlineHistory
                className="action-icon"
                onClick={() => {
                  setStudyID(record.id);
                  setIsAssignModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {checkPermissionStatus("Study data option") && (
            <Tooltip title={"Study Report"}>
              <IoIosDocument
                className="action-icon"
                onClick={() => {
                  setStudyID(record.id);
                  setStudyStatus(record.status);
                  setIsReportModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {checkPermissionStatus("Study more details option") && (
            <Tooltip title={"More Details"}>
              <BsEyeFill
                className="action-icon"
                onClick={() => {
                  setStudyID(record.id);
                  setIsStudyModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {checkPermissionStatus("Study edit option") && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
          )}
          {checkPermissionStatus("Study share option") && (
            <Tooltip title="Share Study">
              <IoIosShareAlt
                className="action-icon action-icon-primary"
                onClick={() => {
                  setStudyID(record.id);
                  setIsShareStudyModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {checkPermissionStatus("Study logs option") && (
            <Tooltip title="Auditing">
              <AuditOutlined
                className="action-icon action-icon-primary"
                onClick={() => {
                  setStudyID(record.id);
                  setIsModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {/* <Menu
            mode="vertical"
            expandIcon={() => ""}
            className="order-menu-header"
            triggerSubMenuAction="click"
            onClick={(e) => {
              e.domEvent.stopPropagation();
            }}
          >
            <Menu.SubMenu
              title={
                <RxDropdownMenu
                  className="order-menu-icon"
                  style={{ fontSize: "24px" }}
                />
              }
              onTitleClick={(e) => e.domEvent.stopPropagation()}
            >
              <Menu.Item key="share-study">
                <Typography className="order-menu-name-secondary">
                  Share Study
                </Typography>
              </Menu.Item>

              <Menu.Item
                key="clinical-history"
                onClick={() => {
                  setStudyID(record.id);
                  setIsAssignModalOpen(true);
                }}
              >
                <Typography className="order-menu-name-primary">
                  Clinical History
                </Typography>
              </Menu.Item>
              <Menu.Item
                key="study_data"
                onClick={() => {
                  setStudyID(record.id);
                  setIsReportModalOpen(true);
                }}
              >
                <Typography className="order-menu-name-primary">
                  Study Data
                </Typography>
              </Menu.Item>
              <Menu.Item
                key="more"
                onClick={() => {
                  setStudyID(record.id);
                  setIsStudyModalOpen(true);
                }}
              >
                <Typography className="order-menu-name-primary">
                  More Details
                </Typography>
              </Menu.Item>
              <Menu.Item
                key="auditing"
                onClick={() => {
                  setStudyID(record.id);
                  setIsModalOpen(true);
                }}
              >
                <Typography className="order-menu-name-primary">
                  Auditing
                </Typography>
              </Menu.Item>
              <Menu.Item
                key="edit"
                onClick={() => {
                  setStudyID(record.id);
                  setIsEditModalOpen(true);
                }}
              >
                <Typography className="order-menu-name-primary">
                  Edit Study
                </Typography>
              </Menu.Item>
              <Menu.Item
                key="chat"
                onClick={() => {
                  setSeriesID(record.series_id);
                  setStudyID(record.id);
                  setIsDrawerOpen(true);
                  setPersonName(`${record.study.patient_id} | ${record.name}`);
                }}
              >
                <Typography className="order-menu-name-primary">
                  Chat
                </Typography>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu> */}
        </Space>
      ),
    },
  ].filter(Boolean);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setStudyIdArray((prev) => selectedRows?.map((data) => data.id));
    },
    getCheckboxProps: (record) => ({
      // Column configuration not to be checked
      id: record.id,
    }),
  };

  const handleRowClick = (record) => {
    const isRowExpanded = expandedRows.includes(record.id);

    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((key) => key !== record.id));
    } else {
      setExpandedRows([...expandedRows, record.id]);
    }
  };

  const expandableConfig = {
    expandedRowRender: (record) => (
      <p style={{ margin: 0 }}>
        <DicomViewer dicomUrl={record?.study?.study_original_id} />
        {/* {retrieveStudyInstance(record?.study?.study_original_id)} */}
      </p>
    ),
  };

  const onRow = (record) => ({
    onClick: () => handleRowClick(record),
    onDoubleClick: () => handleCellDoubleClick(record),
  });

  const handleCellDoubleClick = (record) => {
    // if (record.status === "New" || record.status === "Assigned") {
    //   updateStudyStatus({ id: record.id })
    //     .then((res) => {})
    //     .catch((err) => console.log(err));
    //   const newTableData = studyData.map((data) => {
    //     if (data.id == record.id) {
    //       return {
    //         ...data,
    //         status: "Viewed",
    //       };
    //     } else {
    //       return data;
    //     }
    //   });
    //   setStudyData(newTableData);
    // }
  };

  return (
    <>
      <Table
        dataSource={studyData}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>
              <DicomViewer dicomUrl={record?.study?.study_original_id} />
              {/* {retrieveStudyInstance(record?.study?.study_original_id)} */}
            </p>
          ),
        }}
        rowSelection={rowSelection}
        onRow={onRow}
        // onPaginationChange={retrieveStudyData}
        loading={isLoading}
        pagination={{
          current: Pagination.page,
          pageSize: limit,
          total: totalPages,
          pageSizeOptions: [10, 25, 50, 100, 200, 500],
          showSizeChanger: totalPages > 10,
          onChange: (page = 1, pageSize = limit) => {
            if (Object.keys(studyDataPayload).length > 0) {
              applyMainFilter(
                { ...studyDataPayload, page_number: page, page_size: pageSize },
                setStudyData
              );
            } else if (Object.keys(systemFilterPayload).length > 0) {
              applySystemFilter(
                {
                  ...systemFilterPayload,
                  page_number: page,
                  page_size: pageSize,
                },
                setStudyData
              );
            } else if (isFilterSelected) {
              quickFilterStudyData(
                { page, limit: pageSize },
                quickFilterPayload
              );
            } else if (isAdvanceSearchSelected) {
              advanceSearchFilterData(
                { page, limit: pageSize },
                advanceSearchPayload
              );
            }
            setPagination({ ...Pagination, page, limit: pageSize });
          },
          onShowSizeChange: onShowSizeChange,
        }}
      />
      <EditStudy
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />
      <AssignStudy
        isAssignModalOpen={isAssignModalOpen}
        setIsAssignModalOpen={setIsAssignModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />
      <StudyAudits
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />
      <StudyReports
        isReportModalOpen={isReportModalOpen}
        setIsReportModalOpen={setIsReportModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
        studyStatus={studyStatus}
        setStudyStatus={setStudyStatus}
        studyStatusHandler={studyStatusHandler}
        studyCloseHandler={studyCloseHandler}
      />
      <PatientDetails
        isStudyModalOpen={isStudyModalOpen}
        setIsStudyModalOpen={setIsStudyModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />
      <ShareStudy
        isShareStudyModalOpen={isShareStudyModalOpen}
        setIsShareStudyModalOpen={setIsShareStudyModalOpen}
        studyID={studyID}
        setStudyID={setStudyID}
      />
      <Drawer
        title={null}
        placement="right"
        closeIcon={false}
        onClose={() => {
          setStudyID(null);
          setSeriesID(null);
          setIsDrawerOpen(false);
          setMessages([]);
          setPersonName(null);
        }}
        open={isDrawerOpen}
        className="chat-drawer"
      >
        <ChatMain
          userId={studyID}
          orderId={seriesID}
          restaurantName={personName}
          messages={messages}
          setMessages={setMessages}
        />
      </Drawer>
      <QuickFilterModal
        name={"Study Quick Filter"}
        retrieveStudyData={retrieveStudyData}
        setStudyData={setStudyData}
        quickFilterStudyData={quickFilterStudyData}
      />
      <AdvancedSearchModal
        name={"Advance Search"}
        retrieveStudyData={retrieveStudyData}
        advanceSearchFilterData={advanceSearchFilterData}
      />
    </>
  );
};

export default Dicom;
