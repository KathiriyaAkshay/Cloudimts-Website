import React, { useContext } from "react";
import Loader from "../components/Loader";

const Home = React.lazy(() => import("../pages/Home"));
const Roles = React.lazy(() => import("../pages/Users/Roles"));
const Institution = React.lazy(() => import("../pages/Institution"));
const InstitutionLogs = React.lazy(() =>
  import("../pages/Institution/InstitutionLogs")
);
const AddInstitution = React.lazy(() =>
  import("../pages/Institution/AddInstitution")
);
const Email = React.lazy(() => import("../pages/Email"));
const EditPermission = React.lazy(() =>
  import("../pages/Users/EditPermission")
);
const Users = React.lazy(() => import("../pages/Users"));
const AddUsers = React.lazy(() => import("../pages/Users/AddUsers"));
const NotFound = React.lazy(() => import("../components/NotFound"));
const Dicom = React.lazy(() => import("../pages/Dicom"));
const IOD = React.lazy(() => import("../pages/IOD"));
const Chats = React.lazy(() => import("../pages/Chats"));
const StudyLogs = React.lazy(() => import("../pages/Dicom/StudyLogs"));
const UsersLogs = React.lazy(() => import("../pages/Users/UsersLogs"));
const Reports = React.lazy(() => import("../pages/Reports"));
const AddReport = React.lazy(() => import("../pages/Reports/AddReport"));
const AddTemplate = React.lazy(() => import("../pages/Reports/AddTemplate"));
const Filters = React.lazy(() => import("../pages/Filters"));
const Billing = React.lazy(() => import("../pages/Billing"));

export const routes = [
  { path: "/dashboard", component: <Loader component={Home} /> },
  { path: "/not-found", component: <Loader component={NotFound} /> },
  { path: "/institutions", component: <Loader component={Institution} /> },
  {
    path: "/institutions-logs",
    component: <Loader component={InstitutionLogs} />,
  },
  {
    path: "/institutions/add",
    component: <Loader component={AddInstitution} />,
  },
  {
    path: "/institutions/:id/edit",
    component: <Loader component={AddInstitution} />,
  },
  { path: "/users", component: <Loader component={Users} /> },
  { path: "/users/add", component: <Loader component={AddUsers} /> },
  { path: "/users/:id/edit", component: <Loader component={AddUsers} /> },
  { path: "/users/roles", component: <Loader component={Roles} /> },
  {
    path: "/users/roles/:id/permissions",
    component: <Loader component={EditPermission} />,
  },
  { path: "/users/email", component: <Loader component={Email} /> },
  { path: "/studies", component: <Loader component={Dicom} /> },
  { path: "/iod-settings", component: <Loader component={IOD} /> },
  { path: "/chats", component: <Loader component={Chats} /> },
  { path: "/study-logs", component: <Loader component={StudyLogs} /> },
  { path: "/users-logs", component: <Loader component={UsersLogs} /> },
  { path: "/reports/:id", component: <Loader component={AddReport} /> },
  { path: "/reports/add", component: <Loader component={AddTemplate} /> },
  { path: "/reports/:id/edit", component: <Loader component={AddTemplate} /> },
  { path: "/reports", component: <Loader component={Reports} /> },
  { path: "/filters", component: <Loader component={Filters} /> },
  { path: "/billing", component: <Loader component={Billing} /> },
];

export const superadminRoute = [
  { path: "/home", component: <Loader component={Home} /> },
];
