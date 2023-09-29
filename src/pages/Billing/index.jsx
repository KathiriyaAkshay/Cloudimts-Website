import React, { useContext, useEffect, useState } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import BillingModal from "../../components/BillingModal";
import TableWithFilter from "../../components/TableWithFilter";
import { Card, Divider, Table, Tag, Typography } from "antd";
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
  const { isBillingFilterModalOpen, setIsBillingFilterModalOpen } =
    useContext(filterDataContext);

  useEffect(() => setIsBillingFilterModalOpen(true), []);

  const columns = [
    {
      title: "Patient ID",
      dataIndex: "patient_id",
    },
    {
      title: "Patient Name",
      dataIndex: "patient_name",
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
      title: "Reporting Time",
      dataIndex: "reporting_time",
    },
    {
      title: "Study Description",
      dataIndex: "study_description",
    },
    {
      title: "Study History",
      dataIndex: "study_history",
    },
    {
      title: "Study Date",
      dataIndex: "study_date",
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
      title: "Reporting Charge",
      dataIndex: "reporting_charge",
    },
    {
      title: "Communication Charge",
      dataIndex: "comunication_charge",
    },
    {
      title: "Midnight Charge",
      dataIndex: "midnight_charge",
    },
  ];

  useEffect(() => {
    changeBreadcrumbs([{ name: "Billing" }]);
  }, []);

  return (
    <div>
      <Card>
        <Table columns={columns} dataSource={billingData} loading={isLoading} />
        {billingData.length > 0 && (
          <div className="billing-main-div">
            <div className="billing-sub-div">
              <Typography className="billing-header">#</Typography>
              <Typography className="billing-header">Charges</Typography>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="billing-sub-div">
              <Typography className="billing-text">
                Reporting Charges
              </Typography>
              <Typography className="billing-text">
                {charges.total_reporting_charge}
              </Typography>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="billing-sub-div">
              <Typography className="billing-text">
                Communication Charges
              </Typography>
              <Typography className="billing-text">
                {charges.total_communication_charge}
              </Typography>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="billing-sub-div">
              <Typography className="billing-text">Midnight Charges</Typography>
              <Typography className="billing-text">
                {charges.total_midnight_charge}
              </Typography>
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="billing-sub-div">
              <Typography className="billing-text">Total Amount</Typography>
              <Typography className="billing-header">
                {Number(charges.total_communication_charge) +
                  Number(charges.total_midnight_charge) +
                  Number(charges.total_reporting_charge)}
              </Typography>
            </div>
            <Divider style={{ margin: "12px 0" }} />
          </div>
        )}
      </Card>
      <BillingModal
        setBillingData={setBillingData}
        setIsLoading={setIsLoading}
        setCharges={setCharges}
      />
    </div>
  );
};

export default index;
