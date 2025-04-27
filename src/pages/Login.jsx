import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "../api/propertiesApi";
import { setLoginData } from "../service/localStorage";
import { useAuthContext } from "../hooks/context/AuthContext";
import { getUserDataFromToken } from "../service/JWTToken";

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await login(values);
      const { accessToken } = response.data;

      // Extraer información del usuario del token
      const { email, role, id } = getUserDataFromToken(accessToken);

      // Guardar datos de autenticación en localStorage
      setLoginData(accessToken, id, email, role);

      // Actualizar el contexto de autenticación
      setUser({ id, email, role });

      navigate("/");
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          notification.error({
            message: "Error de autenticación",
            description: "Credenciales incorrectas",
            placement: "topRight",
          });
        } else if (error.response.status === 404) {
          notification.error({
            message: "Error del servidor",
            description: "Servicio no encontrado",
            placement: "topRight",
          });
        } else {
          notification.error({
            message: "Error del servidor",
            description: `Código de error: ${error.response.status}`,
            placement: "topRight",
          });
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        notification.error({
          message: "Error de conexión",
          description: "No se pudo conectar con el servidor",
          placement: "topRight",
        });
      } else {
        // Error al configurar la petición
        notification.error({
          message: "Error",
          description: "Error al procesar la solicitud",
          placement: "topRight",
        });
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2}>Omyli Panel</Title>
            <Title level={4} type="secondary">
              Iniciar Sesión
            </Title>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu email",
                },
                {
                  type: "email",
                  message: "Por favor ingresa un email válido",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu contraseña",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Contraseña"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
              >
                Iniciar Sesión
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
