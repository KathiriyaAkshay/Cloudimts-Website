import React, { useContext, useEffect, useState, useRef } from "react";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import BillingModal from "../../components/BillingModal";
import { Card, Divider, Table, Tag, Typography, Button, Modal, Tooltip, Form, Input } from "antd";
import { filterDataContext } from "../../hooks/filterDataContext";
import { BillingDataContext } from "../../hooks/billingDataContext";
import { DeleteOutlined } from "@ant-design/icons";


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

  const { setIsBillingFilterModalOpen, billingInformationModal, setBillingInformationModal,
    totalBillingReportingCharge, totalBillingCommunicationCharge, totalBillingMidnightCharge } = useContext(filterDataContext);
  const { billingFilterData, setBillingFilterData, selectedData, setSelectedData } =
    useContext(BillingDataContext)
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);


  useEffect(() => setIsBillingFilterModalOpen(true), []);

  // **** Billling column **** //
  const defaultColumns = [
    {
      title: "id",
      dataIndex: "id",
      editable: true,
      sorter: (a, b) => a.id - b.id,

    },
    {
      title: "reference Id",
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
            sorter: (a, b) => a.study_description.localeCompare( b.study_description),

    },

    {
      title: "Report description",
      dataIndex: "reporting_study_description",
      editable: true,
      sorter: (a, b) => a.reporting_study_description.localeCompare(b.reporting_study_description),

    },

    {
      title: "Study Date/Time",
      dataIndex: "study_date",
      editable: true,
      sorter: (a, b) => a.study_date.localeCompare(b.study_date),

    },
    {
      title: "Reporting Date/Time",
      dataIndex: "reporting_time",
      editable: true,
      sorter: (a, b) => a.reporting_time.localeCompare(b.reporting_time),
    },

    {
      title: "Reported by",
      dataIndex: "reported_by",
      editable: true,
      sorter: (a, b) => a.reported_by.localeCompare(b.reported_by),
    },


    {
      title: "Reporting type",
      dataIndex: "reporting_type",
      editable: true,
      sorter: (a, b) => a.reporting_type.localeCompare(b.reporting_type),
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
      title: "Charge",
      dataIndex: "reporting_charge",
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

  //handling deletion of data starts

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

  const deleteBillsData = () => {

    let filteredArray = [];

    // Iterate over the objects array
    billingData.forEach(obj => {
      // Check if the object's ID is not in the idsToRemove array
      if (!selectedData.includes(obj.id)) {
        // If not present, add the object to the filtered array
        filteredArray.push(obj);
      }
    });
    setBillingData(filteredArray);
    setBillingFilterData(filteredArray);

  }

  //handling deletion of data ends




  // edit rows logic starts


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

  //edit rows logic ends


//filter and sorting logic starts




  return (
    <div style={{ position: "relative" }}>

      {/* ===== Billing data table ======  */}
      <Button
        // type='primary'
        className='btn-icon-div position-absolute top-0'
        onClick={() => deleteBillsData()}
        style={{ position: "absolute", top: "-3rem" }}
        disabled={isDeleteDisabled}
      >
        <DeleteOutlined />Delete Bills
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
