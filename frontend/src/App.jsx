import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import AddProperty from "./pages/AddProperty/AddProperty";
import Wishlist from "./pages/Wishlist/Wishlist";
import EditProperty from "./pages/EditProperty";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Property Details */}
      <Route
        path="/property/:id"
        element={
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        }
      />

      {/* Add Property */}
      <Route
        path="/add-property"
        element={
          <ProtectedRoute>
            <AddProperty />
          </ProtectedRoute>
        }
      />

      {/* Wishlist */}
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      {/* Edit Property */}
      <Route
        path="/edit-property/:id"
        element={
          <ProtectedRoute>
            <EditProperty />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;