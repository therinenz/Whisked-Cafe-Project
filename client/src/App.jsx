import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./Pages/Client-side/Landing";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Admin/Dashboard";
import Inventory from "./Pages/Admin/Inventory";
import Product from "./Pages/Admin/Product";
import History from "./Pages/Admin/History";
import Employee from "./Pages/Admin/Employee";
import Sidebar from "./Components/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        {/* Client-side routes */}
        <Route path="/Landing" element={<Landing />} />
        <Route path="/Login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/Dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/Inventory"
          element={
            <AdminLayout>
              <Inventory />
            </AdminLayout>
          }
        />
        <Route
          path="/Product"
          element={
            <AdminLayout>
              <Product />
            </AdminLayout>
          }
        />
        <Route
          path="/History"
          element={
            <AdminLayout>
              <History />
            </AdminLayout>
          }
        />
        <Route
          path="/Employee"
          element={
            <AdminLayout>
              <Employee />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

// Admin Layout Component (includes Sidebar)
const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar User="Owner" />
      {/* Main content */}
      <div className="flex-1 bg-gray-50">{children}</div>
    </div>
  );
};

export default App;
