import { Button, List, Modal, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getStudyData } from "../../apis/studiesApi";
import FileReport from "./FileReport";

const StudyReports = ({
  isReportModalOpen,
  setIsReportModalOpen,
  studyID,
  setStudyID,
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileReportModalOpen, setIsFileReportModalOpen] = useState(false);

  useEffect(() => {
    if (studyID && isReportModalOpen) {
      retrieveStudyData();
    }
  }, [studyID]);

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
        ];
        setModalData(modifiedData);
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
          setIsReportModalOpen(false);
        }}
        width={1000}
        centered
        footer={[
          <Button key="back">OHIF Viewer</Button>,
          <Button key="back">Web Report</Button>,
          <Button key="submit" type="primary">
            Simplified Report
          </Button>,
          <Button key="submit" type="primary" onClick={() => setIsFileReportModalOpen(true)}>
            File Report
          </Button>,
          <Button
            key="link"
            href="https://google.com"
            type="primary"
            // loading={loading}
            // onClick={handleOk}
          >
            Advanced File Report
          </Button>,
        ]}
      >
        <Spin spinning={isLoading}>
          <div
            style={{
              background: "#e4e4e4",
              fontWeight: "600",
              padding: "10px 24px",
              borderRadius: "0px",
              margin: "0 -24px",
            }}
          >
            Patient Info
          </div>
          <List
            style={{ marginTop: "8px" }}
            grid={{
              gutter: 5,
              column: 2,
            }}
            className="queue-status-list"
            dataSource={modalData}
            renderItem={(item) => (
              <List.Item className="queue-number-list">
                <Typography
                  style={{ display: "flex", gap: "4px", fontWeight: "600" }}
                >
                  {item.name}:
                  <Typography style={{ fontWeight: "400" }}>
                    {item.value}
                  </Typography>
                </Typography>
              </List.Item>
            )}
          />
        </Spin>
      </Modal>
      <FileReport
        isFileReportModalOpen={isFileReportModalOpen}
        setIsFileReportModalOpen={setIsFileReportModalOpen}
        studyID={studyID}
        modalData={modalData}
      />
    </>
  );
};

export default StudyReports;
