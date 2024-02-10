import { List, Modal, Spin, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getMoreDetails } from "../../apis/studiesApi";
import NotificationMessage from "../NotificationMessage";

const PatientDetails = ({
  isStudyModalOpen,
  setIsStudyModalOpen,
  studyID,
  setStudyID,
  referenceId
}) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // **** Reterive study more details option **** // 
  const retrieveStudyData = () => {
    setIsLoading(true);
    getMoreDetails({ id: studyID })
      .then((res) => {
        if (res.data.status) {
          const resData = res.data.data;
          const modifiedData = [
            {
              name: "Patient id",
              value: resData?.Patient_id,
            },
            {
              name: "Patient Name",
              value: resData?.Patient_name,
            },
            {
              name: "Institution Name",
              value: resData?.institution?.Institution_name,
            },
            {
              name: "Assign time",
              value: resData?.study_assign_time
            },

            {
              name: "Assign Radiologist",
              value: resData?.study_assign_username
            },

            {
              name: "Reporting Time",
              value: resData?.reporting_time,
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

            {
              name: "Date of birth",
              value: resData?.DOB,
            },
            {
              name: "Study Description",
              value: resData?.Study_description,
            },

            {
              name: "Study history",
              value: resData?.Patient_comments,
            },
            {
              name: "Study date",
              value: resData?.Created_at,
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
              name: "Performing Physician Name",
              value: resData?.Performing_physician_name,
            },
            {
              name: "Series UID",
              value: resData?.Series_UID,
            },
            {
              name: "Referring Physician Name",
              value: resData?.Referring_physician_name,
            },
          ];
          setModalData(modifiedData);
        } else {
          NotificationMessage(
            'warning',
            'Study more details',
            res.data.message
          )
        }
      })
      .catch((err) => NotificationMessage(
        'warning',
        'Study more details',
        err.response.data.message
      )
      );
    setIsLoading(false);
  };

  useEffect(() => {
    if (studyID && isStudyModalOpen) {
      retrieveStudyData();
    }
  }, [studyID]);

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
      footer={null}
      className="study-more-details"
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
          <div>Patient Info | Reference id : {referenceId}</div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
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
                style={{ display: "flex", gap: "4px", fontWeight: "600", flexWrap: "wrap", color : "#000000" }}
              >
                {item.name}:
                {item.name === "Patient id" ||
                  item.name === "Patient Name" ||
                  item.name === "Study UID" ||
                  item.name === "Institution Name" ||
                  item.name === "Series UID" ||
                  item.name === "Assign study time" ||
                  item.name === "Assign study username" ? (
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
