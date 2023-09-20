import React from "react";
import BreadcrumbProvider from "./breadcrumbContext";
import UserRoleProvider from "./usersRolesContext";
import UserEmailProvider from "./userEmailContext";
import FilterDataProvider from "./filterDataContext";
import RoomDataProvider from "./roomDataContext";
import EditorDataProvider from "./editorDataContext";
import ReportDataProvider from "./reportDataContext";
import UserPermissionProvider from "./userPermissionContext";

const index = ({ children }) => {
  return (
    <UserPermissionProvider>
      <BreadcrumbProvider>
        <EditorDataProvider>
          <UserRoleProvider>
            <RoomDataProvider>
              <UserEmailProvider>
                <FilterDataProvider>
                  <ReportDataProvider>{children}</ReportDataProvider>
                </FilterDataProvider>
              </UserEmailProvider>
            </RoomDataProvider>
          </UserRoleProvider>
        </EditorDataProvider>
      </BreadcrumbProvider>
    </UserPermissionProvider>
  );
};

export default index;
