import { Button, Card, Checkbox, Collapse, Form, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import API from "../../apis/getApi";
import { useParams } from "react-router-dom";
import NotificationMessage from "../../components/NotificationMessage";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

function EditPermission() {
  const [permissionData, setPermissionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { changeBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    retrievePermissionData();
    const crumbs = [{ name: "Roles", to: "/users/roles" }];
    crumbs.push({
      name: "Edit Permissions",
    });
    changeBreadcrumbs(crumbs);
  }, []);

  const retrievePermissionData = async () => {
    setIsLoading(true);
    await API.post(
      "/role/v1/fetch_particular_role_permission",
      { role_id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        setPermissionData(res.data.data);
      })
      .catch((err) => console.log(err));
    setIsLoading(false);
  };

  const handlePermissionChange = (permissionId, value) => {
    setPermissionData((prevData) => ({
      ...prevData,
      ...Object.keys(prevData).reduce((acc, key) => {
        acc[key] = prevData[key].map((item) =>
          item.permission_id === permissionId
            ? { ...item, permission_value: value }
            : item
        );
        return acc;
      }, {}),
    }));
  };

  const columns = [
    {
      title: "Permission name",
      dataIndex: "permission",
    },
    {
      title: "Status",
      dataIndex: "permission_value",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onChange={(e) =>
            handlePermissionChange(record.permission_id, e.target.checked)
          }
        />
      ),
    },
  ];

  const permissionSubmitHandler = async (data) => {
    setIsLoading(true);
    const resData = {
      role_id: id,
      update_permission: data.map((item) => ({
        id: item.permission_id,
        permission: item.permission_value,
      })),
    };
    await API.post("/role/v1/update_role_permission", resData, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        NotificationMessage("success", "Permission Updated Successfully");
        retrievePermissionData();
      })
      .catch((err) =>
        NotificationMessage("warning", err.response.data.message)
      );
    setIsLoading(false);
  };

  return (
    <Card className="edit-permission-card">
      <Spin spinning={isLoading}>
        <Collapse
          bordered={false}
          expandIconPosition="end"
          className="setting-main-div"
        >
          {Object.keys(permissionData).map((key) => (
            <Collapse.Panel header={key} key={key} className="setting-panel">
              <Table
                dataSource={permissionData[key]}
                columns={columns}
                pagination={false}
                bordered
              />
              <div className="edit-permission-btn-div">
                <Button
                  type="primary"
                  onClick={() => permissionSubmitHandler(permissionData[key])}
                >
                  Save
                </Button>
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </Spin>
    </Card>
  );
}

export default EditPermission;
