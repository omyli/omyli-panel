// EXTERNAL
import axios from "axios";

const apiBaseUrl = "https://p01--omyli-api--qpfx26t9ms8m.code.run";
//const apiBaseUrl = "http://localhost:8080";
console.log("URL: " + apiBaseUrl);

export const client = axios.create({
  baseURL: apiBaseUrl,
});

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
