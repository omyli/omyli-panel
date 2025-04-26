import { BrowserRouter, Routes, Route } from "react-router-dom";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import NewProperty from "./pages/NewProperty";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Properties />} />
        <Route path="/propiedades/:propertyId" element={<PropertyDetails />} />
        <Route path="/propiedades/nueva" element={<NewProperty />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
