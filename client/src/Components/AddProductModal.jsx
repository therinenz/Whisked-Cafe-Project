import React, { useState } from "react";
import { X, Upload, Plus } from "lucide-react";

const AddProductModal = ({ isOpen, onClose, onAdd, existingProducts }) => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [imageFile, setImageFile] = useState(null); // Holds the uploaded file
  const [ingredients, setIngredients] = useState([
    { id: Date.now().toString(), name: "", quantity: "", unit: "" },
  ]);

  const categories = ["Iced Coffee", "Non-Coffee", "Pastry"];
  const ingredientOptions = ["Sugar", "Milk", "Coffee", "Salt", "Flour", "Water"];
  const unitOptions = ["grams", "ml", "pieces", "cups", "tbsp"];

  // Generate Product ID based on product name and existing products
  const generateProductId = (name) => {
    if (!name || name.trim().length === 0) return "Auto";
    const prefix = name.slice(0, 3).toUpperCase();
    const sameTypeCount = existingProducts.filter((p) =>
      p.id.startsWith(prefix)
    ).length;
    return `${prefix}${String(sameTypeCount + 1).padStart(3, "0")}`;
  };

  // Function to handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image (JPEG, PNG, JPG)");
        return;
      }
      setImageFile(file); // Store the image file
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // Set preview for the UI
      reader.readAsDataURL(file);
    }
  };

  // Handle input or drag-and-drop for image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    handleImageUpload(file);
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImageUpload(file);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", quantity: "", unit: "" },
    ]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image for the product!");
      return;
    }

    const productId = generateProductId(productName);
    const newProduct = {
      name: productName,
      productId,
      category,
      price,
      image: imagePreview, // Use the preview URL as a placeholder
      ingredients,
    };
    onAdd(newProduct);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setProductName("");
    setCategory("");
    setPrice(0);
    setImagePreview(null);
    setImageFile(null);
    setIngredients([{ id: Date.now().toString(), name: "", quantity: "", unit: "" }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Plus className="h-5 w-5 mr-2" /> Add Product
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product ID</label>
              <input
                type="text"
                value={generateProductId(productName)}
                readOnly
                className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                required
              >
                <option value="" disabled>Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  ₱
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="pl-7 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div
              className="mt-1 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer"
              onDrop={handleDragDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-md"
                />
              ) : (
                <label htmlFor="fileUpload" className="text-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Drag and Drop file or <span className="text-primary font-medium">Browse</span></p>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Ingredients</h3>
            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="grid grid-cols-3 gap-4">
                  <select
                    value={ingredient.name}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].name = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  >
                    <option value="" disabled>Select ingredient</option>
                    {ingredientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => {
                      const newIngredients = [...ingredients];
                      newIngredients[index].quantity = e.target.value;
                      setIngredients(newIngredients);
                    }}
                    placeholder="Qty."
                    className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                  <div className="flex gap-2">
                    <select
                      value={ingredient.unit}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].unit = e.target.value;
                        setIngredients(newIngredients);
                      }}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      required
                    >
                      <option value="" disabled>Unit</option>
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredients.length === 1}
                      className="p-1 hover:bg-gray-200 rounded-md text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="mt-2 flex items-center text-primary text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
