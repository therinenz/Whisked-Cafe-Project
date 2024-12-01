import { useState } from "react";

const AddStockModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    stockName: "",
    stockId: "Auto",
    category: "",
    unit: "",
    quantity: 0,
    supplier: "",
    deliveryDate: "",
    expirationDate: "",
  });

  const categories = ["Base Ingredients", "Drinks", "Pastry"];
  const units = ["Kilogram", "Liter", "Gram", "ml"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#B85C38]">Add Stock</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm text-gray-700 mb-1">Stock Name</label>
              <input
                type="text"
                placeholder="Enter stock name"
                className="w-full p-2 border rounded-lg"
                value={formData.stockName}
                onChange={(e) => setFormData({...formData, stockName: e.target.value})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-gray-700 mb-1">Stock ID</label>
              <input
                type="text"
                value="Auto"
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-gray-700 mb-1">Category</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-gray-700 mb-1">Unit</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              >
                <option value="">Select...</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                placeholder="0"
                className="w-full p-2 border rounded-lg"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Supplier</label>
              <input
                type="text"
                placeholder="Enter supplier"
                className="w-full p-2 border rounded-lg"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-gray-700 mb-1">Delivery date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-gray-700 mb-1">Expiration date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={formData.expirationDate}
                onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#B85C38] text-white rounded-lg hover:bg-[#A34E2E]"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal; 