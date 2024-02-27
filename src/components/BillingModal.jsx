import { Col, DatePicker, Form, Modal, Row, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  getBillingData,
  getInstitutionList,
  getRadiologistList,
} from "../apis/studiesApi";
import { filterDataContext } from "../hooks/filterDataContext";
import { BillingDataContext } from "../hooks/billingDataContext";
import NotificationMessage from "./NotificationMessage";

const BillingModal = ({ setBillingData, setIsLoading, setCharges }) => {
  
  const { isBillingFilterModalOpen, setIsBillingFilterModalOpen,  setTotalBillingReportingCharge, 
    setTotalCommunicationCharge, setTotalMidnightCharge, setBillingDataLength} =useContext(filterDataContext);

  const {setBillingFilterData } = useContext(BillingDataContext);
  
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [radiologistOptions, setRadiologistOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([
    {
      label: "All",
      value: "all",
    },
    {
      label: "New",
      value: "New",
    },
    {
      label: "Viewed",
      value: "Viewed",
    },
    {
      label: "Assigned",
      value: "Assigned",
    },
    {
      label: "InReporting",
      value: "InReporting",
    },
    {
      label: "Reported",
      value: "Reported",
    },
    {
      label: "ViewReport",
      value: "ViewReport",
    },
    {
      label: "ClosedStudy",
      value: "ClosedStudy",
    },
  ]);

  // **** Reterive institution list **** // 
  const retrieveInstitutionData = () => {
    getInstitutionList()
      .then((res) => {
         if (res.data.status) {
        const resData = res.data.data.map((data) => ({
          value: data.id,
          label: data.name,
        }));
        setInstitutionOptions([{value: "All", label: "All"},  ...resData]);
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
  };

  // **** Retervice radiologist list **** // 
  const retrieveRadiologistData = () => {
    getRadiologistList({ role_id: localStorage.getItem("role_id") })
      .then((res) => {
         if (res.data.status) {
        const resData = res.data.data.map((data) => ({
          label: data.name,
          value: data.id,
        }));
        setRadiologistOptions([{label: "All", value: "All"}, ...resData]);
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
  };
  
  useEffect(() => {
    if (isBillingFilterModalOpen){
      retrieveInstitutionData();
      retrieveRadiologistData();
    }
  }, [isBillingFilterModalOpen]);


  // **** Handle institution select change **** // 
  const handleInstitutionSelectChange = (value) => {
    if (value.includes("all")) {
      form.setFieldsValue({ institution_list: ["all"] });
    } else {
      form.setFieldsValue({
        institution_list: value.filter((val) => val !== "all"),
      });
    }
  };

  // **** Handle user select change **** // 
  const handleUserSelectChange = (value) => {
    if (value.includes("all")) {
      form.setFieldsValue({ user: ["all"] });
    } else {
      form.setFieldsValue({ user: value.filter((val) => val !== "all") });
    }
  };

  const [form] = Form.useForm();

  // Submit option handler 
  const submitHandler = (values) => {
    if (values?.from_date === undefined){

      NotificationMessage(
        "warning", 
        "Please, Select billing start date"
      )
    
    } else if (values?.to_date === undefined){

      NotificationMessage(
        "warning", 
        "Please, Select billing end date"
      )
    
    } else {

      let select_institution_all_option = null ; 
      let select_institution_list = null ; 
      let select_user_all_option = null ; 
      let select_user_list = null ; 
      let select_status_all_option = null ; 
      let select_status_value = null ; 

      // Handle institution option selection
      if (values?.institution_list == undefined){
        select_institution_all_option = true ; 
        select_institution_list = [] ; 
      } else {  
        select_institution_list = values?.institution_list

        if (select_institution_list.includes("All")){
          select_institution_all_option = true ; 
          select_institution_list = select_institution_list.filter(item => item !== "All")

        }
      }

      // Handler user option selection 
      if (values?.user == undefined){
        select_user_all_option = true; 
        select_user_list = [] ; 
      } else {
        select_user_list = values?.user ; 

        if (select_user_list?.includes("All")){
          select_user_all_option = true; 
          select_user_list = select_user_list.filter(item => item!== "All")
        }
      }

      // Handle Study status value 
    
      if (values?.study_status == undefined){
        select_status_all_option = true;  
        select_status_value = "Reported" ; 
      } else{

        if (values?.study_status == "all"){
          select_status_all_option = true ; 
          select_status_value = values?.study_status
        }
      }
      setIsLoading(true);
  
      // Set Userinput selection in localStorage 

      let FilterValues = {
        'fromdate': values?.from_date?.format("YYYY-MM-DD"), 
        "todate": values?.to_date?.format("YYYY-MM-DD"), 
        "institution": values?.institution_list   
      }; 
  
      localStorage.setItem("BillingFilterValues", JSON.stringify(FilterValues)) ; 
  
      const modifiedObj = {
        ...values,
        from_date: values?.from_date?.format("YYYY-MM-DD"),
        to_date: values?.to_date?.format("YYYY-MM-DD"),
        institution_list: select_institution_list,
        institution_all_option: select_institution_all_option,
        user: select_user_list,
        user_all_option: select_institution_all_option,
        page_number: 1,
        page_size: 10,
        study_status: select_status_value,
        study_status_all_option: select_status_all_option,
      };
      
      getBillingData(modifiedObj)
        .then((res) => {
            if (res.data.status) {
          setBillingData(res.data.data);
          setBillingFilterData(res.data.data);
          setTotalBillingReportingCharge(res?.data?.total_reporting_charge) ; 
          setTotalCommunicationCharge(res?.data?.total_communication_charge) ; 
          setTotalMidnightCharge(res?.data?.total_midnight_charge) ; 
          setIsBillingFilterModalOpen(false);
          } else {
            NotificationMessage(
              'warning',
              'Network request failed',
              res.data.message
            )
          }
        })
        .catch((err) =>  NotificationMessage('warning', 'Network request failed', err.response.data.message));
      setIsLoading(false);

    }

  };

  return (
    <div>
      <Modal
        title="Search Billing"
        centered
        open={isBillingFilterModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsBillingFilterModalOpen(false)}
        className="Billing-search-modal"
      >
        <Form
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
          onFinish={submitHandler}
          autoComplete={"off"}
        >
          <Row gutter={15}>
            
            {/* ===== Institution selection option =====  */}

            <Col xs={24} lg={12}>
              <Form.Item
                name="institution_list"
                label="Institution Name"
              >
                <Select
                  placeholder="Select Institution"
                  options={institutionOptions}
                  onChange={handleInstitutionSelectChange}
                  mode="multiple"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  showSearch
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>

            {/* ==== Radioligist selection option ====  */}

            <Col xs={24} lg={12}>
              <Form.Item
                name="user"
                label="User"
              >
                <Select
                  placeholder="Select Radiologist"
                  options={radiologistOptions}
                  showSearch
                  onChange={handleUserSelectChange}
                  mode="multiple"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  // onChange={appliedOnChangeHandler}
                />
              </Form.Item>
            </Col>

            {/* ==== From date selection option =====  */}

            <Col xs={24} lg={12}>
              <Form.Item
                name="from_date"
                label="From Date"
                required
                rules={[
                  {
                    required: false,
                    message: "Please enter From Date",
                  },
                ]}
              >
                <DatePicker format={"DD-MM-YYYY"} />
              </Form.Item>
            </Col>

            {/* ==== To date selection option ====  */}

            <Col xs={24} lg={12}>
              <Form.Item
                name="to_date"
                label="To Date"
                required
                rules={[
                  {
                    required: false,
                    message: "Please enter to date",
                  },
                ]}
              >
                <DatePicker format={"DD-MM-YYYY "} />
              </Form.Item>
            </Col>

            {/* ==== Study status selection option ====  */}

            <Col xs={24} lg={12}>
              <Form.Item
                name="study_status"
                label="Study Status"
                className="category-select"
              >
                <Select
                  placeholder="Select Status"
                  options={statusOptions}
                  showSearch

                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

          </Row>

        </Form>

      </Modal>
    
    </div>
  );
};

export default BillingModal;
