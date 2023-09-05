import React from "react";
import BreadcrumbProvider from "./breadcrumbContext";
import UserRoleProvider from "./usersRolesContext";
import UserEmailProvider from "./userEmailContext";
import FilterDataProvider from "./filterDataContext";
import RoomDataProvider from "./roomDataContext";
import EditorDataProvider from "./editorDataContext";

const index = ({ children }) => {
  return (
    <BreadcrumbProvider>
      <EditorDataProvider>
        <UserRoleProvider>
          <RoomDataProvider>
            <UserEmailProvider>
              <FilterDataProvider>{children}</FilterDataProvider>
            </UserEmailProvider>
          </RoomDataProvider>
        </UserRoleProvider>
      </EditorDataProvider>
    </BreadcrumbProvider>
  );
};

export default index;
