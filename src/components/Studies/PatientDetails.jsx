import { List, Modal, Spin, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getMoreDetails } from "../../apis/studiesApi";

const PatientDetails = ({
  isStudyModalOpen,
  setIsStudyModalOpen,
  studyID,
  setStudyID,
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (studyID && isStudyModalOpen) {
      retrieveStudyData();
    }
  }, [studyID]);

  const retrieveStudyData = () => {
    setIsLoading(true);
    getMoreDetails({ id: studyID })
      .then((res) => {
         if (res.data.status) {
        const resData = res.data.data;
        const modifiedData = [
          {
            name: "Patient's Id",
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
            name: "Previous Patient's Id",
            value: resData?.Previous_patient_id,
          },
          {
            name: "Accession Number",
            value: resData?.Accession_number,
          },
          {
            name: "Previous Patient's Name",
            value: resData?.Previous_patient_name,
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
          {
            name: "Institution Name",
            value: resData?.institution?.Institution_name,
          },
          {
            name: "Patient's comments",
            value: resData?.Patient_comments,
          },
          {
            name: "Body Part",
            value: resData?.Study_body_part,
          },
          {
            name: "Created At",
            value: resData?.Created_at,
          },
          {
            name: "Reporting Time",
            value: resData?.reporting_time,
          },
          {
            name: "Urgent Case",
            value: resData?.urgent_case,
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
         } else {
          NotificationMessage(
            'warning',
            'Network request failed',
            res.data.message
          )
        }
      })
      .catch((err) => NotificationMessage(
  'warning',
  'Network request failed',
  err.response.data.message
)
);
    setIsLoading(false);
  };
  return (
    <Modal
      title="Patient Details"
      open={isStudyModalOpen}
      onOk={() => {
        setStudyID(null);
        setIsStudyModalOpen(false);
      }}
      onCancel={() => {
        setStudyID(null);
        setIsStudyModalOpen(false);
      }}
      width={1000}
      centered
      footer = {null}
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
            {modalData.find((data) => data.name === "Urgent Case")?.value && (
              <Tag color="error">Urgent</Tag>
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
          dataSource={modalData}
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
      </Spin>
    </Modal>
  );
};

export default PatientDetails;
