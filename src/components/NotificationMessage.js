import { notification } from "antd";

const NotificationMessage = (
  alertType,
  alertMessage,
  description,
  duration = 3
) => {
  const _className =
    alertType === "success"
      ? "ant-alert ant-alert-success"
      : alertType === "warning"
      ? "ant-alert ant-alert-warning"
      : alertType === "information"
      ? "ant-alert ant-alert-information"
      : "ant-alert ant-alert-error";
  notification[alertType]({
    message: alertMessage,
    className: _className,
    description,
    duration: duration,
  });
};

export default NotificationMessage;
