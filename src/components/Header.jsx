import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Divider, Layout, Menu } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useBreadcrumbs } from "../hooks/useBreadcrumbs";
import UserProfile from "./UserProfile";
import logo from "../assets/images/Imageinet-logo.png";
import { MdDeleteSweep, MdOutlineHomeWork } from "react-icons/md";
import {
  AiOutlineUserAdd,
  AiOutlineDown,
  AiOutlineFilter,
  AiOutlinePlus,
  AiOutlineFileSync,
  AiOutlineMail,
} from "react-icons/ai";
import HeaderButton from "./HeaderButton";
import StudyFilterModal from "./StudyFilterModal";
import { getFilterList } from "../apis/studiesApi";
import { UserPermissionContext } from "../hooks/userPermissionContext";
import { FaMoneyBill, FaUserLock } from "react-icons/fa";
import { CgTemplate } from "react-icons/cg";
import { BiSupport } from "react-icons/bi";

const { Header, Sider, Content } = Layout;

const BasicLayout = ({ children }) => {
  const contentRef = useRef();
  const { id } = useParams();
  const [sidebrCollapsed, setSidebarCollapsed] = useState(true);
  const [role, setRole] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const [token, setToken] = useState(null);
  const { setIsModalOpen } = useBreadcrumbs();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const { permissionData } = useContext(UserPermissionContext);
  const [userPermissionData, setUserPermissionData] = useState({});

  useEffect(() => {
    setUserPermissionData(permissionData);
  }, [permissionData]);

  const navigate = useNavigate();

  useEffect(() => {
    retrieveFilterOptions();
  }, []);

  useEffect(() => {
    contentRef.current.scrollTo(0, 0);
  }, [children]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [role]);

  const { breadCrumbs } = useBreadcrumbs();

  const onCollapse = () => {
    setSidebarCollapsed(!sidebrCollapsed);
  };

  const retrieveFilterOptions = () => {
    getFilterList()
      .then((res) => {
        const resData = res.data.data.map((data) => ({
          label: data.filter_name,
          key: data.id,
        }));
        setFilterOptions(resData);
      })
      .catch((err) => console.log(err));
  };

  const { pathname } = useLocation();

  const menuLabel = (title) => (
    <div className="display-flex-between" style={{ gap: "4px" }}>
      {title}
      {/* <AiOutlineDown className="down-icon" /> */}
    </div>
  );

  const checkPermissionStatus = (name) => {
    const permission = userPermissionData["Menu Permission"]?.find(
      (data) => data.permission === name
    )?.permission_value;
    return permission;
  };

  const menuItems = [
    checkPermissionStatus("Show Studies option") && {
      label: <NavLink to={"/studies"}>Studies</NavLink>,
      key: "studies",
      icon: <AiOutlineFileSync color="red"/>,
    },

    checkPermissionStatus("Show Option - Institution option") && {
      label: menuLabel("Institution"),
      key: "SubMenu",
      icon: <MdOutlineHomeWork />,
      children: [
        {
          label: <NavLink to={"/institutions"}>All Institution</NavLink>,
          key: "all-institution",
        },
        {
          label: <NavLink to={"/institutions/add"}>Create Institution</NavLink>,
          key: "add-institution",
        },
      ],
    },
    checkPermissionStatus("Show Option - User option") && {
      label: menuLabel("Users"),
      key: "users",
      icon: <AiOutlineUserAdd />,
      children: [
        {
          label: <NavLink to={"/users"}>All Users</NavLink>,
          key: "all-users",
        },
        {
          label: <NavLink to={"/users/add"}>Create Users</NavLink>,
          key: "add-users",
        },
      ],
    },
    checkPermissionStatus("Show Default Filter list") && {
      label: <NavLink to={"/filters"}>Filters</NavLink>,
      key: "filters",
      icon: <AiOutlineFilter />,
    },
    checkPermissionStatus("Show Option - Role option") && {
      label: <NavLink to={"/users/roles"}>Roles</NavLink>,
      key: "roles",
      icon: <FaUserLock />,
    },
    checkPermissionStatus("Show Option - Email option") && {
      label: <NavLink to={"/users/email"}>Email</NavLink>,
      key: "email",
      icon: <AiOutlineMail />,
    },
    checkPermissionStatus("Show Option - Billing option") && {
      label: <NavLink to={"/billing"}>Billing</NavLink>,
      key: "billing",
      icon: <FaMoneyBill />,
    },
    checkPermissionStatus("Show Option - Template option") && {
      label: <NavLink to={"/reports"}>Templates</NavLink>,
      key: "templates",
      icon: <CgTemplate />,
    },
    userPermissionData["StudyTable view"]?.find(
      (data) => data.permission === "View Deleted studies"
    )?.permission_value && {
      label: <NavLink to={"/deleted-studies"}>Deleted Studies</NavLink>,
      key: "deletedStudy",
      icon: <MdDeleteSweep />,
    },
    {
      label: <NavLink to={"/support"}>Support</NavLink>,
      key: "support",
      icon: <BiSupport />,
    },
  ].filter(Boolean);

  const menu = (
    <Sider
      className="sidebar-wrapper"
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
    >
      <Link to="/home">

        <div className="logo sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>
      
      </Link>
      
      <div className="sidebar-menu-wrap" style={{ overflow: "hidden" }}>
        <Menu
          mode="inline"
          theme="light"
          items={menuItems}
          className="header-menu"
        />
      </div>
    
    </Sider>
  );

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        {menu}
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              backgroundColor: "#fff",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                
              }}
              className="header-menu-icon"
            >
              {/* <img src={logo} alt="log" className="company-logo" /> */}
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
              <AppstoreOutlined
                style={{ fontSize: "24px", color: "#000000b4" }}
                onClick={() => navigate("/dashboard")}
              />
              <Divider type="vertical" className="vertical-divider" />
              <Breadcrumb
                separator="|"
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#fff",
                  justifyContent: "center",
                }}
                className="header-breadcrumb"
              >
                {breadCrumbs.length > 0 &&
                  breadCrumbs.map((crumb, index) => (
                    <Breadcrumb.Item key={index}>
                      {crumb.to ? (
                        <Link to={crumb.to} title={crumb.name}>
                          {crumb.name}
                        </Link>
                      ) : (
                        crumb.name
                      )}
                    </Breadcrumb.Item>
                  ))}
              </Breadcrumb>
              <UserProfile />
            </div>
          </Header>
          <Content
            ref={contentRef}
            className="site-layout-background"
            style={
              window.location.pathname === "/chats" ||
              window.location.pathname === "/dashboard" ||
              window.location.pathname === `/create-orders/${id}/edit` ||
              window.location.pathname === `/reports/${id}`
                ? {
                    padding: 0,
                    height: "calc(100vh - 75px)",
                    overflow: "hidden",
                    overflowX: "hidden",
                    minHeight: 280,
                  }
                : {
                    height: "calc(100vh - 75px)",
                    overflow: "hidden",
                    overflowX: "hidden",
                    minHeight: 280,
                    paddingBottom: 20,
                  }
            }
          >
            {" "}
            {window.location.pathname !== "/chats" &&
              window.location.pathname !== "/dashboard" && (
                <div className="breadcrumb-div">
                  <HeaderButton
                    setIsModalOpen={setIsModalOpen}
                    id={id}
                    filterOptions={filterOptions}
                    retrieveFilterOptions={retrieveFilterOptions}
                  />
                </div>
              )}
            <div
              style={
                window.location.pathname !== "/chats"
                  ? {
                      padding: "0px 35px 35px 35px",
                    }
                  : { padding: "0px" }
              }
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>

      <StudyFilterModal
        isFilterModalOpen={isFilterModalOpen}
        setIsFilterModalOpen={setIsFilterModalOpen}
        retrieveFilterOptions={retrieveFilterOptions}
      />
      
    </>
  );
};
export default BasicLayout;
