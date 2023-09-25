import React from "react";
import BreadcrumbProvider from "./breadcrumbContext";
import UserRoleProvider from "./usersRolesContext";
import UserEmailProvider from "./userEmailContext";
import FilterDataProvider from "./filterDataContext";
import RoomDataProvider from "./roomDataContext";
import EditorDataProvider from "./editorDataContext";
import ReportDataProvider from "./reportDataContext";
import UserPermissionProvider from "./userPermissionContext";
import StudyDataProvider from "./studyDataContext";

const index = ({ children }) => {
  return (
    <UserPermissionProvider>
      <BreadcrumbProvider>
        <EditorDataProvider>
          <UserRoleProvider>
            <RoomDataProvider>
              <UserEmailProvider>
                <FilterDataProvider>
                  <ReportDataProvider>
                    <StudyDataProvider>{children}</StudyDataProvider>
                  </ReportDataProvider>
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
