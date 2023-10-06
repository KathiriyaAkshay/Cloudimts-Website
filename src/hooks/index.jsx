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
import StudyNotificationProvider from "./studyNotificationContext";
import PermissionNotificationProvider from "./permissionNotificationContext";
import AuthorizationProvider from "./authorizationContext";
import BillingDataProvider from "./billingDataContext";
import StudyIdProvider from "./studyIdContext";

const index = ({ children }) => {
  return (
    <AuthorizationProvider>
      <UserPermissionProvider>
        <PermissionNotificationProvider>
          <StudyDataProvider>
            <StudyIdProvider>
              <StudyNotificationProvider>
                <BreadcrumbProvider>
                  <EditorDataProvider>
                    <UserRoleProvider>
                      <RoomDataProvider>
                        <UserEmailProvider>
                          <FilterDataProvider>
                            <BillingDataProvider>
                              <ReportDataProvider>
                                {children}
                              </ReportDataProvider>
                            </BillingDataProvider>
                          </FilterDataProvider>
                        </UserEmailProvider>
                      </RoomDataProvider>
                    </UserRoleProvider>
                  </EditorDataProvider>
                </BreadcrumbProvider>
              </StudyNotificationProvider>
            </StudyIdProvider>
          </StudyDataProvider>
        </PermissionNotificationProvider>
      </UserPermissionProvider>
    </AuthorizationProvider>
  );
};

export default index;
