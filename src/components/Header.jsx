import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  QrcodeOutlined,
  TeamOutlined,
  ContainerOutlined,
  UserOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
  PercentageOutlined,
  PrinterOutlined,
  AppstoreOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Divider, Layout, Menu } from "antd";
import React, { useEffect, useRef, useState } from "react";
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
import logo from "../assets/images/logo-transparent-svg.svg";
import { MdOutlineHomeWork } from "react-icons/md";
import { AiOutlineUserAdd, AiOutlineDown } from "react-icons/ai";
import HeaderButton from "./HeaderButton";

const { Header, Sider, Content } = Layout;

const BasicLayout = ({ children }) => {
  const contentRef = useRef();
  const { id } = useParams();
  const [sidebrCollapsed, setSidebarCollapsed] = useState(true);
  const [role, setRole] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const [token, setToken] = useState(null);
  const { setIsModalOpen } = useBreadcrumbs();

  const navigate = useNavigate();

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

  const { pathname } = useLocation();

  const adminItems = [
    {
      key: "1",
      to: "/merchants",
      icon: <UsergroupAddOutlined />,
      title: "Merchants",
    },
  ];

  const items = [
    {
      key: "3",
      to: "/products",
      icon: <ApartmentOutlined />,
      title: "Products",
    },
    {
      key: "2",
      to: "/menu",
      icon: <QrcodeOutlined />,
      subPaths: ["/categories", "/items"],
      title: "Menu",
    },
    {
      key: "4",
      to: "/orders",
      icon: <ContainerOutlined />,
      subPaths: ["/create-orders", `/create-orders/${id}/edit`],
      title: "Orders",
    },
    {
      key: "9",
      to: "/settings",
      icon: <SettingOutlined />,
      title: "Settings",
    },
  ];

  const menuLabel = (title) => (
    <div className="display-flex-between" style={{ gap: "4px" }}>
      {title}
      <AiOutlineDown className="down-icon" />
    </div>
  );

  const menuItems = [
    {
      label: menuLabel("Institution"),
      key: "SubMenu",
      icon: <MdOutlineHomeWork />,
      children: [
        {
          label: "All Institution",
        },
        {
          label: "Create Institution",
        },
      ],
    },
    {
      label: menuLabel("Users"),
      key: "users",
      icon: <AiOutlineUserAdd />,
      children: [
        {
          label: "All Users",
        },
        {
          label: "Create Users",
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* {menu} */}
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            // backgroundColor: "#fff",
            // boxShadow: "none",
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
            <img src={logo} alt="log" className="company-logo" />
            <AppstoreOutlined
              style={{ fontSize: "24px", color: "#1677ff" }}
              onClick={() => navigate("/home")}
            />
            {/* <Breadcrumb
              separator="|"
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#fff",
                justifyContent: "center",
              }} className="header-breadcrumb"
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
            </Breadcrumb> */}
            <Divider type="vertical" className="vertical-divider" />
            <Menu
              mode="horizontal"
              theme="dark"
              items={menuItems}
              className="header-menu"
            />
            <UserProfile />
          </div>
        </Header>
        <Content
          ref={contentRef}
          className="site-layout-background"
          style={
            window.location.pathname === "/chats" ||
            window.location.pathname === `/create-orders/${id}/edit`
              ? {
                  padding: 0,
                  height: "calc(100vh - 75px)",
                  overflow: "auto",
                  overflowX: "hidden",
                  minHeight: 280,
                }
              : {
                  height: "calc(100vh - 75px)",
                  overflow: "auto",
                  overflowX: "hidden",
                  minHeight: 280,
                  paddingBottom: 20,
                }
          }
        >
          {" "}
          {window.location.pathname !== "/chats" && (
            <div className="breadcrumb-div">
              <Breadcrumb
                separator="|"
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#1a2c3e",
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
              <HeaderButton setIsModalOpen={setIsModalOpen} />
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
          {/* <Outlet /> */}
        </Content>
      </Layout>
    </Layout>
  );
};
export default BasicLayout;
