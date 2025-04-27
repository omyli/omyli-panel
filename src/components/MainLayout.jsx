import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import UserMenu from "./UserMenu";
const { Header, Sider, Content } = Layout;

import "../css/layout.css";

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("/");

  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith("/perfil")) {
      setSelectedTab("/perfil");
    } else if (path.startsWith("/")) {
      setSelectedTab("/");
    }
  }, []);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const _onClickHandler = (e) => {
    navigate(e.key);
  };

  const menuTabs = [
    {
      key: "/perfil",
      icon: <UserOutlined />,
      label: "Perfil",
    },
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Propiedades",
    },
  ];

  return (
    <Layout className="layout-container">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="demo-logo-vertical"
          style={{ backgroundColor: "rgb(0 21 41)" }}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedTab]}
          items={menuTabs}
          onClick={_onClickHandler}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <UserMenu />
        </Header>
        <Content
          className="content-scrollable"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            height: "100%",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
