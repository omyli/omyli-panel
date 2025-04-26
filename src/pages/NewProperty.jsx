import { useState } from "react";
import { Button, Space, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../api/propertiesApi";
import MainLayout from "../components/MainLayout";
import PropertyForm from "../components/PropertyForm";

const NewProperty = () => {
  const [isSaving, setIsSaving] = useState(false);
  const navigator = useNavigate();

  const handleSave = async (propertyData) => {
    setIsSaving(true);
    try {
      const response = await createProperty(propertyData);
      if (response.status === 201) {
        navigator("/propiedades/" + response.data.id);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    setIsSaving(false);
  };

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
        <PropertyForm
          initialValues={{}}
          onSave={handleSave}
          isUpdateLoading={isSaving}
          isNewProperty={true}
        />
      </Space>
    </MainLayout>
  );
};

export default NewProperty;
