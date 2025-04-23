// LIBRARIE
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  let accessToken = localStorage.getItem("token");
  return accessToken;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
