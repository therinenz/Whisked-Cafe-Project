import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditProductModal = ({ isOpen, onClose, onUpdate, product }) => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setCategory(product.category);
      setPrice(product.price || 0);
      setImagePreview(product.image);
      setIngredients(product.ingredients || []);
      setMeasurements(product.measurements || []);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName || !category || price <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const updatedProduct = {
      ...product,
      name: productName,
      category,
      price,
      image: imagePreview,
      ingredients,
      measurements,
    };

    onUpdate(updatedProduct);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name and ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product ID</label>
              <input
                type="text"
                value={product.id}
                readOnly
                className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select Category</option>
                <option value="Iced Coffee">Iced Coffee</option>
                <option value="Non-Coffee">Non-Coffee</option>
                <option value="Pastry">Pastry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>

          {/* Ingredients and Measurements */}
          <div>
            <h3 className="text-sm font-medium">Ingredients</h3>
            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index] = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    placeholder="Ingredient"
                    className="block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  />
                  <input
                    type="text"
                    value={measurements[index] || ""}
                    onChange={(e) => {
                      const newMeasurements = [...measurements];
                      newMeasurements[index] = e.target.value;
                      setMeasurements(newMeasurements);
                    }}
                    placeholder="Measurement"
                    className="block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setIngredients([...ingredients, ""]);
                setMeasurements([...measurements, ""]);
              }}
              className="text-sm text-primary font-medium"
            >
              Add Ingredient
            </button>
          </div>

          {/* Image Preview */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Image Preview</label>
            <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-md" />
              ) : (
                <p>No image selected</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;