import { useEffect, useState } from "react";
import { Input, Image, Table, Tag, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { searchProperties } from "../api/propertiesApi";
import MainLayout from "../components/MainLayout";
import { standarPriceFormatter } from "../service/formatterUtils";
import "../css/properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    searchPropertiesHandler(1, searchText);
  }, []);

  const navigator = useNavigate();

  const searchPropertiesHandler = async (page, searchText) => {
    setIsLoading(true);
    const response = await searchProperties({ searchText }, page, 20);
    const properties = response.status === 200 ? response.data.items : [];
    setProperties(properties);
    setTotalPages(response.data.totalPages);
    setCurrentPage(response.data.page);
    setIsLoading(false);
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
      width: "140px",
      render: (_, record) => <Image width={90} src={record.mainImage} />,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "250px",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "precio",
      width: "180px",
      render: (_, record) => <span>{standarPriceFormatter(record.price)}</span>,
    },
    {
      title: "Dirección",
      dataIndex: "formattedAddress",
      key: "direccion",
      width: "100%",
    },
    {
      title: "Action",
      key: "action",
      width: "100px",
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
        <div className="properties__actions-container">
          <Search
            placeholder="Busca por caracteristicas o por ID del inmueble..."
            size="large"
            loading={isLoading}
            value={searchText}
            onChange={_onSearchBarChangeHandler}
            onKeyUp={_onKeyUpSearchBarHandler}
          />
        </div>
        <div className="properties__data">
          <Table
            columns={columns}
            dataSource={properties}
            loading={isLoading}
            tableLayout="fixed"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Properties;
