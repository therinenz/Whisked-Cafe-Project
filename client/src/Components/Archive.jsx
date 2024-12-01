import React from "react";
import { ArrowLeft } from "lucide-react";
import Table from "./Table";



const Archive = ({ archivedProducts, setArchivedProducts }) => {
  const handleRestore = (productId) => {
    const restoredProduct = archivedProducts.find((product) => product.id === productId);
    if (restoredProduct) {
      setArchivedProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );
    }
    setShowActions(null);
  };

  const EmployeeHeaders = ["Product ID", "Image", "Product Name", "Category", "Action"];


  const rows = archivedProducts.map((product) => ({
    // Archive table rows logic remains unchanged
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => window.history.back()} // Back button
        className="inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-6 h-6 mr-4" />
        <span className="text-2xl font-semibold text-primary">Archive</span>
      </button>
      <Table headers={EmployeeHeaders} rows={rows} />
    </div>
  );
};

export default Archive;
