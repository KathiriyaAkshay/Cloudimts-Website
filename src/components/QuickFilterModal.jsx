import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useContext, useEffect } from "react";
import { filterDataContext } from "../hooks/filterDataContext";
import { FilterSelectedContext } from "../hooks/filterSelectedContext";
import NotificationMessage from "./NotificationMessage";
import { useState } from "react";
import API from "../apis/getApi";

const QuickFilterModal = ({ name, retrieveStudyData, quickFilterStudyData }) => {

  const { isStudyFilterModalOpen, setIsStudyFilterModalOpen } = useContext(filterDataContext);
  const { setIsFilterSelected, setIsAdvanceSearchSelected, isFilterSelected } = useContext(FilterSelectedContext);

  const [form] = Form.useForm();

  const [institutionOptions, setInstitutionOptions] = useState([])

  const retrieveInstitutionData = async () => {
    const token = localStorage.getItem('token');
    await API.get('/user/v1/fetch-institution-list', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.status) {
          const resData = res.data.data.map(item => ({
            // ...item,
            label: item.name,
            value: item.name
          }))
          setInstitutionOptions(resData)
        } else {
          NotificationMessage(
            'warning',
            'Quick Filter',
            res.data.message
          )
        }
      })
      .catch(err =>
        NotificationMessage(
          'warning',
          'Quick Filter',
          err.response.data.message
        )
      )
  }

  useEffect(() => {
    if (isStudyFilterModalOpen) {
      retrieveInstitutionData();
    }
  }, [isStudyFilterModalOpen]);

  const handleSubmit = (values) => {
    quickFilterStudyData({ page: 1 }, values);
    setIsStudyFilterModalOpen(false);
    setIsFilterSelected(true);
    setIsAdvanceSearchSelected(false);
  };

  return (
    <Modal
      centered
      width={"50%"}
      title={name}
      open={isStudyFilterModalOpen}
      onOk={() => form.submit()}
      className="Quick-filter-modal"
      onCancel={() => {
        setIsStudyFilterModalOpen(false);
      }}
      footer={[

        // ==== Cancel option ==== 

        <Button
          key="back"
          onClick={() => {
            setIsStudyFilterModalOpen(false);
          }}
        >
          Cancel
        </Button>,

        // ==== Clear filter option 

        <Button key="submit"
          type="primary"
          onClick={() => {
            form.resetFields();
            setIsStudyFilterModalOpen(false);
            retrieveStudyData();
            setIsFilterSelected(false);
          }}
        >
          Clear Filter
        </Button>,

        // ==== Apply filter option 

        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Apply
        </Button>,
      ]}
    >
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        form={form}
        onFinish={handleSubmit}
        autoComplete={"off"}
      >
        <Row gutter={15}>

          {/* ===== Patient id =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name="study__patient_id__icontains"
              label="Patient Id"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Patient Id",
                },
              ]}
            >
              <Input placeholder="Enter Patient Id" />
            </Form.Item>
          </Col>

          {/* ===== Patient Name =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name="study__patient_name__icontains"
              label="Patient Name"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Patient Name",
                },
              ]}
            >
              <Input placeholder="Enter Patient Name" />
            </Form.Item>
          </Col>


          {/* ==== Modality =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name="modality__icontains"
              label="Modality"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Modality",
                },
              ]}
            >
              <Input placeholder="Enter Modality" />
            </Form.Item>
          </Col>

          {/* ===== Status =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                {
                  required: false,
                  whitespace: true,
                  message: "Please enter Status",
                },
              ]}
            >
              <Input placeholder="Enter Status" />
            </Form.Item>
          </Col>

          {/* ===== Institution name ======  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name="institution__name"
              label="Institution Name"
              rules={[
                {
                  required: false,
                  message: "Please enter Institution Name",
                },
              ]}
            >
              <Select
                placeholder='Select Institution'
                options={institutionOptions}
              />
            </Form.Item>
          </Col>

          {/* ===== Study date option =====  */}

          <Col xs={24} lg={12}>
            <Form.Item
              name="created_at__startswith"
              label="Study date"
              rules={[
                {
                  required: false,
                  message: "Please enter date",
                },
              ]}
            >
              <DatePicker format={"DD-MM-YYYY"} />
            </Form.Item>
          </Col>

        </Row>

      </Form>

    </Modal>
  );
};

export default QuickFilterModal;
