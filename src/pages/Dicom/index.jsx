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
  filterStudyData,
  getAllStudyData,
  getInstanceData,
  updateStudyStatus,
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
  const [pagi, setPagi] = useState({ page: 1 });
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [studyID, setStudyID] = useState(null);
  const [seriesID, setSeriesID] = useState(null);
  const [personName, setPersonName] = useState(null);
  const { permissionData } = useContext(UserPermissionContext);
  const { studyData, setStudyData } = useContext(StudyDataContext);

  useEffect(() => {
    changeBreadcrumbs([{ name: "Study Data" }]);
    retrieveStudyData();
  }, []);

  const retrieveStudyData = (pagination, values = {}) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    getAllStudyData({
      // filter: values,
      page_size: 10,
      page_number: currentPagination.page,
      all_premission_id: [1],
      all_assign_id: [],
      deleted: false,
      deleted_skip: true,
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          name: data.study.patient_name,
          institution: data.institution.name,
        }));
        setStudyData(resData);
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

  const columns = [
    {
      title: "Patient's Id",
      dataIndex: "id",
      className: `${
        checkPermissionStatus("View Patient id") ? "" : "column-display-none"
      }`,
    },
    {
      title: "Patient's Name",
      dataIndex: "name",
      className: `${
        checkPermissionStatus("View Patient name") ? "" : "column-display-none"
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
    {
      title: "Institution",
      dataIndex: "institution",
      className: `${
        checkPermissionStatus("View Institution name")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Description",
      dataIndex: "study_description",
      className: `${
        checkPermissionStatus("View Study description")
          ? ""
          : "column-display-none"
      }`,
    },
    {
      title: "Chat",
      dataIndex: "chat",
      className: `${
        checkPermissionStatus("Study chat option") ? "" : "column-display-none"
      }`,
      render: (text, record) => (
        <Tooltip title="Chat">
          <BsChat
            className="action-icon"
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
      className: `${
        checkPermissionStatus("View Institution name")
          ? ""
          : "column-display-none"
      }`,
      width: window.innerWidth < 650 ? "1%" : "10%",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          {checkPermissionStatus("Study share option") && (
            <Tooltip title="Share Study">
              <IoIosShareAlt
                className="action-icon"
                onClick={() => {
                  setStudyID(record.id);
                  setIsShareStudyModalOpen(true);
                }}
              />
            </Tooltip>
          )}
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
          {checkPermissionStatus("Study logs option") && (
            <Tooltip title="Auditing">
              <AuditOutlined
                className="action-icon"
                onClick={() => {
                  setStudyID(record.id);
                  setIsModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {checkPermissionStatus("Study edit option") && (
            <EditActionIcon
              editActionHandler={() => editActionHandler(record.id)}
            />
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

  const handleRowClick = (record) => {
    const isRowExpanded = expandedRows.includes(record.key);

    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((key) => key !== record.key));
    } else {
      setExpandedRows([...expandedRows, record.key]);
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
    console.log("hey");
    if (record.status === "New" || record.status === "Assigned") {
      updateStudyStatus({ id: record.id })
        .then((res) => {})
        .catch((err) => console.log(err));
      const newTableData = studyData.map((data) => {
        if (data.id == record.id) {
          return {
            ...data,
            status: "Viewed",
          };
        } else {
          return data;
        }
      });
      setStudyData(newTableData);
    }
  };

  return (
    <>
      <Table
        dataSource={studyData}
        columns={columns}
        expandable={expandableConfig}
        // rowSelection={rowSelection}
        onRow={onRow}
        setPagi={setPagi}
        totalRecords={totalPages}
        onPaginationChange={retrieveStudyData}
        loadingTableData={isLoading}
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
      />
    </>
  );
};

export default Dicom;
