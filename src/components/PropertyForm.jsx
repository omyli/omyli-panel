import { useState, useEffect } from "react";
import {
  Divider,
  Button,
  InputNumber,
  Input,
  Select,
  Form,
  Row,
  Col,
  Space,
  Popconfirm,
  notification,
  Collapse,
  Alert,
} from "antd";
import {
  SaveOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ImageUploader from "./ImageUploader";

const { TextArea } = Input;

const PropertyForm = ({
  initialValues = {},
  onSave,
  isUpdateLoading = false,
  isNewProperty = false,
}) => {
  const [generalDataForm] = Form.useForm();
  const [locationDataForm] = Form.useForm();
  const [images, setImages] = useState(initialValues.images || []);
  const [mainImage, setMainImage] = useState(initialValues.mainImage || null);
  const [isOpenConfirmGeneralData, setIsOpenConfirmGeneralData] =
    useState(false);
  const [isOpenConfirmLocationData, setIsOpenConfirmLocationData] =
    useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    generalDataForm.setFieldsValue(initialValues);
    locationDataForm.setFieldsValue(initialValues);
  }, [initialValues, generalDataForm, locationDataForm]);

  const handleImagesChange = (newImages, newMainImage) => {
    setImages(newImages);
    setMainImage(newMainImage);
  };

  const handleSaveImages = async (newImages, newMainImage) => {
    try {
      const filteredImages = newImages.filter((image) => image !== mainImage);
      await onSave({
        images: filteredImages,
        mainImage: newMainImage,
      });
    } catch (error) {
      console.error("Error saving images:", error);
      throw error;
    }
  };

  const _onFinishGeneralDataFormHandler = () => {
    const values = generalDataForm.getFieldsValue(true);
    if (isNewProperty) {
      const locationValues = locationDataForm.getFieldsValue(true);
      const filteredImages = images.filter((image) => image !== mainImage);
      _updateProperty(
        {
          ...values,
          ...locationValues,
          images: filteredImages,
          mainImage: mainImage,
        },
        "Propiedad creada exitosamente"
      );
    } else {
      _updateProperty(values, "Datos generales actualizados exitosamente");
    }
    setIsOpenConfirmGeneralData(false);
  };

  const _onFinishLocationFormHandler = () => {
    const values = locationDataForm.getFieldsValue(true);
    _updateProperty(values, "Datos de ubicación actualizados exitosamente");
    setIsOpenConfirmLocationData(false);
  };

  const _updateProperty = async (propertyUpdate, successMessage) => {
    try {
      await onSave(propertyUpdate);
      api.success({
        message: "Éxito",
        description: successMessage,
        placement: "topRight",
      });
    } catch (error) {
      api.error({
        message: "Error",
        description: "Error al actualizar los datos",
        placement: "topRight",
      });
      console.log(error);
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
        <Form
          form={generalDataForm}
          layout={"vertical"}
          initialValues={initialValues}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          onFinish={_onFinishGeneralDataFormHandler}
        >
          {/* ID */}
          {!isNewProperty && (
            <Form.Item label="ID" name="id">
              <Input disabled style={{ width: 220 }} />
            </Form.Item>
          )}

          {/* PRICE */}
          <Form.Item
            label="Precio"
            name="price"
            rules={[{ required: true, message: "Por favor ingresa el precio" }]}
          >
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
          <Form.Item
            label="Habitaciones"
            name="bedroom"
            rules={[
              {
                required: true,
                message: "Por favor ingresa el número de habitaciones",
              },
            ]}
          >
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
                <Form.Item
                  label={"Estacionamiento"}
                  name="parking"
                  rules={[
                    {
                      required: true,
                      message:
                        "Por favor ingresa el número de estacionamientos",
                    },
                  ]}
                >
                  <InputNumber
                    disabled={isUpdateLoading}
                    style={{ width: "100%" }}
                    addonBefore={<i className="fas fa-car"></i>}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Baños"}
                  name="toilet"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa el número de baños",
                    },
                  ]}
                >
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
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa los metros de construcción",
                    },
                  ]}
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
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa los metros de terreno",
                    },
                  ]}
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
                <Form.Item
                  label={"Tipo"}
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: "Por favor selecciona el tipo de propiedad",
                    },
                  ]}
                >
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
                <Form.Item
                  label={"Estatus"}
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Por favor selecciona el estatus",
                    },
                  ]}
                >
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
          <Form.Item
            label={"Descripción"}
            name="description"
            rules={[
              { required: true, message: "Por favor ingresa una descripción" },
            ]}
          >
            <TextArea
              disabled={isUpdateLoading}
              placeholder="Ingresa una descripción detallada de la propiedad"
              rows={9}
            />
          </Form.Item>

          {/* ACTIONS */}
          {!isNewProperty && (
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
          )}
          <Divider />
        </Form>
      ),
    },
    {
      key: "2",
      label: (
        <strong style={{ color: "rgba(0, 0, 0, 0.88)" }}>Ubicación</strong>
      ),
      children: (
        <Form
          layout={"vertical"}
          form={locationDataForm}
          style={{ maxWidth: 600 }}
          initialValues={initialValues}
          onFinish={_onFinishLocationFormHandler}
        >
          <Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                {/* ADDRESS */}
                <Form.Item
                  label="Calle"
                  name="address"
                  rules={[
                    { required: true, message: "Por favor ingresa la calle" },
                  ]}
                >
                  <Input
                    disabled={isUpdateLoading}
                    addonBefore={<i className="fas fa-map-marker-alt"></i>}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* NEIGHBORHOOD */}
                <Form.Item
                  label={"Colonia"}
                  name="neighborhood"
                  rules={[
                    { required: true, message: "Por favor ingresa la colonia" },
                  ]}
                >
                  <Input
                    disabled={isUpdateLoading}
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
                <Form.Item
                  label={"Ciudad"}
                  name="city"
                  rules={[
                    { required: true, message: "Por favor ingresa la ciudad" },
                  ]}
                >
                  <Input
                    disabled={isUpdateLoading}
                    addonBefore={<i className="fas fa-city"></i>}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* STATE */}
                <Form.Item
                  label={"Estado"}
                  name="state"
                  rules={[
                    { required: true, message: "Por favor ingresa el estado" },
                  ]}
                >
                  <Input
                    disabled={isUpdateLoading}
                    addonBefore={<i className="fas fa-flag"></i>}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label={"Slug"} name="slug">
            <Input disabled={true} />
          </Form.Item>

          {/* ACTIONS */}
          {!isNewProperty && (
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
          )}
          <Divider />
        </Form>
      ),
    },
    {
      key: "3",
      label: (
        <strong style={{ color: "rgba(0, 0, 0, 0.88)" }}>Multimedia</strong>
      ),
      children: (
        <div style={{ maxWidth: 600 }}>
          <ImageUploader
            initialImages={mainImage ? [mainImage, ...images] : images}
            initialMainImage={mainImage}
            onImagesChange={handleImagesChange}
            onSave={handleSaveImages}
            disabledButton={isNewProperty}
          />
        </div>
      ),
    },
  ];

  if (!isNewProperty) {
    items.push({
      key: "4",
      label: <strong style={{ color: "#ff4d4f" }}>Zona de Riesgo</strong>,
      children: !isNewProperty && (
        <div style={{ maxWidth: 600 }}>
          <Alert
            description="Esta sección contiene acciones que no se pueden deshacer. Por favor, proceda con precaución."
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Popconfirm
            title="Eliminar propiedad"
            description={
              <div style={{ maxWidth: 400 }}>
                <p style={{ marginBottom: 5 }}>
                  ¿Estás seguro de que deseas eliminar esta propiedad?
                </p>
                <p style={{ color: "red" }}>
                  <ExclamationCircleOutlined /> Esta acción no se puede deshacer
                  y eliminará permanentemente todos los datos de la propiedad.
                </p>
              </div>
            }
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              // TODO: Implementar la función de eliminación
              console.log("Eliminar propiedad:", initialValues.id);
            }}
          >
            <Button danger type="primary" icon={<DeleteOutlined />}>
              Eliminar Propiedad
            </Button>
          </Popconfirm>
        </div>
      ),
    });
  }

  return (
    <>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }}>
        <Collapse defaultActiveKey={["1", "2", "3"]} ghost items={items} />
        {isNewProperty && (
          <div style={{ marginTop: 24 }}>
            <Popconfirm
              title="Confirmar creación"
              description={
                <div>
                  <p>¿Estás seguro de que deseas crear esta propiedad?</p>
                  <p style={{ color: "red" }}>
                    <ExclamationCircleOutlined /> Esta acción no se puede
                    deshacer
                  </p>
                </div>
              }
              okText="Sí, crear"
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
                size="large"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenConfirmGeneralData(true);
                }}
              >
                Crear Propiedad
              </Button>
            </Popconfirm>
          </div>
        )}
      </Space>
    </>
  );
};

export default PropertyForm;
