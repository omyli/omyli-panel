import { useState } from "react";
import {
  Upload,
  Image,
  Button,
  Space,
  Spin,
  notification,
  Popconfirm,
} from "antd";
import {
  InboxOutlined,
  SaveOutlined,
  StarFilled,
  StarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./ImageUploader.css";

const { Dragger } = Upload;

const ImageUploader = ({
  onImagesChange,
  initialImages = [],
  initialMainImage,
  onSave,
}) => {
  const [previewImages, setPreviewImages] = useState(initialImages);
  const [mainImage, setMainImage] = useState(
    initialMainImage || initialImages[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    disabled: isLoading,
    beforeUpload: (file, fileList) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        api.error({
          message: "Error",
          description: "Solo puedes subir archivos de imagen!",
          placement: "topRight",
        });
        return Upload.LIST_IGNORE;
      }

      // Procesar todos los archivos válidos
      const validFiles = fileList.filter((file) =>
        file.type.startsWith("image/")
      );
      const newImages = [...previewImages];

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          newImages.push(imageUrl);

          // Si es la primera imagen, la establecemos como principal
          if (previewImages.length === 0 && newImages.length === 1) {
            setMainImage(imageUrl);
          }

          setPreviewImages([...newImages]);
          if (onImagesChange) {
            onImagesChange([...newImages], mainImage);
          }
        };
        reader.readAsDataURL(file);
      });

      return false; // Prevent automatic upload
    },
  };

  const handleSave = async () => {
    if (onSave) {
      setIsLoading(true);
      try {
        await onSave(previewImages, mainImage);
        api.success({
          message: "Éxito",
          description: "Imágenes guardadas exitosamente",
          placement: "topRight",
        });
      } catch {
        api.error({
          message: "Error",
          description: "Error al guardar las imágenes",
          placement: "topRight",
        });
      } finally {
        setIsLoading(false);
        setIsConfirmOpen(false);
      }
    }
  };

  const handleRemove = (index) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);

    // Si eliminamos la imagen principal, establecemos la primera imagen restante como principal
    if (previewImages[index] === mainImage && newImages.length > 0) {
      setMainImage(newImages[0]);
    }

    if (onImagesChange) {
      onImagesChange(newImages, mainImage);
    }
  };

  const handleSetMainImage = (image) => {
    setMainImage(image);
    if (onImagesChange) {
      onImagesChange(previewImages, image);
    }
  };

  return (
    <div className="image-uploader-container">
      {contextHolder}
      <Spin spinning={isLoading} size="large">
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click o arrastra imágenes para subirlas
          </p>
          <p className="ant-upload-hint">
            Soporte para múltiples imágenes. Puedes seleccionar varias imágenes
            a la vez.
          </p>
        </Dragger>

        <div className="preview-container">
          <Space wrap>
            {previewImages.map((image, index) => (
              <div key={index} className="image-preview-item">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={150}
                  style={{ objectFit: "cover" }}
                />
                <div className="image-actions">
                  <Button
                    type="text"
                    danger
                    onClick={() => handleRemove(index)}
                    className="remove-button"
                  >
                    ×
                  </Button>
                  <Button
                    type="text"
                    icon={
                      image === mainImage ? <StarFilled /> : <StarOutlined />
                    }
                    onClick={() => handleSetMainImage(image)}
                    className="main-image-button"
                  />
                </div>
                {image === mainImage && (
                  <div className="main-image-label">Principal</div>
                )}
              </div>
            ))}
          </Space>
        </div>

        {previewImages.length > 0 && (
          <div className="save-button-container">
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
              onConfirm={handleSave}
              onCancel={() => setIsConfirmOpen(false)}
              okText="Sí, guardar"
              cancelText="Cancelar"
              open={isConfirmOpen}
            >
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => setIsConfirmOpen(true)}
                loading={isLoading}
              >
                Guardar Imágenes
              </Button>
            </Popconfirm>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ImageUploader;
