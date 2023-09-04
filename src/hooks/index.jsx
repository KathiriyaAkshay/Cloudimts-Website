import React from "react";
import BreadcrumbProvider from "./breadcrumbContext";
import UserRoleProvider from "./usersRolesContext";
import UserEmailProvider from "./userEmailContext";
import FilterDataProvider from "./filterDataContext";
import RoomDataProvider from "./roomDataContext";

const index = ({ children }) => {
  return (
    <BreadcrumbProvider>
      <UserRoleProvider>
        <RoomDataProvider>
          <UserEmailProvider>
            <FilterDataProvider>{children}</FilterDataProvider>
          </UserEmailProvider>
        </RoomDataProvider>
      </UserRoleProvider>
    </BreadcrumbProvider>
  );
};

export default index;
