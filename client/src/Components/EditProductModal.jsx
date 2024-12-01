import React, { useState, useEffect } from 'react';
import { Pencil, Check, Edit2 } from 'lucide-react';
import Modal from './Modal';
import InputField from './InputField';

const EditProductModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [productData, setProductData] = useState(() => {
    return initialData || {
      name: 'Spanish latte',
      id: 'SPL001',
      category: 'Iced Coffee',
      price: 32,
      ingredients: [
        { name: 'Coffee Beans', amount: 10, unit: 'Grams' },
        { name: 'Syrup', amount: 10, unit: 'Milliliter' },
        { name: 'Sugar', amount: 20, unit: 'Pounds' },
      ],
      image: '/placeholder.svg?height=400&width=300',
    };
  });

  const [editingIngredient, setEditingIngredient] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialData) {
      const hasPriceChanged = productData.price !== initialData.price;
      const hasImageChanged = productData.image !== initialData.image;
      const hasIngredientsChanged = !productData.ingredients.every((ingredient, index) =>
        ingredient.amount === initialData.ingredients[index]?.amount
      );

      setHasChanges(hasPriceChanged || hasImageChanged || hasIngredientsChanged);
    }
  }, [productData, initialData]);

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setProductData((prevData) => ({ ...prevData, price: newPrice }));
    setHasChanges(true);
  };

  const handleIngredientChange = (e, index) => {
    const newAmount = Number(e.target.value);
    setProductData((prevData) => {
      const newIngredients = [...prevData.ingredients];
      newIngredients[index] = { ...newIngredients[index], amount: newAmount };
      return { ...prevData, ingredients: newIngredients };
    });
    setHasChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(productData); // Save the data
    setHasChanges(false); // Reset changes flag after save
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title={<><Pencil className="h-5 w-5 mr-2 text-primary" /> Edit product</>} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputField
                  label="Product Name"
                  name="name"
                  type="text"
                  value={productData.name}
                  readOnly
                  className="border-none bg-lightGray focus:ring-0 focus:border-none pointer-events-none cursor-default"
                  required
                />
              </div>
              <div>
                <InputField
                  label="Product ID"
                  name="id"
                  type="text"
                  value={productData.id}
                  readOnly
                  className="border-none bg-lightGray focus:ring-0 focus:border-none pointer-events-none cursor-default"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputField
                  label="Category"
                  name="category"
                  type="text"
                  value={productData.category}
                  readOnly
                  className="border-none bg-lightGray focus:ring-0 focus:border-none pointer-events-none cursor-default"
                  required
                />
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-3 top-10 text-gray-500">₱</span>
                  <InputField
                    label="Price"
                    name="price"
                    type="number"
                    value={productData.price}
                    onChange={handlePriceChange} // Handle price changes
                    required
                    className="pl-7 pt-3.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-start">
            <img
              src={productData.image}
              alt={productData.name}
              className="w-42 h-44 object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-black">Ingredients</h3>
            <h3 className="text-sm font-semibold text-black">Measurement</h3>
          </div>
          <div className="space-y-3">
            {productData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex justify-between items-center pt-2">
                <span className="text-gray-700 sm:text-sm">{ingredient.name}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(e, index)} // Handle ingredient amount change
                    className={`w-20 text-sm px-3 py-0 [] focus:ring-0 border-0 ${
                      editingIngredient === index ? 'border-2 border-primary' : 'border-transparent bg-transparent'
                    } rounded-lg text-right`}
                    readOnly={editingIngredient !== index}
                  />
                  <span className="w-24 text-gray-500 text-sm">{ingredient.unit}</span>
                  <button
                    type="button"
                    onClick={() => setEditingIngredient(editingIngredient === index ? null : index)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    aria-label={editingIngredient === index ? `Save ${ingredient.name}` : `Edit ${ingredient.name}`}
                  >
                    {editingIngredient === index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg transition-colors ${hasChanges ? 'bg-primary text-white' : 'bg-darkGray text-gray-700 cursor-not-allowed'}`}
            disabled={!hasChanges} // Disable button if no changes
          >
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
