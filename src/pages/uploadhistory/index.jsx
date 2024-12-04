import React from "react";
import { useState, useEffect } from "react";
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import {Table, Spin, Tag, Button, Popconfirm } from "antd" ; 
import APIHandler from "../../apis/apiHandler";
import NotificationMessage from "../../components/NotificationMessage";
import TableWithFilter from "../../components/TableWithFilter";
import { ClearOutlined } from '@ant-design/icons';


const UploadHistory = () => {

    // Upload History related columns 
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'name',
            width: 80
        },
        {
          title: 'Patient id',
          dataIndex: 'patient_id',
          key: 'age',
        },
        {
          title: 'Patient name',
          dataIndex: 'patient_name',
          key: 'address',
        },
        {
            title: 'Modality',
            dataIndex: 'modality',
            key: 'address',
            width: 130
        },
        {
            title: 'Series id',
            dataIndex: 'series_id',
            key: 'address',
            ellipsis: {
                showTitle: true,
            },
        },
        {
            title: 'Manual upload',
            dataIndex: 'manual_upload',
            render: (text, record) => (
                text == false?<Tag color="#2db7f5">Direct Upload</Tag>:<Tag color="#108ee9">Manual Upload</Tag> 
            ), 
            width: 170
        },
        {
            title: 'Upload at',
            dataIndex: 'created_at',
            key: 'address',
            width: 175
        },
    ];

    const { changeBreadcrumbs } = useBreadcrumbs()

    const [historyData, setHistoryData] = useState([]) ; 
    const [loading, setLoading] = useState(false) ; 
    const [totalRecord, setTotalRecord] = useState(0) ; 
    const [pagi, setPagi] = useState({ page: 1 })

    const LoadUploadHistory = async (pagination) => {
        console.log(pagination);
        setLoading(true) ; 
        const currentPagination = pagination || pagi
        let responseData = await APIHandler("GET", {}, `studies/v1/study_upload_history?page_number=${currentPagination?.page}&page_size=1${currentPagination?.limit}`) ; 
        setLoading(false) ; 

        if (responseData == false){
            NotificationMessage("warning", "Network request failed") ; 
        }   else if (responseData?.status){
            setHistoryData([...responseData?.data]); 
            setTotalRecord(responseData?.data)
        }   else {
            NotificationMessage(
                "warning", 
                "Network request failed", 
                responseData?.message
            )
        }
    }; 

    useEffect(() => {
        changeBreadcrumbs([{"name": "Upload History"}])
    }, []) ; 

    const ClearClinicalHistory = async() => {
        setLoading(true) ;
        let responseData = await APIHandler("POST", {}, "studies/v1/study_history_clear") ; 
        setLoading(false) ; 

        if (responseData == false){
            NotificationMessage("warning", "Network request failed") ; 
        }   else if (responseData?.status){
            NotificationMessage(
                "success", 
                "Clinical history clear successfully"
            ) ; 
            setPagi({page: 1}) ; 
            LoadUploadHistory() ; 
        }   else {
            NotificationMessage(
                "warning", 
                "Network request failed", 
                responseData?.mesasge
            )
        }
    }

    return(
        <div>   
            
            <div className="w-100">
                <Popconfirm 
                    title = "Clear History"
                    description = "Are you sure you want to clear upload history ?"
                    onConfirm={ClearClinicalHistory}
                >
                    <Button style={{float: "right", marginBottom: '0.70rem'}}><ClearOutlined/> &nbsp; Clear History</Button>
                </Popconfirm>
            </div>
            
            <TableWithFilter
                tableColumns={columns}
                tableData={historyData}
                loadingTableData={loading}
                totalRecords={totalRecord}
                setPagi={setPagi}
                onPaginationChange={LoadUploadHistory}
            />
        </div>
    )
}

export default UploadHistory; 