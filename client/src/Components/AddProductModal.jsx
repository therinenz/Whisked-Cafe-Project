import React, { useState } from "react";
import { Upload, Plus, X } from "lucide-react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import Modal from "./Modal";

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
      image: imagePreview,
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

  // Example API integration
  const addProduct = async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      // Update local state with new data
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} title={<><Plus className="h-5 w-5 mr-2 text-primary" /> Add Product</>} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid Layout for Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-3">
              <InputField
                label="Product Name"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="col-span-1">
              <InputField
                label="Product ID"
                value={generateProductId(productName)}
                readOnly
                className="border-none bg-lightGray focus:ring-0 focus:border-none pointer-events-none cursor-default"
              />
            </div>
            <div className="col-span-3">
           <label className="block text-sm font-semibold text-black">Category</label>
                   <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 p-3 block w-full border border-lightGray rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
            <div className="col-span-1">
              <div className="relative">
                <InputField
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="pl-7"
                  required
                />
                <span className="absolute inset-y-0 left-3 top-7 flex items-center text-gray-500">
                  ₱
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center justify-center border-2 border-dashed border-gray-300 rounded-md w-52 h-44 overflow-hidden ">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover"
              />
            ) : (
              <label htmlFor="fileUpload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600 mt-4">
                  Drag and Drop file <br></br>or <span className="text-primary  items-center "><br></br>Browse</span>
                </p>
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>



{/* Ingredients Section */}
<div>
  <div className="space-y-4">
    {ingredients.map((ingredient, index) => (
      <div className="grid grid-cols-12 gap-4 items-center" key={ingredient.id}>
        {/* Dropdown for Ingredient Name */}
        <div className="col-span-4 ">
          <Dropdown 
            label="Select Ingredients"
            placeholder="Select Ingredient"
            options={ingredientOptions}
            selectedValue={ingredient.name}
            onSelect={(value) => {
              const newIngredients = [...ingredients];
              newIngredients[index].name = value;
              setIngredients(newIngredients);
            }}
          />
        </div>

        {/* InputField for Quantity */}
        <div className="col-span-4 mt-4">
          <InputField
            type="number"
            value={ingredient.quantity}
            onChange={(e) => {
              const newIngredients = [...ingredients];
              newIngredients[index].quantity = e.target.value;
              setIngredients(newIngredients);
            }}
            placeholder="Qty."
            required
          />
        </div>

        {/* Dropdown for Unit */}
        <div className="col-span-3 mt-6">
          <Dropdown
            options={unitOptions}
            selectedValue={ingredient.unit}
            placeholder="Unit"
            onSelect={(value) => {
              const newIngredients = [...ingredients];
              newIngredients[index].unit = value;
              setIngredients(newIngredients);
            }}
          />
        </div>

        {/* Remove Button */}
        <div className="col-span-1 flex mt-6 ">
          <button
            type="button"
            onClick={() => removeIngredient(index)}
            disabled={ingredients.length === 1}
            className="hover:bg-gray-200 rounded-md text-gray-500"
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
      Add Ingredient
    </button>
  </div>
</div>



        <div className="flex justify-end mt-6">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">
            Add Product
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
