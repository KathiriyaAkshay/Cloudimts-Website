import { createContext, useEffect, useState } from "react";
import NotificationMessage from "../components/NotificationMessage";
const BASE_URL = import.meta.env.VITE_APP_SOCKET_BASE_URL;
import { Navigate, useNavigate } from "react-router-dom";

export const PermissionNotificationContext = createContext();

const PermissionNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState("");
  const role_id = localStorage.getItem("role_id");
  const user_id = localStorage.getItem("userID");
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket(`${BASE_URL}genralUserPermission/`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData?.payload?.status === "update-role-permission") {
        if (eventData?.payload?.data?.role_id == role_id) {
          NotificationMessage("success", "Role Permission was updated");

          setTimeout(() => {
            localStorage.clear();
            navigate("/login");
          }, 3000);
        }
      } else if (eventData?.payload?.status === "institution-details-update") {
        if (eventData?.payload?.data?.user_id == user_id) {
          NotificationMessage(
            "success",
            "Your Institution access permission updated by management. So you have to login again"
          );

          setTimeout(() => {
            localStorage.clear();
            navigate("/login");
          }, 3000);
        }
      } else if (eventData?.payload?.status === "Basic-details-udpate") {
        if (eventData?.payload?.data?.user_id == user_id) {
          NotificationMessage(
            "success",
            "Your basic information updated by management"
          );
        }
      } else if (eventData?.payload?.status === "Disable-user") {
        if (eventData?.payload?.data?.user_id == user_id) {
          NotificationMessage(
            "success",
            "Your account is disabled by management. Please contact to management for active account"
          );

          setTimeout(() => {
            localStorage.clear();
            navigate("/login");
          }, 3000);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [role_id]);

  return (
    <PermissionNotificationContext.Provider value={{ notification }}>
      {children}
    </PermissionNotificationContext.Provider>
  );
};

export default PermissionNotificationProvider;
