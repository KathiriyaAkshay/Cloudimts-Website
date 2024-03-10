import { BsTrashFill } from "react-icons/bs";
import { Popconfirm, Space, Tooltip, Typography } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";

const DeleteActionIcon = ({ deleteActionHandler, title, description }) => {
  return (  
    <Space>
      <Typography.Link className="action-column">
        <Tooltip title={`Delete`}>
          <Popconfirm
            title = {title}
            description = {description}
            onConfirm={deleteActionHandler}
            icon={
              <QuestionCircleFilled
                style={{
                  color: 'red',
                }}
              />
            }
          >
            <BsTrashFill style={{ fontSize: "20px", color: "#f5473b" }} />
          </Popconfirm>
        </Tooltip>
      </Typography.Link>
    </Space>
  );
};

export default DeleteActionIcon;
