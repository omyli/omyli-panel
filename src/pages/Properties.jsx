import { useEffect, useState } from "react";
import {
  Input,
  Image,
  Table,
  Tag,
  Button,
  Space,
  Flex,
  Card,
  notification,
} from "antd";
import { EyeOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { searchProperties, syncProperties } from "../api/propertiesApi";
import MainLayout from "../components/MainLayout";
import { standarPriceFormatter } from "../service/formatterUtils";
import "../css/properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingToSyncProperties, setPendingToSyncProperties] = useState(0);

  useEffect(() => {
    searchPropertiesHandler(1, searchText);
  }, []);

  useEffect(() => {
    const fileterdProperties = properties.filter(
      (property) => property.pendingSync
    );
    setPendingToSyncProperties(fileterdProperties.length);
  }, [properties, properties.length]);

  const navigator = useNavigate();

  const searchPropertiesHandler = async (page, searchText) => {
    setIsLoading(true);
    const response = await searchProperties({ searchText }, page, 200);
    const properties = response.status === 200 ? response.data.items : [];
    setProperties(properties);
    setIsLoading(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Implementar la lógica de sincronización
      const response = await syncProperties();
      if (response.status === 200) {
        const syncProeprties = response.data.properties;
        if (syncProeprties > 0) {
          notification.success({
            message: "Sincronización iniciada",
            description: `Se inicio la sincrionización de ${syncProeprties} propiedades, en un momento las veras en tu pagina`,
            placement: "topRight",
          });
        } else {
          notification.info({
            message: "Todas las propiedades ya estan sincronizadas",
            description: `Parece que todas las propiedades ya estan sincronizadas. Si no ves las propiedades en tu pagina espera un momento, el proceso puede tardar un poco.`,
            placement: "topRight",
          });
        }
      } else {
        notification.error({
          message: "Error en la sincronización",
          description: "No se pudieron actualizar las propiedades",
          placement: "topRight",
        });
      }
      searchPropertiesHandler(1, searchText); // Recargar las propiedades
    } catch (error) {
      notification.error({
        message: "Error en la sincronización",
        description: "No se pudieron actualizar las propiedades: " + error,
        placement: "topRight",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const _onSearchBarChangeHandler = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const _onKeyUpSearchBarHandler = (e) => {
    if (e.key === "Enter") {
      searchPropertiesHandler(1, searchText);
    }
  };

  const { Search } = Input;

  const columns = [
    {
      title: "Imagen",
      dataIndex: "mainImage",
      key: "mainImage",
      width: "40px",
      render: (_, record) => <Image width={55} src={record.mainImage} />,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "150px",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "precio",
      width: "170px",
      render: (_, record) => <span>{standarPriceFormatter(record.price)}</span>,
    },
    {
      title: "Dirección",
      dataIndex: "formattedAddress",
      key: "direccion",
      width: "520px",
    },
    {
      title: "Action",
      key: "action",
      width: "20px",
      render: (_, record) => (
        <Button
          type="default"
          shape="circle"
          icon={<EyeOutlined />}
          size={"large"}
          onClick={() => {
            navigator("propiedades/" + record.id);
          }}
        />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="properties-container">
        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div className="properties__actions-container">
              <Flex gap="middle" align="center">
                <Search
                  placeholder="Busca por caracteristicas o por ID del inmueble..."
                  size="large"
                  loading={isLoading}
                  value={searchText}
                  onChange={_onSearchBarChangeHandler}
                  onKeyUp={_onKeyUpSearchBarHandler}
                  style={{ flex: 1 }}
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => navigator("/propiedades/nueva")}
                />
              </Flex>
              <Flex
                justify="flex-start"
                vertical={true}
                style={{ marginTop: 16 }}
              >
                <Button
                  type="default"
                  danger={pendingToSyncProperties > 0}
                  icon={<SyncOutlined />}
                  loading={isSyncing}
                  onClick={handleSync}
                  style={{ width: 225 }}
                >
                  {pendingToSyncProperties > 0
                    ? `Sincronizar Propiedades: ${pendingToSyncProperties}`
                    : `Sincronizar propiedades`}
                </Button>
              </Flex>
            </div>
            <div className="properties__data">
              <Table
                columns={columns}
                dataSource={properties.map((property) => ({
                  key: property.id,
                  ...property,
                }))}
                loading={isLoading}
                tableLayout="fixed"
                pagination={{ pageSize: 10 }}
                scroll={{ x: "max-content" }}
              />
            </div>
          </Space>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Properties;
