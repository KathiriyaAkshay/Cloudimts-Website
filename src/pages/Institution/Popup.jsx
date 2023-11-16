import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Select, Typography, Tooltip } from 'antd';
import { SearchOutlined,SaveOutlined,CloseOutlined } from '@ant-design/icons';
// import { Typography } from 'antd';
const { Title } = Typography;
const EditableContext = React.createContext(null);
const { Option } = Select;

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
const CustomReportHeaderGenerator = () => {
    const [dataSource, setDataSource] = useState([
        {
            key: '0',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
        {
            key: '1',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
        {
            key: '2',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
        {
            key: '3',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
    ]);
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };


    const handleSelectChange = (key, value) => {
        // Find the index of the record in the data array
        const dataIndex = dataSource.findIndex((record) => record.key === key);

        // Create a new copy of the data array
        const newData = [...dataSource];

        // Update the selectMenu value for the specific record
        newData[dataIndex] = { ...newData[dataIndex], columnName: value };

        // Update the state with the new data
        setDataSource(newData);

        // You can perform additional actions as needed
        console.log(`Selected ${value} for record with key: ${key}`);
    };

    const handleSelectChangeSec = (key, value) => {
        // Find the index of the record in the data array
        const dataIndex = dataSourceSec.findIndex((record) => record.key === key);

        // Create a new copy of the data array
        const newData = [...dataSourceSec];

        // Update the selectMenu value for the specific record
        newData[dataIndex] = { ...newData[dataIndex], columnName: value };

        // Update the state with the new data
        setDataSourceSec(newData);

        // You can perform additional actions as needed
        console.log(`Selected ${value} for record with key: ${key}`);
    };

    const defaultColumns = [
        {
            title: 'columnName',
            dataIndex: 'columnName',
            render: (text, record) => (
                <CustomSelect
                    value={record.columnName}
                    onChange={(value) => handleSelectChange(record.key, value)}
                />
            ),
        },

        {
            title: 'customColumnName',
            dataIndex: 'customColumnName',
            width: '30%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleAdd = () => {
        const newData = {
            key: count,
            columnName: 'Option0',
            customColumnName: `London, Park Lane no. ${count}`,
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

    // second table 

    const [dataSourceSec, setDataSourceSec] = useState([
        {
            key: '0',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
        {
            key: '1',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
        {
            key: '2',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
        {
            key: '3',
            columnName: 'Option 0',
            customColumnName: 'London, Park Lane no. 0',
        },
    ]);
    const [countSec, setCountSec] = useState(2);
    const handleDeleteSec = (key) => {
        const newData = dataSourceSec.filter((item) => item.key !== key);
        setDataSourceSec(newData);
    };
    const defaultColumnsSec = [
        {
            title: 'columnName',
            dataIndex: 'columnName',
            render: (text, record) => (
                <CustomSelect
                    value={record.columnName}
                    onChange={(value) => handleSelectChangeSec(record.key, value)}
                />
            ),
        },

        {
            title: 'customColumnName',
            dataIndex: 'customColumnName',
            width: '30%',
            editable: true,
        },

        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSourceSec.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteSec(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    const handleAddSec = () => {
        const newData = {
            key: countSec,
            columnName: 'Option0',
            customColumnName: `London, Park Lane no. ${countSec}`,
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

    const CustomSelect = ({ value, onChange }) => {
        return (
            <Select style={{ width: 120 }} value={value} onChange={onChange}>
                <Option value="option1">Optionasddddddd 1</Option>
                <Option value="option2">Option 2</Option>
                <Option value="option3">Option 3</Option>
            </Select>
        );
    };


    const closePopupDiv=()=>{

        document.getElementById("popup-main").style.display="none"
        
    }

    return (
        <div className='custom-header-wrapper' id="popup-main">
            <div className='custom-header-inner'>
                <div className='pop-up-header   '>
                    <Title level={4}>Custom Report Header Generator
                    </Title>
                        <div className='pop-up-icons'>
                            <Tooltip title="save">
                                <Button type="primary" shape="circle" icon={<SaveOutlined />} />
                            </Tooltip>
                            <Tooltip title="reset">
                                <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                            </Tooltip>
                            <Tooltip title="close">
                                <Button type="primary" shape="circle" icon={<CloseOutlined />}  onClick={closePopupDiv}/>
                            </Tooltip>

                        </div>

                 


                </div>

                <div>
                    <Button
                        onClick={handleAdd}
                        type="primary"
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        Add a row
                    </Button>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        // bordered
                        dataSource={dataSource}
                        columns={columns}
                        scroll={{ y: 200 }}
                        pagination={false}
                    />

                </div>

                <div>
                    <Button
                        onClick={handleAddSec}
                        type="primary"
                        style={{
                            marginBottom: 16,
                            marginTop: 10
                        }}
                    >
                        Add a row
                    </Button>
                    <Table
                        components={componentsSec}
                        rowClassName={() => 'editable-row'}
                        // bordered
                        dataSource={dataSourceSec}
                        columns={columnsSec}
                        scroll={{ y: 200 }}
                        pagination={false}
                    />
                </div>
            </div>
        </div>

    );
};
export default CustomReportHeaderGenerator;