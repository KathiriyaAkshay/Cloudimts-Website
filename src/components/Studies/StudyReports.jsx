import {
  Button,
  List,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { getStudyData } from "../../apis/studiesApi";
import FileReport from "./FileReport";
import TableWithFilter from "../TableWithFilter";
import { BsEyeFill } from "react-icons/bs";
import {
  DownloadOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import DeleteActionIcon from "../DeleteActionIcon";
import ImageCarousel from "./ImageCarousel";
import { useNavigate } from "react-router-dom";
import { UserPermissionContext } from "../../hooks/userPermissionContext";

const StudyReports = ({
  isReportModalOpen,
  setIsReportModalOpen,
  studyID,
  setStudyID,
  studyStatus,
  setStudyStatus,
  studyStatusHandler,
  studyCloseHandler,
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileReportModalOpen, setIsFileReportModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [studyImages, setStudyImages] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { permissionData } = useContext(UserPermissionContext);

  useEffect(() => {
    if (studyID && isReportModalOpen) {
      retrieveStudyData();
    }
  }, [studyID]);

  const checkPermissionStatus = (name) => {
    const permission = permissionData["Studies permission"].find(
      (data) => data.permission === name
    )?.permission_value;
    return permission;
  };

  const columns = [
    {
      title: "Report Type",
      dataIndex: "report_type",
    },
    {
      title: "Report Time",
      dataIndex: "reporting_time",
    },
    {
      title: "Report By",
      dataIndex: "report_by",
      render: (text, record) => record?.report_by?.username,
    },
    {
      title: "Study Description",
      dataIndex: "study_description",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: window.innerWidth < 650 ? "1%" : "20%",
      render: (text, record) => (
        <Space style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Tooltip title={"View"}>
            <BsEyeFill
              className="action-icon"
              onClick={() => {
                record.report_type === "Advanced report" &&
                  navigate(`/reports/${record.id}/view`);
              }}
            />
          </Tooltip>
          <Tooltip title={"Download"}>
            <DownloadOutlined className="action-icon" />
          </Tooltip>
          <Tooltip title={"Email"}>
            <MailOutlined className="action-icon" />
          </Tooltip>
          <Tooltip title={"Whatsapp"}>
            <WhatsAppOutlined className="action-icon" />
          </Tooltip>
          <DeleteActionIcon />
        </Space>
      ),
    },
  ];

  const retrieveStudyData = () => {
    setIsLoading(true);
    getStudyData({ id: studyID })
      .then((res) => {
        const resData = res.data.data;
        const modifiedData = [
          {
            name: "Patient's id",
            value: resData?.Patient_id,
          },
          {
            name: "Referring Physician Name",
            value: resData?.Referring_physician_name,
          },
          {
            name: "Patient's Name",
            value: resData?.Patient_name,
          },
          {
            name: "Performing Physician Name",
            value: resData?.Performing_physician_name,
          },
          {
            name: "Accession Number",
            value: resData?.Accession_number,
          },
          {
            name: "Modality",
            value: resData?.Modality,
          },
          {
            name: "Gender",
            value: resData?.Gender,
          },
          // {
          //   name: "Count",
          //   value: "",
          // },
          {
            name: "Date of birth",
            value: resData?.DOB,
          },
          {
            name: "Study Description",
            value: resData?.Study_description,
          },
          // {
          //   name: "Age Group",
          //   value: "",
          // },
          {
            name: "Patient's comments",
            value: resData?.Patient_comments,
          },
          {
            name: "Body Part",
            value: resData?.Study_body_part,
          },
          {
            name: "Study UID",
            value: resData?.Study_UID,
          },
          {
            name: "Series UID",
            value: resData?.Series_UID,
          },
          {
            name: "urgent_case",
            value: resData?.assigned_study_data,
          },
        ];
        setModalData(modifiedData);
        setTableData(res?.data?.report);
        setStudyImages(
          res?.data?.data?.assigned_study_data?.study_data?.images
        );
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        title="Study Reports"
        open={isReportModalOpen}
        onOk={() => {
          setStudyID(null);
          setIsReportModalOpen(false);
        }}
        onCancel={() => {
          setStudyID(null);
          setStudyStatus("");
          setIsReportModalOpen(false);
        }}
        width={1000}
        centered
        footer={[
          checkPermissionStatus("Close study") && (
            <Button
              key="back"
              className="error-btn"
              onClick={studyCloseHandler}
            >
              Close Study
            </Button>
          ),
          <Button key="back">OHIF Viewer</Button>,
          <Button key="back">Web Report</Button>,
          checkPermissionStatus("Report study") && (
            <Button
              key="submit"
              type="primary"
              className="secondary-btn"
              onClick={async () => {
                await studyStatusHandler();
                setIsFileReportModalOpen(true);
              }}
            >
              Simplified Report
            </Button>
          ),
          checkPermissionStatus("Report study") && (
            <Button
              key="link"
              type="primary"
              onClick={async () => {
                await studyStatusHandler();
                navigate(`/reports/${studyID}`);
              }}
            >
              Advanced File Report
            </Button>
          ),
        ].filter(Boolean)}
      >
        <Spin spinning={isLoading}>
          <div
            style={{
              background: "#ebf7fd",
              fontWeight: "600",
              padding: "10px 24px",
              borderRadius: "0px",
              margin: "0 -24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>Patient Info</div>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              {modalData.find((data) => data.name === "urgent_case")?.value
                ?.urgent_case && <Tag color="error">Urgent</Tag>}
              {studyImages.length > 0 && (
                <Button type="primary" onClick={() => setShow(true)}>
                  Study Images
                </Button>
              )}
            </div>
          </div>
          <List
            style={{ marginTop: "8px" }}
            grid={{
              gutter: 5,
              column: 2,
            }}
            className="queue-status-list"
            dataSource={modalData?.filter(
              (data) => data.name !== "urgent_case"
            )}
            renderItem={(item) => (
              <List.Item className="queue-number-list">
                <Typography
                  style={{ display: "flex", gap: "4px", fontWeight: "600" }}
                >
                  {item.name}:
                  {item.name === "Patient's id" ||
                  item.name === "Patient's Name" ||
                  item.name === "Study UID" ||
                  item.name === "Institution Name" ||
                  item.name === "Series UID" ? (
                    <Tag color="#87d068">{item.value}</Tag>
                  ) : (
                    <Typography style={{ fontWeight: "400" }}>
                      {item.value}
                    </Typography>
                  )}
                </Typography>
              </List.Item>
            )}
          />
          {tableData?.length > 0 && (
            <TableWithFilter tableColumns={columns} tableData={tableData} />
          )}
        </Spin>
      </Modal>
      <FileReport
        isFileReportModalOpen={isFileReportModalOpen}
        setIsFileReportModalOpen={setIsFileReportModalOpen}
        studyID={studyID}
        modalData={modalData}
      />
      <ImageCarousel studyImages={studyImages} show={show} setShow={setShow} />
    </>
  );
};

export default StudyReports;
