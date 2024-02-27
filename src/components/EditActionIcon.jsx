import { useState, useEffect } from "react";
import { Space, Tooltip, Typography } from "antd";
import { FaEdit } from "react-icons/fa";

const EditActionIcon = ({ editActionHandler, assign_user}) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
  }, []);

  return (
    <Space>
      <Typography.Link onClick={editActionHandler} 
        className="action-column">
        <Tooltip title={`Edit study`}>
          <FaEdit className="action-icon"/>
        </Tooltip>
      </Typography.Link>
    </Space>
  );
};

export default EditActionIcon;
