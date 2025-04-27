import { Avatar, Dropdown, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuthContext } from "../hooks/context/AuthContext";
import { removeLoginData } from "../service/localStorage";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const UserMenu = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeLoginData();
    navigate("/auth");
  };

  const items = [
    {
      key: "1",
      label: (
        <Space>
          <UserOutlined />
          <Text>Mi Perfil</Text>
        </Space>
      ),
      onClick: () => navigate("/perfil"),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <Space>
          <LogoutOutlined />
          <Text>Cerrar Sesión</Text>
        </Space>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown
      style={{ marginRigth: 25 }}
      menu={{ items }}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <Space style={{ cursor: "pointer", padding: "0 16px", marginRight: 24 }}>
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff" }}
        />
        <Text strong>{user?.email}</Text>
      </Space>
    </Dropdown>
  );
};

export default UserMenu;
