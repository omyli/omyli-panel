import { Card, Descriptions, Typography, Space, Avatar } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "../hooks/context/AuthContext";
import MainLayout from "../components/MainLayout";

const { Title } = Typography;

const Profile = () => {
  const { user } = useAuthContext();

  return (
    <MainLayout>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Avatar
              size={100}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <Title level={3}>Mi Perfil</Title>
          </Space>
        </Card>

        <Card>
          <Descriptions title="Información del Usuario" bordered>
            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined /> Email
                </Space>
              }
              span={3}
            >
              {user?.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined /> ID
                </Space>
              }
              span={3}
            >
              {user?.id}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <SafetyOutlined /> Rol
                </Space>
              }
              span={3}
            >
              {user?.role}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </MainLayout>
  );
};

export default Profile;
