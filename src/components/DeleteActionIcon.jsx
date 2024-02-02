import { BsTrashFill } from "react-icons/bs";
import { Popconfirm, Space, Tooltip, Typography } from "antd";

const DeleteActionIcon = ({ deleteActionHandler, title, assign_user }) => {
  return (
    <Space>
      <Typography.Link className="action-column">
        <Tooltip title={`${assign_user !== null && assign_user !== undefined?`${assign_user} =>`:""} Delete`}>
          <Popconfirm
            title = {title}
            onConfirm={deleteActionHandler}
            onCancel={() => {console.log("Cancel study model");}}
          >
            <BsTrashFill style={{ fontSize: "20px", color: "#f5473b" }} />
          </Popconfirm>
        </Tooltip>
      </Typography.Link>
    </Space>
  );
};

export default DeleteActionIcon;
