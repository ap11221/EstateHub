import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminEditProperty from "./pages/admin/AdminEditProperty";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInquiries from "./pages/admin/AdminInquiries";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

          <Route path="/my-properties" element={<ProtectedRoute roles={["owner", "admin"]}><MyProperties /></ProtectedRoute>} />
          <Route path="/my-properties/add" element={<ProtectedRoute roles={["owner", "admin"]}><AddProperty /></ProtectedRoute>} />
          <Route path="/my-properties/edit/:id" element={<ProtectedRoute roles={["owner", "admin"]}><AddProperty /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/:id/edit" element={<AdminEditProperty />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>

          <Route path="*" element={<div className="text-center py-24 text-gray-400">404 — Page not found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
