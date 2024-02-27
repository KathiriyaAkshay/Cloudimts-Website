import React, { useContext, useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import BillingModal from "../../components/BillingModal";
import { Card, Divider, Table, Tag, Typography, Button, Modal, Tooltip } from "antd";
import { filterDataContext } from "../../hooks/filterDataContext";

const index = () => {
  const { changeBreadcrumbs } = useBreadcrumbs();
  const [billingData, setBillingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [charges, setCharges] = useState({
    total_midnight_charge: 0,
    total_communication_charge: 0,
    total_reporting_charge: 0,
  });

  const { setIsBillingFilterModalOpen, billingInformationModal, setBillingInformationModal, 
    totalBillingReportingCharge, totalBillingCommunicationCharge, totalBillingMidnightCharge} = useContext(filterDataContext);

  useEffect(() => setIsBillingFilterModalOpen(true), []);

  // **** Billling column **** //
  const columns = [
    {
      title: "Id",
      dataIndex: "reference_id"
    },
    {
      title: "Patient ID",
      dataIndex: "patient_id"
    },

    {
      title: "Patient Name",
      dataIndex: "patient_name", 
      ellipsis: true, 
      render: (text, record) => (
        <Tooltip title = {text}>
          {text}
        </Tooltip>
      )
    },

    {
      title: "Modality",
      dataIndex: "modality",
    },

    {
      title: "Institution",
      dataIndex: "institution",
    },

    {
      title: "Study description",
      dataIndex: "study_description",
      ellipsis: true,
    },

    {
      title: "Report description",
      dataIndex: "reporting_study_description",
    },

    {
      title: "Study Date/Time",
      dataIndex: "study_date",
    },
    {
      title: "Reporting Date/Time",
      dataIndex: "reporting_time",
    },

    {
      title: "Reported by",
      dataIndex: "reported_by",
    },


    {
      title: "Reporting type",
      dataIndex: "reporting_type",
    },

    {
      title: "Status",
      dataIndex: "study_status",
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
      title: "Charge",
      dataIndex: "reporting_charge",
      fixed: 'right', 
      render: (text, record) => (
        <div>
          {parseInt(record?.reporting_charge) + parseInt(record?.comunication_charge) + parseInt(record?.midnight_charge) }
        </div>
      )
    },
  ];

  useEffect(() => {
    changeBreadcrumbs([{ name: "Billing" }]);
  }, []);

  return (
    <div>

      {/* ===== Billing data table ======  */}

      <Table
        columns={columns}
        dataSource={billingData}
        loading={isLoading}
        className="Billing-table"
        scroll={{
          x: 1300,
          y: "calc(100vh - 310px)"
        }}
      />

      {/* ===== Search billing related modal ======  */}

      <BillingModal
        setBillingData={setBillingData}
        setIsLoading={setIsLoading}
        setCharges={setCharges}
      />

      {/* ===== Total billing information modal ====== ` */}

      <Modal
        title="Billing information"
        open={billingInformationModal}
        centered
        onOk={() => setBillingInformationModal(false)}
        onCancel={() => setBillingInformationModal(false)}
        footer={null}
      >
        <div className="billing-main-div">
          <div className="billing-sub-div">
            <Typography className="billing-header">#</Typography>
            <Typography className="billing-header">Charges</Typography>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          {/* ==== Reporting charges information ====  */}

          <div className="billing-sub-div">
            <Typography className="billing-text">Reporting Charges</Typography>
            <Typography className="billing-text">
              {totalBillingReportingCharge}
            </Typography>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          {/* ==== Communication chrges information ====  */}

          <div className="billing-sub-div">
            <Typography className="billing-text">
              Communication Charges
            </Typography>
            <Typography className="billing-text">
              {totalBillingCommunicationCharge}
            </Typography>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          {/* ==== Midnight charges information ====  */}

          <div className="billing-sub-div">
            <Typography className="billing-text">Midnight Charges</Typography>
            <Typography className="billing-text">
              {totalBillingMidnightCharge}
            </Typography>
          </div>

          <Divider style={{ margin: "12px 0" }} />

          {/* ==== Total amount charges information =====  */}

          <div className="billing-sub-div Billing-sub-total-info-div">
            <Typography className="billing-text" style={{ fontWeight: "bold" }}>Total Amount</Typography>
            <Typography className="billing-header">
              {Number(totalBillingReportingCharge) +
                Number(totalBillingCommunicationCharge) +
                Number(totalBillingMidnightCharge)}
            </Typography>
          </div>

          <Divider style={{ margin: "12px 0", borderWidth: "0" }} />

        </div>

      </Modal>
      
    </div>
  );
};

export default index;
