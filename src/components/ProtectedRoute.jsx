import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserPermissionContext } from "../hooks/userPermissionContext";

const ProtectedRoute = ({ path, children, inx, ...rest }) => {
  const { id } = useParams();
  const { permissionData } = useContext(UserPermissionContext);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    handlePermissions();
  }, [path]);

  const handlePermissions = () => {
    if (path === "/institutions") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "Institution list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/institutions-logs") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "All Institution logs list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/institutions/add") {
      const permission =
        permissionData["Other option permission"] &&
        permissionData["Other option permission"].find(
          (data) => data.permission === "Create New Institution"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/users") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "User list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/users-logs") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "All User logs list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/users/add") {
      const permission =
        permissionData["Other option permission"] &&
        permissionData["Other option permission"].find(
          (data) => data.permission === "Create New User"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/users/roles") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "Role list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/users/email") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "Email list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/studies") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "Study list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/chats") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "Chat page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/reports") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "Report list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/reports/add") {
      const permission =
        permissionData["Other option permission"] &&
        permissionData["Other option permission"].find(
          (data) => data.permission === "Create New Template"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/filters") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "Filter list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    } else if (path === "/role-logs") {
      const permission =
        permissionData["Pages permission"] &&
        permissionData["Pages permission"].find(
          (data) => data.permission === "All Role logs list page"
        )?.permission_value;
      setIsAuthenticated(permission);
    }
  };

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/not-found" replace={true} />
  );
};

export default ProtectedRoute;
