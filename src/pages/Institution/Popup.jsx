import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Select, Typography, Tooltip, Spin, Tag } from 'antd';
import { SearchOutlined,SaveOutlined,CloseOutlined, ReloadOutlined } from '@ant-design/icons';
const { Title } = Typography;
const EditableContext = React.createContext(null);
const { Option } = Select;
import NotificationMessage from "../../components/NotificationMessage"; 
import APIHandler from "../../apis/apiHandler";
import { render } from 'react-dom';


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

    const defaultColumns = [

        {
            title: 'Patient Column-value',
            dataIndex: 'columnName',
            render: (text, record) => (
                <CustomSelect
                    value={record.columnName}
                    onChange={(value) => handleSelectChange(record.key, value)}
                />
            ),
        },

        {
            title: 'Patient Column-name',
            dataIndex: 'customColumnName',
            width: '30%',
            editable: true,
        },

        {
            title : "Position", 
            dataIndex: "position",
            render: (text, record) => {
                return(
                    <Select
                        value = {text || "left"}
                        options={[
                            {label: "Left", value: "left"}, 
                            {label: "Right", value: "right"}
                        ]}
                        onChange={(value) => {
                            handlePostitionChanges(record?.key, value)
                        }}
                    />
                )
            }
        }, 
        
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
            columnName: 'study__patient_name',
            customColumnName: `Patient name`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
        NotificationMessage("success", "Added new row in Patient report setting")
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
    
    const defaultColumnsSec = [
        {
            title: 'Institution Column-name',
            dataIndex: 'columnName',
            render: (text, record) => (
                <InstitutionCustomSelect
                    value={record.columnName}
                    onChange={(value) => handleSelectChangeSec(record.key, value)}
                />
            ),
        },

        {
            title: 'Institition Column-name',
            dataIndex: 'customColumnName',
            width: '30%',
            editable: true,
        },

        {
            title : "Position", 
            dataIndex: "position",
            render: (text, record) => {
                return(
                    <Select
                        value = {text || "left"}
                        options={[
                            {label: "Left", value: "left"}, 
                            {label: "Right", value: "right"}
                        ]}
                        onChange={(value) => {
                            handlePostitionChangesSec(record?.key, value)
                        }}
                    />
                )
            }
        }, 

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
            columnName: 'name',
            customColumnName: `Institution name`,
        };
        setDataSourceSec([...dataSourceSec, newData]);
        setCountSec(countSec + 1);
        NotificationMessage("success", "Add new row in institution report setting")
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

    

    const [patientReportColumn, setPatientReportColumn] = useState([]) ; 

    const CustomSelect = ({ value, onChange }) => {
        return (
            <Select style={{ width: 300, marginTop: "auto", marginBottom: "auto" }} value={value} onChange={onChange}>
                {patientReportColumn.map((eleemnt) => { 
                    return(
                        <Option value="option1">{eleemnt}</Option>
                    )
                })}
            </Select>
        );
    };

    const [institutionReportColumn, setInstitutionReportColumn] = useState([]) ; 

    const InstitutionCustomSelect = ({ value, onChange }) => {
        return (
            <Select style={{ width: 300, marginTop: "auto", marginBottom: "auto" }} value={value} onChange={onChange}>
                {institutionReportColumn.map((eleemnt) => { 
                    return(
                        <Option value="option1">{eleemnt}</Option>
                    )
                })}
            </Select>
        );
    };


    const closePopupDiv=()=>{

        isModalOpen(false) ; 
        
    }

    // ============ Fetch report related columns information ============== //
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
                    patientColumn.push(element.value) ; 
                }   else{
                    institutionColumn.push(element.value) ; 
                }
            })

            setPatientReportColumn([...patientColumn])  ; 
            setInstitutionReportColumn([...institutionColumn]) ; 
        }   else{

            NotificationMessage("warning", "Network request failed", responseData['message']) ; 
        }
    }

    const [defaultPatientOption, setDefaultPatientOption] = useState([
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

    const [defaultInstitutionOption, setDefaultInstitutionOtion] = useState([
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

    ]) ; 

    const FetchInstitutionReportSetting = async () => {

        setIsLoading(true) ; 

        let responseData = await APIHandler("POST", {"id": institutionId}, 'institute/v1/fetch-institution-report' ) ; 

        setIsLoading(false); 

        if (responseData === false){
        
            NotificationMessage("warning", "Network request failed") ;

        }   else if (responseData['status'] === true){

            let institutionReport = [] ; 
            let institutionIndex = 0 ; 

            Object.keys(responseData['data']?.institution_report_details).forEach(key => {
                const value = responseData['data']?.institution_report_details[key];
                console.log(value);
                
                institutionReport.push({
                    'key': institutionIndex, 
                    'columnName': key, 
                    'customColumnName': value?.column_name, 
                    "position": value?.position
                })
                institutionIndex += 1; 
            });

            setDataSourceSec([...institutionReport]) ; 

            let patientReport = [] ; 
            let patientReportIndex = 0 ; 

            let patientExcludeColumn = ["Patient id", "Patient name"] ; 
            Object.keys(responseData['data']?.patient_report_details).forEach(key => {
                const value = responseData['data']?.patient_report_details[key];
                if (!patientExcludeColumn.includes(value)){
                    patientReport.push({
                        'key': patientReportIndex, 
                        'columnName': key, 
                        'customColumnName': value?.column_name, 
                        "position": value?.position
                    })
                    patientReportIndex += 1; 
                }
            });

            setDataSource([...patientReport]) ; 


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

        let savePatientdetails = {} ; 

        dataSource.map((element) => {
            savePatientdetails[element.columnName] = {
                "column_name": element.customColumnName, 
                "position": element?.position || "left"
            } ; 
        })

        let saveInstitutionDetails = {} ; 

        dataSourceSec.map((element) => {
            saveInstitutionDetails[element.columnName] = {
                "column_name": element.customColumnName, 
                "position": element?.position || "left"
            } ; 
        })

        if (institutionId !== null){

            let requestPayload = {
                "id": institutionId, 
                "institution_report_details": saveInstitutionDetails, 
                "patient_report_details": savePatientdetails
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

                    {/* ==== Patient report setting option handling ====  */}

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
                                    Patient Report Setting
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

                    {/* ==== Instittuion report setting option handling =====  */}

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
                                    Institution Report Setting
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