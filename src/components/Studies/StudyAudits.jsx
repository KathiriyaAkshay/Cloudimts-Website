import { List, Modal, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import TableWithFilter from "../TableWithFilter";
import { getStudyData, getStudyLogsData } from "../../apis/studiesApi";

const StudyAudits = ({ isModalOpen, setIsModalOpen, studyID, setStudyID }) => {
  const [modalData, setModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    if (studyID && isModalOpen) {
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
        getStudyLogsData({ id: studyID })
          .then((res) => {
            const resData = res.data.data.map((data) => ({
              ...data,
              perform_user: data.perform_user.username,
            }));
            setAuditData(resData);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const auditColumns = [
    {
      title: "Event Type",
      dataIndex: "event_display",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Performed Type",
      dataIndex: "time",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Performed User",
      dataIndex: "perform_user",
      // sorter: (a, b) => {},
      // editable: true,
    },
    {
      title: "Target User",
      dataIndex: "target_user",
      // sorter: (a, b) => {},
      // editable: true,
    },
  ];

  return (
    <Modal
      title="Study Audit Entries"
      open={isModalOpen}
      onOk={() => {
        setStudyID(null);
        setIsModalOpen(false);
      }}
      onCancel={() => {
        setStudyID(null);
        setIsModalOpen(false);
      }}
      width={1000}
      centered
      // footer={[
      //   <Button key="back">
      //     OHIF Viewer
      //   </Button>,
      //   <Button key="back">
      //   Web Report
      // </Button>,
      //    <Button key="submit" type="primary">
      //    Simplified Report
      //  </Button>,
      //   <Button key="submit" type="primary">
      //     File Report
      //   </Button>,
      //   <Button
      //     key="link"
      //     href="https://google.com"
      //     type="primary"
      //     // loading={loading}
      //     // onClick={handleOk}
      //   >
      //     Advanced File Report
      //   </Button>,
      // ]}
    >
      {/* <Form
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      form={form}
      onFinish={handleSubmit}
      className="mt"
    >
      <Row gutter={15}>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Patient's Id"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Patient's Id",
              },
            ]}
          >
            <Input placeholder="Enter Patient's Id" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Patient's Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Patient's Name",
              },
            ]}
          >
            <Input placeholder="Enter Patient's Name" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Accession Number"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Accession Number",
              },
            ]}
          >
            <Input placeholder="Enter Accession Number" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Date of Birth"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter country",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Description"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Description",
              },
            ]}
          >
            <Input placeholder="Enter Description" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Gender"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Gender",
              },
            ]}
          >
            <Input placeholder="Enter Gender" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Referring Physician"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Referring Physician",
              },
            ]}
          >
            <Input placeholder="Enter Referring Physician" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Study Series Count"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Study Series Count",
              },
            ]}
          >
            <Input placeholder="Enter Study Series Count" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Operator Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Operator Name",
              },
            ]}
          >
            <Input placeholder="Enter Operator Name" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            name="country"
            label="Institution Name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please enter Institution Name",
              },
            ]}
          >
            <Input placeholder="Enter Institution Name" />
          </Form.Item>
        </Col>
      </Row>
    </Form> */}
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
        <TableWithFilter tableColumns={auditColumns} tableData={auditData} />
      </Spin>
    </Modal>
  );
};

export default StudyAudits;
