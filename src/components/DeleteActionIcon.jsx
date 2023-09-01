import { BsTrashFill } from "react-icons/bs";
import { Popconfirm, Space, Tooltip, Typography } from "antd";

const DeleteActionIcon = ({ deleteActionHandler, title }) => {
  return (
    <Space>
      <Typography.Link className="action-column">
        <Tooltip title={title ? title : "Delete"}>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={deleteActionHandler}
          >
            <BsTrashFill style={{ fontSize: "20px", color: "#f5473b" }} />
          </Popconfirm>
        </Tooltip>
      </Typography.Link>
    </Space>
  );
};

export default DeleteActionIcon;
