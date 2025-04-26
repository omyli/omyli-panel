import { createBrowserRouter } from "react-router-dom";

//Components
import Properties from "../pages/Properties";
import Profile from "../pages/Profile";
import PropertyDetails from "../pages/PropertyDetails";
import NewProperty from "../pages/NewProperty";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Properties />,
  },
  {
    path: "/perfil",
    element: <Profile />,
  },
  {
    path: "/propiedades/:propertyId",
    element: <PropertyDetails />,
  },
  {
    path: "/propiedades/nueva",
    element: <NewProperty />,
  },
]);

export default Router;
