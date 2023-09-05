import React, { useEffect, useState } from "react";
import {
  Drawer,
  Menu,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { RxDropdownMenu } from "react-icons/rx";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import ChatMain from "../../components/Chat/ChatMain";
import DicomViewer from "../../components/DicomViewer";
import EditStudy from "../../components/Studies/EditStudy";
import PatientDetails from "../../components/Studies/PatientDetails";
import StudyAudits from "../../components/Studies/StudyAudits";
import StudyReports from "../../components/Studies/StudyReports";
import { getAllStudyData } from "../../apis/studiesApi";
import AssignStudy from "../../components/Studies/AssignStudy";

const Dicom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { changeBreadcrumbs } = useBreadcrumbs();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [pagi, setPagi] = useState({ page: 1 });
  const [totalPages, setTotalPages] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studyID, setStudyID] = useState(null);
  const [seriesID, setSeriesID] = useState(null);
  const [personName, setPersonName] = useState(null);

  useEffect(() => {
    changeBreadcrumbs([{ name: "Study Data" }]);
    retrieveStudyData();
  }, []);

  const retrieveStudyData = (pagination) => {
    setIsLoading(true);
    const currentPagination = pagination || pagi;
    getAllStudyData({
      page_size: 10,
      page_number: currentPagination.page,
      all_premission_id: [1],
      all_assign_id: [],
    })
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          ...data,
          name: data.study.patient_name,
          institution: data.institution.name,
        }));
        setTableData(resData);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const columns = [
    {
      title: "Patient's Id",
      dataIndex: "id",
    },
    {
      title: "Patient's Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
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
    },
    {
      title: "Date Time",
      dataIndex: "created_at",
    },
    {
      title: "Institution",
      dataIndex: "institution",
    },
    {
      title: "Description",
      dataIndex: "study_description",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: window.innerWidth < 650 ? "1%" : "10%",
      render: (_, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Menu
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
          </Menu>
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
        <DicomViewer dicomUrl={record.images} />
      </p>
    ),
    rowExpandable: (record) => record.name !== "Not Expandable",
  };

  const onRow = (record) => ({
    onClick: () => handleRowClick(record),
  });

  return (
    <>
      <Table
        dataSource={tableData}
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
    </>
  );
};

export default Dicom;
