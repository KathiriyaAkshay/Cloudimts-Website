import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, Card, Spin } from "antd";
import { useParams } from 'react-router-dom';
import APIHandler from "../apis/apiHandler";
import {
    FilePdfOutlined 
} from '@ant-design/icons';
import NotificationMessage from "./NotificationMessage"; 
import { parseInt } from "lodash";

const ReportSummary = () => {
    const { id } = useParams();

    const [showPatientDetails, setShowPatientDetails] = useState(0);
    const [patientData, setPatientData] = useState([]);
    const [patientDetails, setPatientDetails] = useState(null);
    const [patientReport, setPatientReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const OHIFViewerHandler = () => {
        window.open(`https://viewer.cloudimts.com/ohif/viewer?url=../studies/${patientDetails?.study_id}/ohif-dicom-json`, "_blank") ; 

    }

    // Patient detilas information table column value 

    const columns = [
        {
            title: "Patient Id",
            dataIndex: "patient_id",
            key: "patient_id",
        },
        {
            title: "Patient Name",
            dataIndex: "patient_name",
            key: "patient_name",
        },
        {
            title: "Institution Name",
            dataIndex: "institution_name",
            key: "institution_name",
        },
        {
            title: "Modality",
            dataIndex: "modality",
            key: "modality",
        },
        {
            title: "Accession Number",
            dataIndex: "accession_number",
            key: "accession_number",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            width: "25%",
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => {OHIFViewerHandler(record)}} danger>OHF Viewer</Button>
                </Space>
            ),
        },
    ];

    const columns1 = [
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            width: "10%",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" danger className="red-color-button"
                        onClick={() => DownloadReport(record)}>
                        <FilePdfOutlined/> &nbsp; Report
                    </Button>
                </Space>
            ),
        },

        {
            title: "Report Date",
            dataIndex: "report_date",
            key: "report_date",
        },

        {
            title: "Reported By",
            dataIndex: "reported_by",
            key: "reported_by",
        },

        // {
        //     title: "Reporting person",
        //     dataIndex: "reported_contact",
        //     key: "reported_contact",
        // },

        {
            title: "On Report time study Description",
            dataIndex: "modality_study_description",
            key: "modality_study_description",
        },

        {
            title: "Report Type",
            dataIndex: "report_type",
            key: "report_type",
        }
    ];

    const toggleShowState = () => {
        if (showPatientDetails == 1) {
            setShowPatientDetails(0);
            document.getElementById("patient_details_div").style.display = "none";

        } else {
            setShowPatientDetails(1);
            document.getElementById("patient_details_div").style.display = "block";

        }
    }

    const FetchReportInformation = async () => {

        setIsLoading(true);

        let requestPayload = {
            'id': id
        };

        let responseData = await APIHandler("POST", requestPayload, 'studies/v1/fetch-email-report');

        setIsLoading(false);

        if (responseData === false) {

            NotificationMessage('warning', "Network request failed", "Failed to fetch report information");

        } else if (responseData['status'] === true) {

            // Set Patient Details information 

            let temp = {
                'key': 1,
                'patient_id': responseData?.data?.patient_details?.Patient_id,
                'patient_name': responseData?.data?.patient_details?.Patient_name,
                'accession_number': responseData?.data?.patient_details?.Accession_number,
                'gender': responseData?.data?.patient_details?.Gender,
                'age': responseData?.data?.patient_details?.Age,
                'institution_name': responseData?.data?.patient_details?.institution?.Institution_name,
                'modality': responseData?.data?.patient_details?.Modality
            }

            setPatientData([temp]);
            setPatientDetails({ ...responseData?.data?.patient_details });

            // Set Patient report information 

            let reports = [];

            responseData?.data?.reports.map((element, index) => {
                reports.push({
                    'key': parseInt(index) + 1,
                    'report_date': element?.reporting_time,
                    'reported_by': element?.report_by?.username,
                    'reported_contact': element?.report_by?.email,
                    'modality_study_description': element?.study_description,
                    'report_type': element?.report_type,
                    'report_id': element?.id, 
                    "report_url": element?.report_url
                })
            })

            setPatientReport([...reports]);
        } else {

            NotificationMessage('warning', "Network request failed", responseData['message']);
        }
    }

    const DownloadReport = async (record) => {
        setIsLoading(true);
        
        // URL of the PDF file
        var pdfUrl = record?.report_url;

        // Create a temporary anchor element
        var downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.target = '_blank'; // Open in new tab, if needed
        downloadLink.download = 'filename.pdf'; // Optional, specify a filename for the downloaded file

        // Append the anchor element to the body
        document.body.appendChild(downloadLink);

        // Trigger a click event on the anchor element
        downloadLink.click();

        // Remove the anchor element from the body
        document.body.removeChild(downloadLink);
        setIsLoading(false);
    }

    useEffect(() => {
        FetchReportInformation();
    }, [])


    return (
        <>
            <div className="report-summary-wrapper">

                <Spin spinning={isLoading}>

                    <div
                        className="report-summary-header"
                        style={{
                            paddingTop: "1rem",
                            paddingBottom: "1rem",
                            marginTop: "2rem",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    >
                        <div
                            style={{
                                marginLeft: "0.4rem",
                                fontWeight: "600",
                                fontSize: "18px",
                                paddingLeft: "1rem",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            Study Reports of {patientDetails?.Patient_name}
                        </div>

                        <div className="report-summary-buttons">
                            <Button
                                className="primary-thin-button"
                                onClick={toggleShowState}
                                borderColorDisabled
                            >
                                + Patient Details
                            </Button>

                            {/* Back option button  */}

                            <Button type="primary" className="report-back-option-button">Back</Button>
                        </div>
                    </div>

                    {/* ==== Basic patient details information =====  */}

                    <div className="w-95 report-summary-table-res" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "20px" }}>
                        <Card bordered={false} style={{ width: "100%" }}>
                            <Table
                                columns={columns}
                                dataSource={patientData}
                                pagination={false}
                                scroll={{ y: 175, x: false }}
                            />
                        </Card>
                    </div>

                    <div
                        className="w-100"
                        id="patient_details_div"
                        style={{ display: "none", marginLeft: "auto", marginRight: "auto", marginTop: "20px" }}
                    >
                        <div style={{ width: "100%" }}>
                            <Card
                                title="Patient Details"
                                bordered={false}
                                style={{ width: "100%" }}
                                className="report-patient-details-card"
                            >
                                <div className="report-summary-patient-details">
                                    <div>
                                        <table className="patient-report-info-table">
                                            <tr>
                                                <td className="bold-text">Patient's Name :</td>
                                                <td >
                                                    <Tag
                                                        color="#87d068"
                                                        style={{marginTop: "0.70rem", fontSize: "0.85rem", paddingTop: "0.30rem", paddingBottom:"0.30rem"}}
                                                        className="Assign-study-info-tag w-100"
                                                    >
                                                        {patientDetails?.Patient_name}
                                                    </Tag>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="bold-text">Patient Id :</td>
                                                <td>
                                                    <Tag
                                                        color="#87d068"
                                                        style={{marginTop: "0.70rem", fontSize: "0.85rem", paddingTop: "0.30rem", paddingBottom:"0.30rem"}}
                                                        className="Assign-study-info-tag w-100"
                                                    >
                                                        {patientDetails?.Patient_id}
                                                    </Tag>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="bold-text">Modality :</td>
                                                <td className="report-patient-data">{patientDetails?.Modality}</td>
                                            </tr>

                                            <tr>
                                                <td className="bold-text">Study Description :</td>
                                                <td className="report-patient-data">{patientDetails?.Study_description}</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Patient comments :</td>
                                                <td className="report-patient-data">{patientDetails?.Patient_comments}</td>
                                            </tr>

                                            <tr>
                                                <td className="bold-text">Institution :</td>
                                                <td className="report-patient-data">{patientDetails?.institution?.Institution_name}</td>
                                            </tr>

                                        </table>
                                    </div>
                                    <div>
                                        <table>
                                            <tr>
                                                <td className="bold-text">Gender :</td>
                                                <td className="report-patient-data">{patientDetails?.Gender}</td>
                                            </tr>

                                            <tr>
                                                <td className="bold-text">Age</td>
                                                <td className="report-patient-data">{patientDetails?.Age}</td>
                                            </tr>

                                            <tr>
                                                <td className="bold-text">Date Of Birth:</td>
                                                <td className="report-patient-data">{patientDetails?.DOB}</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Accession Number :</td>
                                                <td className="report-patient-data">{patientDetails?.Accession_number}</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">
                                                    Reffering Physician Name :
                                                </td>
                                                <td className="report-patient-data">{patientDetails?.Referring_physician_name}</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">
                                                    Performing Physician Name :
                                                </td>
                                                <td className="report-patient-data">{patientDetails?.Performing_physician_name}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* ==== Patient report information ====  */}

                    <div className="w-95 report-summary-table-res" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "25px" }}>
                        <Card
                            title="Report information"
                            bordered={false}
                            style={{ width: "100%", marginTop: "15px", marginBottom: "20px" }}
                        >
                            <Table
                                columns={columns1}
                                dataSource={patientReport}
                                pagination={false}
                                scroll={{ y: 175 }}
                            />
                        </Card>
                    </div>

                </Spin>

            </div>
        </>
    );
};

export default ReportSummary;
