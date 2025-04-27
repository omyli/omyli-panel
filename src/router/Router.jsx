import { createBrowserRouter } from "react-router-dom";

//Components
import Properties from "../pages/Properties";
import Profile from "../pages/Profile";
import PropertyDetails from "../pages/PropertyDetails";
import NewProperty from "../pages/NewProperty";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";

const Router = createBrowserRouter([
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Properties />
      </PrivateRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/propiedades/:propertyId",
    element: (
      <PrivateRoute>
        <PropertyDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/propiedades/nueva",
    element: (
      <PrivateRoute>
        <NewProperty />
      </PrivateRoute>
    ),
  },
]);

export default Router;
