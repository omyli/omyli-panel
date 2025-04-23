import { useEffect, useState } from "react";
import {
  Divider,
  Button,
  InputNumber,
  Input,
  Select,
  Form,
  Row,
  Col,
  Collapse,
  message,
  Upload,
  Image,
  Space,
  Skeleton,
} from "antd";
import { useNavigate } from "react-router-dom";
import { getPropertyById } from "../api/propertiesApi";
import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { InboxOutlined } from "@ant-design/icons";
import "../css/propertyDetails.css";

const PropertyDetails = () => {
  const [property, setProperty] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { propertyId } = useParams();
  const { TextArea } = Input;
  const { Dragger } = Upload;

  const navigator = useNavigate();

  useEffect(() => {
    if (propertyId) {
      getPropertyByIdAsync(propertyId);
    }
  }, []);

  const getPropertyByIdAsync = async (id) => {
    setIsLoading(true);
    const response = await getPropertyById(id);
    if (response.status === 200) {
      const propertyFromAPI = response.data;
      setProperty(propertyFromAPI);
    }
    setIsLoading(false);
  };

  const _onFinishGeneralDataFormHandler = (values) => {
    console.log("General Form:", values);
  };

  const _onFinishFormFailedHandler = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const _onFinishUbicationFormHandler = (values) => {
    console.log("Ubication Form:", values);
  };

  const props = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const items = [
    {
      key: "1",
      label: (
        <strong style={{ color: "rgba(0, 0, 0, 0.88)" }}>
          Datos Generales
        </strong>
      ),
      children: (
        <Skeleton loading={isLoading} active>
          <Form
            layout={"vertical"}
            initialValues={{ ...property }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
            onFinish={_onFinishGeneralDataFormHandler}
            onFinishFailed={_onFinishFormFailedHandler}
          >
            {/* <Title level={3}>Datos Generales</Title> */}
            {/* ID */}
            <Form.Item label="ID" name="id">
              <Input disabled style={{ width: 220 }} />
            </Form.Item>

            {/* PRICE */}
            <Form.Item label="Precio" name="price">
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                style={{ width: "100%" }}
                addonBefore="$"
                addonAfter="MXN"
              />
            </Form.Item>

            {/* BEDROOM */}
            <Form.Item label="Habitaciones" name="bedroom">
              <InputNumber
                addonBefore={<i className="fas fa-bed"></i>}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* TOILED AND PARKING */}
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label={"Estacionamiento"} name="parking">
                    <InputNumber
                      style={{ width: "100%" }}
                      addonBefore={<i className="fas fa-car"></i>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"Baños"} name="toilet">
                    <InputNumber
                      style={{ width: "100%" }}
                      addonBefore={<i className="fa-solid fa-toilet"></i>}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* METTERS */}
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    label={"Metros de construcción"}
                    name="builtSquareMeters"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      addonAfter="m²"
                      addonBefore={<i className="fas fa-ruler-combined"></i>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={"Metros de terreno"}
                    name="landSquareMeters"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      addonAfter="m²"
                      addonBefore={<i className="fas fa-vector-square"></i>}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* TYPE AND STATUS */}
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label={"Tipo"} name="type">
                    <Select
                      options={[
                        { value: "HOUSE", label: "Casa" },
                        { value: "APARTMENT", label: "Departamento" },
                        { value: "LAND", label: "Terreno" },
                        { value: "COMMERCIAL", label: "Comercial" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"Estatus"} name="status">
                    <Select
                      options={[
                        { value: "SALE", label: "Venta" },
                        { value: "RENT", label: "Renta" },
                        { value: "INVESTMENT", label: "inversión" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* DESCRIPTION */}
            <Form.Item label={"Descripción"} name="description">
              <TextArea placeholder="maxLength is 6" rows={5} />
            </Form.Item>

            {/* ACTIONS */}
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
                <Button htmlType="button" onClick={() => {}}>
                  Restaurar valores actuales
                </Button>
              </Space>
            </Form.Item>
            <Divider />
          </Form>
        </Skeleton>
      ),
    },
    {
      key: "2",
      label: (
        <strong style={{ color: "rgba(0, 0, 0, 0.88)" }}>Ubicación</strong>
      ),
      children: (
        <Skeleton loading={isLoading} active>
          <Form
            layout={"vertical"}
            style={{ maxWidth: 600 }}
            initialValues={{ ...property }}
            onFinish={_onFinishUbicationFormHandler}
            onFinishFailed={_onFinishFormFailedHandler}
          >
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  {/* ADDRESS */}
                  <Form.Item label="Calle" name="address">
                    <Input
                      value={property.address}
                      addonBefore={<i className="fas fa-map-marker-alt"></i>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* NEIGHBORHOOD */}
                  <Form.Item label={"Colonia"} name="neighborhood">
                    <Input
                      value={property.neighborhood}
                      addonBefore={<i className="fas fa-home"></i>}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  {/* CITY */}
                  <Form.Item label={"Ciudad"} name="city">
                    <Input
                      value={property.city}
                      addonBefore={<i className="fas fa-city"></i>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* STATE */}
                  <Form.Item label={"Estado"} name="state">
                    <Input
                      value={property.state}
                      addonBefore={<i className="fas fa-flag"></i>}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* ACTIONS */}
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
                <Button htmlType="button" onClick={() => {}}>
                  Restaurar valores actuales
                </Button>
              </Space>
            </Form.Item>
            <Divider />
          </Form>
        </Skeleton>
      ),
    },
    {
      key: "3",
      label: (
        <strong style={{ color: "rgba(0, 0, 0, 0.88)" }}>Multimedia</strong>
      ),
      children: (
        <div style={{ maxWidth: 600 }}>
          <Skeleton loading={isLoading} active>
            <Dragger style={{ maxWidth: 600 }} {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>

            <Divider />
            <p>Imagen principal</p>
            <Image
              width={200}
              height={200}
              style={{ marginButto: 25, marginRight: 25 }}
              src={property.mainImage}
            />
            {property?.images?.map((image, key) => (
              <Image
                key={key}
                width={200}
                height={200}
                style={{ marginButto: 25, marginRight: 25 }}
                src={image}
              />
            ))}
            <Divider />
          </Skeleton>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <Space direction="vertical">
        <Button
          onClick={() => {
            navigator("/");
          }}
        >
          Regresar
        </Button>
        <Collapse defaultActiveKey={["1", "2", "3"]} ghost items={items} />
      </Space>
    </MainLayout>
  );
};

export default PropertyDetails;
