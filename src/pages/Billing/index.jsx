import React, { useContext, useEffect, useState, useRef } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import BillingModal from "../../components/BillingModal";
import { Card, Divider, Table, Tag, Typography, Button, Modal, Tooltip, Form, Input, Row, Col, DatePicker, Select } from "antd";
import { filterDataContext } from "../../hooks/filterDataContext";
import { BillingDataContext } from "../../hooks/billingDataContext";
import { DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import moment from 'moment'

const EditableContext = React.createContext(null);


const index = () => {
  const { changeBreadcrumbs } = useBreadcrumbs();
  const [billingData, setBillingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [charges, setCharges] = useState({
    total_midnight_charge: 0,
    total_communication_charge: 0,
    total_reporting_charge: 0,
  });
  const [form] = Form.useForm();
  const { setIsBillingFilterModalOpen, billingInformationModal, setBillingInformationModal,
    totalBillingReportingCharge, totalBillingCommunicationCharge, totalBillingMidnightCharge } = useContext(filterDataContext);
  const { billingFilterData, setBillingFilterData, selectedData, setSelectedData } =
    useContext(BillingDataContext)
  const [filterModal, setIsFilterModalOpen] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment()); // Initialize with current date

  const handleDateChange = (date, dateString) => {
    setSelectedDate(date);
    x
  };

  useEffect(() => setIsBillingFilterModalOpen(true), []);

  // **** Billling column **** //
  const defaultColumns = [
    {
      title: "Reference Id",
      dataIndex: "reference_id",
      editable: true,
      sorter: (a, b) => a.reference_id - b.reference_id,
    },
    {
      title: "Patient ID",
      dataIndex: "patient_id",
      editable: true,
      sorter: (a, b) => a.patient_id - b.patient_id,

    },

    {
      title: "Patient Name",
      dataIndex: "patient_name",
      ellipsis: true,
      editable: true,
      sorter: (a, b) => a.patient_name.localeCompare(b.patient_name),
      render: (text, record) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      )
    },

    {
      title: "Modality",
      dataIndex: "modality",
      editable: true,
      sorter: (a, b) => a.modality.localeCompare(b.modality),

    },

    {
      title: "Institution",
      dataIndex: "institution",
      editable: true,
      sorter: (a, b) => a.institution.localeCompare(b.institution),

    },

    {
      title: "Study description",
      dataIndex: "study_description",
      ellipsis: true,
      editable: true,
      sorter: (a, b) => {
        if (a.study_description === null && b.study_description === null) {
          return 0;
        } else if (a.study_description === null) {
          return -1;
        } else if (b.study_description === null) {
          return 1;
        } else {
          return a.study_description.localeCompare(b.study_description);
        }
      },
    },

    {
      title: "Patient comments",
      dataIndex: "study_history",
      ellipsis: true,
      editable: true,
      sorter: (a, b) => {
        if (a.study_history === null && b.study_history === null) {
          return 0;
        } else if (a.study_history === null) {
          return -1;
        } else if (b.study_history === null) {
          return 1;
        } else {
          return a.study_history.localeCompare(b.study_history);
        }
      },
    },

    {
      title: "Report description",
      dataIndex: "reporting_study_description",
      editable: true,
      sorter: (a, b) => {
        if (a.reporting_study_description === null && b.reporting_study_description === null) {
          return 0;
        } else if (a.reporting_study_description === null) {
          return -1;
        } else if (b.reporting_study_description === null) {
          return 1;
        } else {
          return a.reporting_study_description.localeCompare(b.reporting_study_description);
        }
      },

    },

    {
      title: "Study Date/Time",
      dataIndex: "study_date",
      width: 150, 
      editable: true,
      sorter: (a, b) => a.study_date.localeCompare(b.study_date),
      ellipsis: true,
      render: (study_date, record) => (
        <Tooltip title={study_date}>
          {study_date}
        </Tooltip>
      )

    },
    {
      title: "Reporting Date/Time",
      dataIndex: "reporting_time",
      editable: true,
      sorter: (a, b) => {
        if (a.reporting_time === null && b.reporting_time === null) {
          return 0;
        } else if (a.reporting_time === null) {
          return -1;
        } else if (b.reporting_time === null) {
          return 1;
        } else {
          return a.reporting_time.localeCompare(b.reporting_time);
        }
      },
    },

    {
      title: "Reported by",
      dataIndex: "reported_by",
      editable: true,
      sorter: (a, b) => {
        if (a.reported_by === null && b.reported_by === null) {
          return 0;
        } else if (a.reported_by === null) {
          return -1;
        } else if (b.reported_by === null) {
          return 1;
        } else {
          return a.reported_by.localeCompare(b.reported_by);
        }
      },
    },
    {
      title: "Status",
      dataIndex: "study_status",
      editable: true,
      sorter: (a, b) => a.study_status.localeCompare(b.study_status),
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
      title: "Char..",
      dataIndex: "reporting_charge",
      width: 80, 
      fixed: 'right',
      editable: true,
      render: (text, record) => (
        <div>
          {parseInt(record?.reporting_charge) + parseInt(record?.comunication_charge) + parseInt(record?.midnight_charge)}
        </div>
      )
    },
  ];

  useEffect(() => {
    changeBreadcrumbs([{ name: "Billing" }]);
  }, []);

  // handling deletion of data starts
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedData(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedData,
    onChange: onSelectChange,
  };

  useEffect(() => {
    setIsDeleteDisabled(selectedData.length > 0 ? false : true)
  }, [selectedData])


  // Delete data handle
  const deleteBillsData = () => {
    let filteredArray = [];

    // Iterate over the objects array
    billingData.forEach(obj => {
      if (!selectedData.includes(obj.id)) {
        filteredArray.push(obj);
      }
    });
    setBillingData(filteredArray);
    setBillingFilterData(filteredArray);
  }

  // Row value edit logic
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  // Edit cell value
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  // Save option handler
  const handleSave = (row) => {
    const newData = [...billingData];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setBillingData(newData);
    setBillingFilterData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  // Filter and Sorting option logic 
  const showModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleOk = () => {
    setIsFilterModalOpen(false);
  };

  const handleCancel = () => {
    setIsFilterModalOpen(false);
  };

  const onFinish = (values) => {
    var filter = {};
    for (let key in values) {
      if (values[key] != undefined && values[key] != "") {

        if (key == "study_date") {
          filter[key] = moment(selectedDate).format("YYYY-MM-DD")
        } else {
          filter[key] = values[key];
        }
      }
    }

    const filteredData = billingFilterData.filter(item => {
      for (let key in filter) {
        if (!item[key].includes(filter[key])) {
          return false;
        }
      }
      return true;
    });
    setBillingData(filteredData);
    setIsFilterModalOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>

      {/* ===== Billing data table ======  */}
      <Button
        // type='primary'
        className='btn-icon-div position-absolute top-0 delete-record-option-button'
        onClick={() => deleteBillsData()}
        style={{ position: "absolute", top: "-3rem" }}
        disabled={isDeleteDisabled}
      >
        <DeleteOutlined />Records
      </Button>
      <Button
        // type='primary'
        className='btn-icon-div position-absolute top-0'
        onClick={() => showModal()}
        style={{ position: "absolute", top: "-3rem", left: "8rem" }}
      >
        <FilterOutlined />Filters
      </Button>


      <Table
        rowSelection={rowSelection}
        rowClassName={() => 'editable-row'}
        columns={columns}
        components={components}

        dataSource={billingData}
        loading={isLoading}
        rowKey={(record) => record.id}
        className="Billing-table"
        scroll={{
          x: 1300,
          y: "calc(100vh - 280px)"
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

      {/* ==== Billing Filter =====   */}
      <Modal title="Billing Filter" open={filterModal} onOk={handleOk} onCancel={handleCancel} footer={[]} width={"60%"}>
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            marginTop: "15px"
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row justify="space-evenly">
            <Col span={11}>
              <Form.Item
                label="Patient Id"
                name="patient_id"
                rules={[

                ]}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label="Patient Name"
                name="patient_name"
                rules={[
                ]}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
              >
                <Input />
              </Form.Item>

            </Col>
          </Row>

          <Row justify="space-evenly">
            <Col span={11}>
              <Form.Item
                label="Modality"
                name="modality"
                rules={[

                ]}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label="institution"
                name="institution"
                rules={[
                ]}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
              >
                <Input />
              </Form.Item>

            </Col>
          </Row>

          <Row justify="space-evenly">
            <Col span={11}>
              <Form.Item
                label="Status"
                name="study_status"
                rules={[

                ]}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
              >
                <Select
                  options={[
                    {
                      value: 'New',
                      label: 'New',
                    },
                    {
                      value: 'Deleted',
                      label: 'Deleted',
                    },
                    {
                      value: 'Assigned',
                      label: 'Assigned',
                    }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label="Study date"
                name="study_date"
                rules={[
                ]}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
              >
                <DatePicker onChange={handleDateChange} value={selectedDate} />
              </Form.Item>

            </Col>
          </Row>

          <Row justify="space-evenly">
            <Col span={11}>
              <Form.Item
                label="Reference Id"
                name="reference_id"
                rules={[

                ]}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={11}>

            </Col>
          </Row>

          <Row align="end">

            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>

            <Col style={{marginLeft: "15px"}}>
              <Form.Item>
                <Button onClick={() => { setBillingData(billingFilterData); setIsFilterModalOpen(false);  form.resetFields(); }}>
                  Clear All
                </Button>
              </Form.Item>
            </Col>

          </Row>

        </Form>
      </Modal>

    </div>
  );
};

export default index;
