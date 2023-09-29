import { createContext, useEffect, useState } from "react";
import { fetchPermissions } from "../apis/studiesApi";
import { Spin } from "antd";

export const UserPermissionContext = createContext();

const UserPermissionProvider = ({ children }) => {
  const [permissionData, setPermissionData] = useState({});
  const role_id = localStorage.getItem("role_id");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    setIsLoading(true);
    fetchPermissions({ role_id })
      .then((res) => {
        setPermissionData(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [role_id]);

  if (isLoading) {
    return (
      <Spin tip="Loading">
        <div className="spin-dummy-data" />
      </Spin>
    );
  }
  console.log(permissionData);

  return (
    <UserPermissionContext.Provider value={{ permissionData }}>
      {children}
    </UserPermissionContext.Provider>
  );
};

export default UserPermissionProvider;
