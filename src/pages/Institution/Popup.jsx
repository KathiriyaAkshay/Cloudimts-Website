import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Select, Typography, Tooltip, Spin, Tag } from 'antd';
import { SearchOutlined,SaveOutlined,CloseOutlined, ReloadOutlined } from '@ant-design/icons';
const { Title } = Typography;
const EditableContext = React.createContext(null);
const { Option } = Select;
import NotificationMessage from "../../components/NotificationMessage"; 
import APIHandler from "../../apis/apiHandler";

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

const EditableCellSec = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSaveSec,
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
            handleSaveSec({
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


const CustomReportHeaderGenerator = ({institutionId, isModalOpen}) => {

    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(2);
    const [patientReportColumn, setPatientReportColumn] = useState([]) ; 
    const [institutionReportColumn, setInstitutionReportColumn] = useState([]) ; 

    const CustomSelect = ({ value, onChange }) => {
        return (
            <Select style={{ width: 300, marginTop: "auto", marginBottom: "auto" }} 
                value={value} onChange={onChange}>
                {[...patientReportColumn].map((eleemnt) => { 
                    return(
                        <Option value={eleemnt?.value}>{eleemnt?.value} | <Tag color='green'>Patient</Tag></Option>
                    )
                })}

                {[...institutionReportColumn].map((element) => {
                    return(
                        <Option value={element?.value}>{element?.value} | <Tag color='blue'>Institution</Tag></Option>
                    )
                })}
            </Select>
        );
    };

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const handlePostitionChanges = (key, value) => {
        const newData = dataSource.map((element) =>
            element?.key === key ? { ...element, position: value } : element
        );
        setDataSource((prevData) => {
            return [...newData]; // Update state with new data
        });
    }

    const handleSelectChange = (key, value) => {
        const dataIndex = dataSource.findIndex((record) => record.key === key);
        const newData = [...dataSource];
        newData[dataIndex] = { ...newData[dataIndex], columnName: value };

        setDataSource(newData);;
    };

    const handleSelectChangeSec = (key, value) => {
        const dataIndex = dataSourceSec.findIndex((record) => record.key === key);
        const newData = [...dataSourceSec];
        newData[dataIndex] = { ...newData[dataIndex], columnName: value };

        setDataSourceSec(newData);
    };

    // Left side related columns
    const defaultColumns = [

        {
            title: 'Patient Column-value',
            dataIndex: 'columnName',
            render: (text, record) => {
                return (
                    <CustomSelect
                        value={record?.value}
                        onChange={(value) => handleSelectChange(record.key, value)}
                    />
                )
            },
        },

        {
            title: 'Patient Column-name',
            dataIndex: 'column_name',
            width: '30%',
            editable: true,
        },

        // {
        //     title : "Position", 
        //     dataIndex: "postition",
        //     render: (text, record) => {
        //         return(
        //             <Select
        //                 value = {text || "left"}
        //                 options={[
        //                     {label: "Left", value: "left"}, 
        //                     {label: "Right", value: "right"}
        //                 ]}
        //                 onChange={(value) => {
        //                     handlePostitionChanges(record?.key, value)
        //                 }}
        //             />
        //         )
        //     }
        // }, 
        
        {
            title: 'Actions',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <a onClick={() => {handleDelete(record.key)}}>Delete</a>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData = {
            key: count,
            value: 'study__patient_name',
            column_name: `Patient name`,
            postition: "left", 
            order: dataSource?.length + 1, 
            type: "patient"
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };  

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
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

    // Institution report setting related functionality =================

    const [dataSourceSec, setDataSourceSec] = useState([]);
    const [countSec, setCountSec] = useState(2);
    
    const handleDeleteSec = (key) => {
        const newData = dataSourceSec.filter((item) => item.key !== key);
        setDataSourceSec(newData);
    };
    
    const handlePostitionChangesSec = (key, value) => {
        const newData = dataSourceSec.map((element) =>
            element?.key === key ? { ...element, position: value } : element
        );
        setDataSourceSec((prevData) => {
            return [...newData]; // Update state with new data
        });
    }
    
    // Right side related columns
    const defaultColumnsSec = [
        {
            title: 'Institution Column-name',
            dataIndex: 'columnName',
            render: (text, record) => {
                return (
                    <CustomSelect
                        value={record?.value}
                        onChange={(value) => handleSelectChangeSec(record.key, value)}
                    />
                )
            },
        },

        {
            title: 'Institition Column-name',
            dataIndex: 'column_name',
            width: '30%',
            editable: true,
        },

        // {
        //     title : "Position", 
        //     dataIndex: "postition",
        //     render: (text, record) => {
        //         console.log("Institution postion");
        //         console.log(record);
                
        //         return(
        //             <Select
        //                 value = {text || "left"}
        //                 options={[
        //                     {label: "Left", value: "left"}, 
        //                     {label: "Right", value: "right"}
        //                 ]}
        //                 onChange={(value) => {
        //                     handlePostitionChangesSec(record?.key, value)
        //                 }}
        //             />
        //         )
        //     }
        // }, 

        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSourceSec.length >= 1 ? (
                    <a onClick={() => {handleDeleteSec(record.key)}}>Delete</a>
                ) : null,
        },
    ];

    const handleAddSec = () => {
        const newData = {
            key: countSec,
            value: 'name',
            column_name: `Institution name`,
            postition: "right", 
            order: dataSourceSec?.length + 1, 
            type: "institution"
        };
        setDataSourceSec([...dataSourceSec, newData]);
        setCountSec(countSec + 1);
    };
    
    const handleSaveSec = (row) => {
        const newData = [...dataSourceSec];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSourceSec(newData);

    };
    
    const componentsSec = {
        body: {
            row: EditableRow,
            cell: EditableCellSec,
        },
    };
    const columnsSec = defaultColumnsSec.map((col) => {
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
                handleSaveSec,
            }),
        };
    });


    const closePopupDiv=()=>{
        isModalOpen(false) ; 
    }

    // Fetch institution report related columns information 
    const FetchReportColumn = async () => {
        setIsLoading(true) ; 
        let responseData = await APIHandler("POST", {}, 'institute/v1/fetch-report-columns') ; 
        setIsLoading(false) ; 

        if (responseData === false){
            NotificationMessage("warning", "Network request failed") ; 
        }   else if (responseData['status']  === true){

            let patientColumn = [] ; 
            let institutionColumn = [] ; 

            responseData['message'].map((element) => {
                if (element.option === "Patient"){
                    patientColumn.push({
                        value: element.value, 
                        "type": "patient"
                    }) ; 
                }   else{
                    institutionColumn.push({
                        value: element.value,
                        "type": "institution"
                    }) ; 
                }
            })

            setPatientReportColumn([...patientColumn])  ; 
            setInstitutionReportColumn([...institutionColumn]) ; 
        }   else{

            NotificationMessage("warning", "Network request failed", responseData['message']) ; 
        }
    }

    // Default paient colunm related information 
    const [defaultPatientOption, setDefaultPatientOption] = useState([
        {
            'key': 0,
            'value': "study__patient_name", 
            "column_name": "Patient name", 
            "postition": "left", 
            "order": 1, 
            "type": "patient"
        },
        {
            'key': 1,
            'value': "study__patient_id", 
            "column_name": "Patient id", 
            "postition": "left", 
            "order": 2, 
            "type": "patient"
        },
        {
            'key': 2,
            'value': "modality", 
            "column_name": "Modality", 
            "postition": "left", 
            "order": 3, 
            "type": "patient"
        },
        {
            'key': 3,
            'value': "gender", 
            "column_name": "Gender", 
            "postition": "left", 
            "order": 4, 
            "type": "patient"
        },
    ]) ; 

    // Default institution column related information 
    const [defaultInstitutionOption, setDefaultInstitutionOtion] = useState([
        {
            'key': 0,
            'value': "name", 
            "column_name": "Institution name", 
            "posititon": "right", 
            "order": 1, 
            "type": "institution"
        }

    ]) ; 

    // Fetch institution report related information 
    const FetchInstitutionReportSetting = async () => {
        setIsLoading(true) ; 
        let responseData = await APIHandler("POST", {"id": institutionId}, 'institute/v1/fetch-institution-report' ) ; 
        setIsLoading(false); 

        if (responseData === false){
        
            NotificationMessage("warning", "Network request failed") ;

        }   else if (responseData['status'] === true){
            
            let institution_report_setting = responseData?.data?.institution_report_details ; 
            let left_columns = [] ;
            let right_columns = [] ; 

            Object.entries(institution_report_setting).forEach(([key, item]) => {
                if (item?.position == "left"){
                    left_columns.push({
                        ...item,
                        value: key
                    })
                }   else {
                    right_columns.push({
                        ...item, 
                        value: key
                    })
                }
            });

            let finalLeftData = [] ; 
            let finalRightData = [] ; 

            left_columns?.map((element, index) => {
                let order = index + 1;
                left_columns?.map((element) => {
                    if (+element?.order ===  +order){
                        finalLeftData.push(element) ; 
                    }
                })  
            })

            right_columns?.map((element, index) => {
                let order = index + 1;
                right_columns?.map((element) => {
                    if (+element?.order ===  +order){
                        finalRightData.push(element) ; 
                    }
                })  
            })

            setDataSource([...left_columns]) ; 
            setDataSourceSec([...right_columns]) ; 



        }   else {

            NotificationMessage("warning", "Network request failed" ,responseData['message']) ; 
        }
    }

    const [isLoading, setIsLoading] = useState(false) ; 

    const setReportDefaultData = () => {
        setDataSource([
            {
                'key': 0,
                'columnName': "study__patient_name", 
                "customColumnName": "Patient name"
            },
            {
                'key': 1,
                'columnName': "study__patient_id", 
                "customColumnName": "Patient id"
            },
            {
                'key': 2,
                'columnName': "modality", 
                "customColumnName": "Modality"
            },
            {
                'key': 3,
                'columnName': "gender", 
                "customColumnName": "Gender"
            },
        ]) ;

        setDataSourceSec([
            {
                'key': 0,
                'columnName': "name", 
                "customColumnName": "Institution name"
            }, 
            {
                'key':1,
                'columnName': "address", 
                "customColumnName": "Institution address"
            }, 
            {
                'key': 2,
                'columnName': "contact", 
                "customColumnName": "Contact number"
            }, 
            {
                'key': 4,
                'columnName': "email", 
                "customColumnName": "Email address"
            }
    
        ])

        NotificationMessage("success", "Successfully reset report setting")
    }   

    useEffect(() => {

        FetchReportColumn() ; 

        if (institutionId !== null){
            FetchInstitutionReportSetting() ; 
        }   else {
            setReportDefaultData() ; 
        }
    }, []) ; 
    
    const ResetOptionHandle = () => {
        setDataSource([...defaultPatientOption]) ; 
        setDataSourceSec([...defaultInstitutionOption]) ;  
        NotificationMessage("success", "Report settings have been successfully reset.")
    }

    // ****** Save institution report setting related option handler ***** // 
    const SaveReportOptionHandle = async () => {
        let institution_report_details = {} ; 

        dataSource?.map((element, index) => {
            institution_report_details[element?.value] = {...element, order: index + 1}
        })

        dataSourceSec?.map((element, index) => {
            institution_report_details[element?.value] = {
                ...element, order: index + 1
            }
        })

        if (institutionId !== null){

            let requestPayload = {
                "id": institutionId, 
                "institution_report_details": institution_report_details, 
            }; 

            setIsLoading(true) ; 
            let responseData = await APIHandler("POST", requestPayload, "institute/v1/update-institution-report") ; 
            setIsLoading(false) ; 
            if (responseData === false){
                NotificationMessage("warning", "Network request failed") ; 
            } else if (responseData['status'] === true){
                isModalOpen(false) ; 
                NotificationMessage("success", "Institution report setting update successfully") ; 
            }   else {

                NotificationMessage("warning","Network request failed" ,responseData['messgae']) ; 
            }
        }
    }

    return (
        <div className='custom-header-wrapper' id="popup-main">
            <div className='custom-header-inner' style={{borderRadius: "5px", backgroundColor: "#FFFFFF"}}>

                <Spin spinning = {isLoading}>
                    
                    <div className='pop-up-header'>
                    
                        <Title level={4} className='Report-setting-option-header-info'>
                            Report setting
                        </Title>
                    
                        <div className='pop-up-icons'>
                            
                            <div style={{padding: "10px", paddingTop:"8px", paddingBottom: "8px"}}>
                                <Tooltip title="Save">
                                    <Button className='Green-option-add-button' shape="circle" icon={<SaveOutlined />} 
                                        onClick={SaveReportOptionHandle}/>
                                </Tooltip>
                            </div>

                            <div style={{padding: "10px", paddingTop:"8px", paddingBottom: "8px"}}>
                                <Tooltip title="Reset">
                                    <Button className="Reset-button" shape="circle" icon={<ReloadOutlined />} onClick={ResetOptionHandle}/>
                                </Tooltip>
                            </div>

                            <div style={{padding: "10px", paddingTop:"8px", paddingBottom: "8px"}}>
                                <Tooltip title="Close">
                                    <Button shape="circle" className="Danger-button" icon={<CloseOutlined /> }  
                                    onClick={closePopupDiv}/>
                                </Tooltip>
                            </div>                        

                        </div>

                    </div>

                    {/* ===== Left side columns information ====  */}

                    <div style={{paddingLeft: "1rem", paddingRight: "1rem"}}>

                        <div className='Report-setting-option-title' style={{display: "flex", flexDirection: "row", marginBottom: "16px", marginTop: "8px"}}>
                            
                            <div className='Report-option-title' 
                                style={
                                    {
                                        marginTop: "auto", 
                                        marginBottom: "auto", 
                                        fontSize: "16px", 
                                        fontWeight: 600
                                    }
                                }>
                                <Tag color='#87d068'>
                                   Left Side Columns
                                </Tag>
                            </div>

                            <Button
                                onClick={handleAdd}
                                className='Report-option-add-button Green-option-add-button'
                                style={{
                                    marginTop: "auto", 
                                    marginBottom: "auto", 
                                    marginLeft: "10px"
                                }}
                            >
                                + Add a row
                            </Button>



                        </div>
                        
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            className='insert-report-info-table'
                        />

                    </div>  

                    {/* ====== Right side columns information ====== }                                 */}
                    <div style={{
                        paddingLeft: "1rem", 
                        paddingRight: "1rem", 
                        borderTopWidth: 1,
                        borderTopColor: "#f5f5f5"
                    }}>

                        <div className='Report-setting-option-title' style={{display: "flex", flexDirection: "row", marginBottom: "16px", marginTop: "16px"}}>
                            
                            <div className='Report-option-title' 
                                style={
                                    {
                                        marginTop: "auto", 
                                        marginBottom: "auto", 
                                        fontSize: "16px", 
                                        fontWeight: 600
                                    }
                                }>
                                <Tag color='#87d068'>
                                    Right Side Columns
                                </Tag>
                            </div>
                            <Button
                                onClick={handleAddSec}
                                className='Report-option-add-button Green-option-add-button'
                                style={{
                                    marginTop: "auto", 
                                    marginBottom: "auto", 
                                    marginLeft: "10px"
                                }}
                            >
                                + Add a row
                            </Button>
                        </div>

                        <Table
                            components={componentsSec}
                            rowClassName={() => 'editable-row'} 
                            dataSource={dataSourceSec}
                            columns={columnsSec}
                            pagination={false}
                        />
                    </div>

                </Spin>

            </div>
            
        </div>

    );
};

export default CustomReportHeaderGenerator;