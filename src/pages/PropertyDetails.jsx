import { useEffect, useState } from "react";
import { Button, Space, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty } from "../api/propertiesApi";
import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import PropertyForm from "../components/PropertyForm";

const PropertyDetails = () => {
  const [property, setProperty] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const { propertyId } = useParams();
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
    }
    setIsLoading(false);
  };

  const handleSave = async (propertyUpdate) => {
    setIsUpdateLoading(true);
    try {
      const response = await updateProperty({
        id: property.id,
        ...propertyUpdate,
      });
      if (response.status === 200) {
        setProperty(response.data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
    setIsUpdateLoading(false);
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
        <Skeleton loading={isLoading} active>
          <PropertyForm
            initialValues={property}
            onSave={handleSave}
            isUpdateLoading={isUpdateLoading}
          />
        </Skeleton>
      </Space>
    </MainLayout>
  );
};

export default PropertyDetails;
