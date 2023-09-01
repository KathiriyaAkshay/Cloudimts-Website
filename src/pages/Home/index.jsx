import {
  ApartmentOutlined,
  ContainerOutlined,
  PercentageOutlined,
  PrinterOutlined,
  QrcodeOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Card, Col, List, Row } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

const Home = () => {
  const [role, setRole] = useState("");
  const { changeBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    changeBreadcrumbs([{ name: "Home" }]);
    // setRole(localStorage.getItem("role"))
  }, []);

  const adminData = [
    {
        title: "Merchants",
        icon: <UsergroupAddOutlined />,
        link: "/merchants",
    }
  ]

  const data = [
    {
      title: "Products",
      icon: <ApartmentOutlined />,
      link: "/products",
    },
    {
      title: "Menu",
      icon: <QrcodeOutlined />,
      link: "/menu",
    },
    {
      title: "Orders",
      icon: <ContainerOutlined />,
      link: "/orders",
    },
    {
      title: "Settings",
      icon: <SettingOutlined />,
      link: "/settings",
    },
    // {
    //   title: "Discounts",
    //   icon: <PercentageOutlined />,
    //   link: "/discounts",
    // },
    // {
    //   title: "Printers",
    //   icon: <PrinterOutlined />,
    //   link: "/printers",
    // },
    // {
    //   title: "Staff",
    //   icon: <UserOutlined />,
    //   link: "/staff",
    // },
  ];
  return (
    <Card>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 6,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item className="dashboard-card">
            <Link to={item.link}>
              <Card>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    {item.icon}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} className="card-heading">
                    {item.title}
                  </Col>
                </Row>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Home;
