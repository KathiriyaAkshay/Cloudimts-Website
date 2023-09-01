import { Outlet, useLocation } from "react-router-dom";
import BasicLayout from "../components/Header";

const RootLayout = () => {
  const location = useLocation();
  return (
    location.pathname !== "/login" && location.pathname !== '/signup' ? (
      <BasicLayout />
    ) : 
      <Outlet />
  )
}

export default RootLayout