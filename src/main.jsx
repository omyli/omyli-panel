import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import "./css/index.css";

import Router from "./router/Router";
import { AuthContextProvider } from "./hooks/context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={Router} />
    </AuthContextProvider>
  </StrictMode>
);
