import React, { useState, useEffect } from "react";
import { MoreHorizontal, Edit2, Eye, Archive } from "lucide-react";
import Google from "../../assets/Google.png";
import Header from "../../Components/Header";
import Search from "../../Components/Search";
import Table from "../../Components/Table";
import Button from "../../Components/Button";
import FilterButton from "../../Components/FilterButton";
import AddProductModal from "../../Components/AddProductModal";
import EditProductModal from "../../Components/EditProductModal";
import { useNavigate } from "react-router-dom";

// Sample product data
const initialProducts = [
  { id: "SPL001", image: Google, name: "Spanish Latte", category: "Iced Coffee" },
  { id: "CAP002", image: Google, name: "Cappuccino", category: "Hot Coffee" },
  { id: "TAR003", image: Google, name: "Taro", category: "Non-Coffee" },
  { id: "STR004", image: Google, name: "Strawberry", category: "Non-Coffee" },
  { id: "BOB005", image: Google, name: "Boba Tea", category: "Iced Coffee" },
];

const Product = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActions, setShowActions] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedFilter, setSelectedFilter] = useState("All Product");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // State to hold the product to edit
  const navigate = useNavigate(); // Initialize navigation
  const [archivedProducts, setArchivedProducts] = useState([]); // State to store archived products



  useEffect(() => {
    const handleClickOutside = (event) => {
      // Prevent closing if the dropdown itself is clicked
      if (!event.target.closest(".action-dropdown") && !event.target.closest(".rounded-full")) {
        setShowActions(null); // Close dropdown if clicked outside
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showActions]);






  // Helper function to generate product ID
  const generateProductId = (name) => {
    if (!name) return "";
    const prefix = name.slice(0, 3).toUpperCase(); // First 3 letters of the product name
    const count = products.filter((product) => product.id.startsWith(prefix)).length + 1; // Count existing products with the same prefix
    return `${prefix}${String(count).padStart(3, "0")}`; // Generate ID with 3-digit padding
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleActions = (productId, ref) => {
    if (showActions === productId) {
      setShowActions(null);
    } else {
      const rect = ref.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // Dropdown below button
        left: rect.left + window.scrollX - 50, // Align dropdown to left
      });
      setShowActions(productId);
    }
  };

  // Event Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = (newProduct) => {
    const productId = generateProductId(newProduct.name); // Generate product ID
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...newProduct, id: productId }, // Add product with generated ID
    ]);
    setIsModalOpen(false);
  };
  
  const handleEditProduct = (product) => {
    if (product) {
      setEditingProduct(product); // Set the product to be edited
      setIsEditModalOpen(true); // Open the edit modal
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setIsEditModalOpen(false); // Close the edit modal
  };

  const handleView = (productId) => {
    console.log(`Viewing product with ID: ${productId}`);
    setShowActions(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    console.log(`Filter selected: ${filter}`);
  };

 const handleArchive = (productId) => {
  const productToArchive = products.find((product) => product.id === productId);
  if (productToArchive) {
    setArchivedProducts((prev) => [...prev, { ...productToArchive, status: "Archived" }]);
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  }
  setShowActions(null);
};

  const handleArchiveButtonClick = () => {
    navigate("/archive"); // Navigate to the Archive page
  };


  const productHeaders = ["Product ID", "Image", "Product Name", "Category", "Action"];

  const rows = filteredProducts.map((product) => ({
    product_id: product.id,
    image: <img src={product.image} alt={product.name} className="h-8 w-8 rounded-lg object-cover" />,
    product_name: product.name,
    category: product.category,
    action: (
      <div className="relative">
        <button
          onClick={(e) => toggleActions(product.id, e.currentTarget)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    ),
  }));


  
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-white overflow-y-auto">
        <Header title="Product" subheading="Organizing and updating product offerings" />

        {/* Headings */}
        <div className="p-8 pt-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-base font-semibold text-gray-900">All Products</h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Search placeholder="Search Product" value={searchTerm} onChange={handleSearch} />
              <div className="flex gap-2">
                <Button onClick={() => setIsModalOpen(true)} label="Add Product" />
                <FilterButton
                  options={["All Product", "Iced Coffee", "Non-Coffee", "Matcha", "Premium", "Pastry"]}
                  onFilterSelect={handleFilterSelect}
                />
    
                {/* Archive Button */}
                <button
                  className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50"
                  onClick={handleArchiveButtonClick} // Navigate to Archive Page
                >
                  <Archive className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <Table headers={productHeaders} rows={rows} />
        {showActions && (
  <div
    style={{
      position: "fixed",
      top: dropdownPosition.top,
      left: dropdownPosition.left,
      zIndex: 50,
    }}
    className="w-36 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 action-dropdown"
  >
    <div className="py-1">
      <button
        onClick={() => handleEditProduct(filteredProducts.find((p) => p.id === showActions))}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Edit2 className="mr-3 h-4 w-4" />
        Edit
      </button>

      <button
        onClick={() => handleView(showActions)}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Eye className="mr-3 h-4 w-4" />
        View
      </button>

      <button
        onClick={() => handleArchive(showActions)}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <Archive className="mr-3 h-4 w-4" />
        Archive
      </button>
    </div>
  </div>
)}

      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
        existingProducts={products}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateProduct}
        product={editingProduct}
      />

    </div>
  );
};

export default Product;
