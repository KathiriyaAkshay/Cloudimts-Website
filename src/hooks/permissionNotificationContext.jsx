import { createContext, useEffect, useState } from "react";
import NotificationMessage from "../components/NotificationMessage";
const BASE_URL = import.meta.env.VITE_APP_SOCKET_BASE_URL;
import { Navigate, useNavigate } from "react-router-dom";
import APIHandler from "../apis/apiHandler";

export const PermissionNotificationContext = createContext();

const PermissionNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState("");
  const role_id = localStorage.getItem("role_id");
  const user_id = localStorage.getItem("userID");
  const navigate = useNavigate();
  const [reloadValue, setReloadValue] = useState(0);

  // Total user related permission module 
  // 1. Password update - When user password that time user need to login again 
  // 2. When particular role permission update - that time particular page will reload 
  // 3. When user intitution related permission update - that time particular page will reload 

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setReloadValue(prev => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Setup socket connection
  const [connection, setConnection] = useState(null) ; 
  const SetupSocketConnection = async () => {
    if (connection && connection.readyState === WebSocket.OPEN) {
      return; // Exit the function if the connection is already open
    }

    const ws = new WebSocket(`${BASE_URL}genralUserPermission/`);
    setConnection(ws) ; 
  
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };
  
    ws.onmessage = async (event) => {  // Make the onmessage handler async
      const eventData = JSON.parse(event.data);
    
      if (eventData?.payload?.status === "update-role-permission") {
        if (eventData?.payload?.data?.role_id == role_id) {
          NotificationMessage(
            "success",
            "Role Permission was updated by management. So you have to login again"
          );
    
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
    
          // Fetch user permissions
          const responseData = await APIHandler("POST", {}, "owner/v1/user_details_fetch");
          
          if (responseData?.status) {
            // Store user's permissions in localStorage
            localStorage.setItem(
              'all_permission_id',
              JSON.stringify(responseData?.data?.all_permission_institution_id)
            );
    
            localStorage.setItem(
              'all_assign_id',
              JSON.stringify(responseData?.data?.all_assign_study_permission_institution_id)
            );
          }
    
          window.location.reload();  
          // setTimeout(() => {
          //   localStorage.clear();
          //   navigate("/login");
          // }, 3000);
        }
      } else if (eventData?.payload?.status === "Basic-details-udpate") {
        if (eventData?.payload?.data?.user_id == user_id) {
          NotificationMessage(
            "success",
            "Your basic information updated by management"
          );
        }
      } else if (eventData?.payload?.status === "Disable user") {
        if (eventData?.payload?.data?.user_id == user_id) {
          NotificationMessage(
            "success",
            "Your account is disabled by management. Please contact management for account reactivation"
          );
    
          setTimeout(() => {
            localStorage.clear();
            navigate("/login");
          }, 3000);
        }
      } else if (eventData?.payload?.status === "Update-password") {
        if (eventData?.payload?.data?.user_id == user_id) {
          NotificationMessage(
            "success",
            "Your Password is updated by management. So you have to login again"
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

  }

  useEffect(() => {
    SetupSocketConnection() ; 
  }, [role_id, reloadValue]);

  return (
    <PermissionNotificationContext.Provider value={{ notification }}>
      {children}
    </PermissionNotificationContext.Provider>
  );
};

export default PermissionNotificationProvider;
