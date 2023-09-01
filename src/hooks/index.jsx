import React from "react";
import BreadcrumbProvider from "./breadcrumbContext";
import UserRoleProvider from "./usersRolesContext";
import UserEmailProvider from "./userEmailContext";

const index = ({ children }) => {
  return (
    <BreadcrumbProvider>
      <UserRoleProvider>
        <UserEmailProvider>{children}</UserEmailProvider>
      </UserRoleProvider>
    </BreadcrumbProvider>
  );
};

export default index;
