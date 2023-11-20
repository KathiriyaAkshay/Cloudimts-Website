import React, { useState } from "react";
import { Space, Table, Tag, Button, Card } from 'antd';


const ReportSummary = () => {
    const [showPatientDetails,setShowPatientDetails]=useState(0);
    const columns = [
        {
            title: 'Patient Id',
            dataIndex: 'patient_id',
            key: 'patient_id',

        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
        },
        {
            title: 'Accession Number',
            dataIndex: 'accession_number',
            key: 'accession_number',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Institution Name',
            dataIndex: 'institution_name',
            key: 'institution_name',
        },
        {
            title: 'Modality',
            dataIndex: 'modality',
            key: 'modality',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: "25%",
            render: (_, record) => (
                <Space size="middle">
                    <Button danger>OHF Viewer</Button>
                    <Button danger>Redvia Viewer</Button>
                </Space>
            ),
        },
    ];
    const data = [
        {
            key: '1',
            patient_id: 'ASF123D',
            patient_name: "ABC",
            accession_number: 'ACC0HVSADA',
            gender: "",
            age: "21",
            institution_name: "adssad",
            modality: "CT",
        },

    ];
    const columns1 = [
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: "10%",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" danger className="red-color-button">
                        PDF
                    </Button>
                </Space>
            ),
        },
        {
            title: 'Report Date',
            dataIndex: 'report_date',
            key: 'report_date',
        },
        {
            title: 'Reported By',
            dataIndex: 'reported_by',
            key: 'reported_by',
        },
        {
            title: 'Report Status',
            dataIndex: 'report_status',
            key: 'report_status',
        },
        {
            title: 'Modality Study Description',
            dataIndex: 'modality_study_description',
            key: 'modality_study_description',
        },
        {
            title: 'Report Result',
            dataIndex: 'report_result',
            key: 'report_result',
        },
        {
            title: 'Report Type',
            dataIndex: 'report_type',
            key: 'report_type',
        },

    ];
    const data1 = [
        {
            key: '1',
            report_date: 'timestamp',
            report_by: "ABC",
            report_status: 'complete',
            modality_study_description: "Brain",
            report_result: "abnormal",
            report_type: "File Report",
        },

    ];


    const toggleShowState=()=>{
        if (showPatientDetails==1){
            setShowPatientDetails(0);
            document.getElementById("patient_details_div").style.display="none";

        }else{
            setShowPatientDetails(1);
            document.getElementById("patient_details_div").style.display="block";

        }
    }

    return (
        <>
            <div className="report-summary-main">
                <div className="report-summary-wrapper">
                    <div>logo</div>
                    <div className="report-summary-header">
                        <div>Study Reports</div>
                        <div className="report-summary-buttons">
                            <Button className="primary-thin-button" onClick={toggleShowState} borderColorDisabled>
                                + Patient Details
                            </Button>
                            <Button danger>
                                Viewer
                            </Button>
                            <Button type="primary">
                                Back
                            </Button>
                        </div>
                    </div>

                    <div className="w-95" >

                        <Card bordered={false} style={{ width: "100%" }}>
                            <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 175, x: false }} />

                        </Card>
                    </div>
                    <div className="w-95" id="patient_details_div">

                        <div style={{ width: "100%" }} >

                            <Card title="Patient Details" bordered={false} style={{ width: "100%" }}>
                                <div className="report-summary-patient-details">
                                    <div>
                                        <table>

                                            <tr>
                                                <td className="bold-text">Patient Id :</td>
                                                <td>Maria Anders</td>

                                            </tr>
                                            <tr>
                                                <td className="bold-text">Patient's Name :</td>
                                                <td>Christina Berglund</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Accession Number :</td>
                                                <td>Francisco Chang</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Gender :</td>
                                                <td>Austria</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Date Of Birth:</td>
                                                <td>UK</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Age Group:</td>
                                                <td>UK</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Institution   :</td>
                                                <td>Germany</td>
                                            </tr>

                                        </table>



                                    </div>
                                    <div>


                                        <table>

                                            <tr>
                                                <td className="bold-text">Reffering Physician Name :</td>
                                                <td>Performing Physician Name :</td>


                                            </tr>
                                            <tr>
                                                <td className="bold-text">Patient's Name :</td>
                                                <td>Christina Berglund</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Performing Physician Name :</td>
                                                <td>Francisco Chang</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Modality :</td>
                                                <td>Austria</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Count :</td>
                                                <td>UK</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">Study Description :</td>
                                                <td>UK</td>
                                            </tr>
                                            <tr>
                                                <td className="bold-text">UID :</td>
                                                <td>Germany</td>
                                            </tr>

                                        </table>
                                    </div>
                                </div>

                            </Card>
                        </div>

                    </div>

                    <div className="w-95" >

                        <Card title="Patient Reports" bordered={false} style={{ width: "100%" }}>
                            <Table columns={columns1} dataSource={data1} pagination={false} scroll={{ y: 175 }} />

                        </Card>
                    </div>
                </div>
            </div>
        </>
    )

}


export default ReportSummary;