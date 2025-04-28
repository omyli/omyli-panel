// EXTERNAL
import axios from "axios";
import { getLoginData, removeLoginData } from "../service/localStorage";

const apiBaseUrl = "https://p01--omyli-api--qpfx26t9ms8m.code.run";

export const client = axios.create({
  baseURL: apiBaseUrl,
});

// Interceptor para agregar el token a las peticiones
client.interceptors.request.use(
  (config) => {
    const { token } = getLoginData();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/auth"
    ) {
      // Remover datos de autenticación
      removeLoginData();

      // Redirigir al login
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Sync
export const listAllProperties = () => {
  return client.get("/realestate/v1/realestate");
};

export const listPropertiesToMainBanner = () => {
  return client.get("/realestate/v1/realestate/banner");
};

export const getPropertyById = (id) => {
  return client.get("/realestate/v1/realestate/" + id);
};

export const searchProperties = (searchParams, page, perPage) => {
  return client.post(
    `/realestate/v1/realestate/query?page=${page}&perPage=${perPage}`,
    searchParams
  );
};

export const updateProperty = (propertyWithUpdate) => {
  return client.put(`/realestate/v1/realestate`, propertyWithUpdate);
};

export const createProperty = (newProperty) => {
  return client.post(`/realestate/v1/realestate`, newProperty);
};

export const deleteProperty = (propertyId) => {
  return client.delete(`/realestate/v1/realestate?propertyId=${propertyId}`);
};

export const syncProperties = () => {
  return client.get(`/realestate/v1/realestate/sync`);
};

//Auth
export const login = ({ email, password }) => {
  return client.post(`/auth/v1/login`, { email, password });
};
