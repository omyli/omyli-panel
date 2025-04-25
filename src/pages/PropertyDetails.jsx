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
  Space,
  Skeleton,
  Popconfirm,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty } from "../api/propertiesApi";
import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ImageUploader from "../components/ImageUploader";
import { SaveOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import "../css/propertyDetails.css";

const PropertyDetails = () => {
  const [property, setProperty] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isOpenConfirmGeneralData, setIsOpenConfirmGeneralData] =
    useState(false);
  const [isOpenConfirmLocationData, setIsOpenConfirmLocationData] =
    useState(false);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);

  const { propertyId } = useParams();
  const { TextArea } = Input;
  const [generalDataForm] = Form.useForm();
  const [locationDataForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const navigator = useNavigate();

  useEffect(() => {
    if (propertyId) {
      getPropertyByIdAsync(propertyId);
    }
  }, [propertyId]);

  const getPropertyByIdAsync = async (id) => {
    setIsLoading(true);
    const response = await getPropertyById(id);
    if (response.status === 200) {
      const propertyFromAPI = response.data;
      setProperty(propertyFromAPI);
      setImages(propertyFromAPI.images || []);
      setMainImage(propertyFromAPI.mainImage || propertyFromAPI.images?.[0]);
    }
    setIsLoading(false);
  };

  const _onFinishGeneralDataFormHandler = () => {
    const values = generalDataForm.getFieldsValue(true);
    console.log("General Form:", values);
    _updateProperty(values, "Datos generales actualizados exitosamente");
    setIsOpenConfirmGeneralData(false);
  };

  const _onFinishFormFailedHandler = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const _onFinishLocationFormHandler = () => {
    const values = locationDataForm.getFieldsValue(true);
    _updateProperty(values, "Datos de ubicación actualizados exitosamente");
    setIsOpenConfirmLocationData(false);
  };

  const _updateProperty = async (propertyUpdate, successMessage) => {
    setIsUpdateLoading(true);

    try {
      const response = await updateProperty({
        id: property.id,
        ...propertyUpdate,
      });
      if (response.status === 200) {
        setProperty(response.data);
        api.success({
          message: "Éxito",
          description: successMessage,
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Error",
        description: "Error al actualizar los datos",
        placement: "topRight",
      });
      console.log(error);
    }
    setIsUpdateLoading(false);
  };

  const handleImagesChange = (newImages, newMainImage) => {
    setImages(newImages);
    setMainImage(newMainImage);
  };

  const handleSaveImages = async (newImages, newMainImage) => {
    try {
      const fileterdImages = newImages.filter((image) => image !== mainImage);
      console.log(fileterdImages);
      const response = await updateProperty({
        id: property.id,
        images: fileterdImages,
        mainImage: newMainImage,
      });
      if (response.status === 200) {
        setProperty(response.data);
        setImages(response.data.images || []);
        setMainImage(response.data.mainImage || response.data.images?.[0]);
      }
    } catch (error) {
      console.error("Error saving images:", error);
      throw error;
    }
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
            form={generalDataForm}
            layout={"vertical"}
            initialValues={{ ...property }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
            onFinish={_onFinishGeneralDataFormHandler}
            onFinishFailed={_onFinishFormFailedHandler}
          >
            {/* ID */}
            <Form.Item label="ID" name="id">
              <Input disabled style={{ width: 220 }} />
            </Form.Item>

            {/* PRICE */}
            <Form.Item label="Precio" name="price">
              <InputNumber
                disabled={isUpdateLoading}
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
                disabled={isUpdateLoading}
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
                      disabled={isUpdateLoading}
                      style={{ width: "100%" }}
                      addonBefore={<i className="fas fa-car"></i>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={"Baños"} name="toilet">
                    <InputNumber
                      disabled={isUpdateLoading}
                      style={{ width: "100%" }}
                      addonBefore={<i className="fa-solid fa-toilet"></i>}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* METERS */}
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    label={"Metros de construcción"}
                    name="builtSquareMeters"
                  >
                    <InputNumber
                      disabled={isUpdateLoading}
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
                      disabled={isUpdateLoading}
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
                      disabled={isUpdateLoading}
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
                      disabled={isUpdateLoading}
                      options={[
                        { value: "SALE", label: "Venta" },
                        { value: "RENT", label: "Renta" },
                        { value: "INVESTMENT", label: "Inversión" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* DESCRIPTION */}
            <Form.Item label={"Descripción"} name="description">
              <TextArea
                disabled={isUpdateLoading}
                placeholder="maxLength is 6"
                rows={9}
              />
            </Form.Item>

            {/* ACTIONS */}
            <Form.Item>
              <Space>
                <Popconfirm
                  title="Confirmar guardado"
                  description={
                    <div>
                      <p>¿Estás seguro de que deseas guardar los cambios?</p>
                      <p style={{ color: "red" }}>
                        <ExclamationCircleOutlined /> Esta acción no se puede
                        deshacer
                      </p>
                    </div>
                  }
                  okText="Sí, guardar"
                  cancelText="Cancelar"
                  open={isOpenConfirmGeneralData}
                  onConfirm={_onFinishGeneralDataFormHandler}
                  okButtonProps={{ loading: isUpdateLoading }}
                  onCancel={() => {
                    setIsOpenConfirmGeneralData(false);
                  }}
                >
                  <Button
                    disabled={isUpdateLoading}
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpenConfirmGeneralData(true);
                    }}
                  >
                    Guardar
                  </Button>
                </Popconfirm>
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
            form={locationDataForm}
            style={{ maxWidth: 600 }}
            initialValues={{ ...property }}
            onFinish={_onFinishLocationFormHandler}
            onFinishFailed={_onFinishFormFailedHandler}
          >
            <Form.Item>
              <Row gutter={8}>
                <Col span={12}>
                  {/* ADDRESS */}
                  <Form.Item label="Calle" name="address">
                    <Input
                      disabled={isUpdateLoading}
                      value={property.address}
                      addonBefore={<i className="fas fa-map-marker-alt"></i>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* NEIGHBORHOOD */}
                  <Form.Item label={"Colonia"} name="neighborhood">
                    <Input
                      disabled={isUpdateLoading}
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
                      disabled={isUpdateLoading}
                      value={property.city}
                      addonBefore={<i className="fas fa-city"></i>}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {/* STATE */}
                  <Form.Item label={"Estado"} name="state">
                    <Input
                      disabled={isUpdateLoading}
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
                <Popconfirm
                  title="Confirmar guardado"
                  description={
                    <div>
                      <p>¿Estás seguro de que deseas guardar los cambios?</p>
                      <p style={{ color: "red" }}>
                        <ExclamationCircleOutlined /> Esta acción no se puede
                        deshacer
                      </p>
                    </div>
                  }
                  okText="Sí, guardar"
                  cancelText="Cancelar"
                  open={isOpenConfirmLocationData}
                  onConfirm={_onFinishLocationFormHandler}
                  okButtonProps={{ loading: isUpdateLoading }}
                  onCancel={() => {
                    setIsOpenConfirmLocationData(false);
                  }}
                >
                  <Button
                    disabled={isUpdateLoading}
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpenConfirmLocationData(true);
                    }}
                  >
                    Guardar
                  </Button>
                </Popconfirm>
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
        <div style={{ maxWidth: 800 }}>
          <Skeleton loading={isLoading} active>
            <ImageUploader
              initialImages={[mainImage, ...images]}
              initialMainImage={mainImage}
              onImagesChange={handleImagesChange}
              onSave={handleSaveImages}
            />
          </Skeleton>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      {contextHolder}
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
