import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./Pages/Client-side/Landing";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Admin/Dashboard";
import Inventory from "./Pages/Admin/Inventory";
import History from "./Pages/Admin/History";
import Employee from "./Pages/Admin/Employee";
import Sidebar from "./Components/Sidebar";
import Product from "./Pages/Admin/Product";
import Archive from "./Components/Archive";
import { useState } from "react";
import Calendar from "./Components/Calendar";

function App() {

  const [archivedProducts, setArchivedProducts] = useState([]); // Shared state for archived products


  return (
    <Router>
      <Routes>
        {/* Client-side routes */}
        <Route path="/Landing" element={<Landing />} />
        <Route path="/Login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/calendar" element={<Calendar />} />

        <Route
          path="/"
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
      
      <Route
          path="/"
          element={<Product setArchivedProducts={setArchivedProducts} />} // Pass as a prop
        />
        <Route
          path="/archive"
          element={<Archive archivedProducts={archivedProducts} setArchivedProducts={setArchivedProducts} />} // Pass as props
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
