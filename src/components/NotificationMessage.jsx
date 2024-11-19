import { notification } from "antd";

const NotificationMessage = (
  alertType,
  alertMessage,
  description,
  duration, 
  placement 
) => {
  const _className =
    alertType === "success"
      ? "ant-alert ant-alert-success"
      : alertType === "warning"
      ? "ant-alert ant-alert-warning"
      : alertType === "information"
      ? "ant-alert ant-alert-information"
      : alertType === "important"
      ? "ant-alert ant-alert-important"
      : "ant-alert ant-alert-error";
  alertType=alertType==="important"?"warning":alertType;    
  notification[alertType]({
    message: alertMessage,
    className: _className,
    description,
    duration: duration === undefined ?3:duration > 5?2:duration,
    placement : placement === undefined ?"topRight": placement
  });
};

export default NotificationMessage;
