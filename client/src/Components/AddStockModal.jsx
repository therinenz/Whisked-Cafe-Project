import { useState } from "react";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import InputField from "./InputField";
import { Plus } from "lucide-react";

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<><Plus className="h-5 w-5 mr-2 text-primary" /> Add Product</>}
      className="w-[500px]"
    >

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Stock Name and ID */}
          <div className="col-span-8">
            <InputField
              label="Stock Name"
              placeholder="Enter stock name"
              value={formData.stockName}
              onChange={(e) => setFormData({...formData, stockName: e.target.value})}
            />
          </div>
          <div className="col-span-4">
            <InputField
              label="Stock ID"
              value="Auto"
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* Category, Unit, and Quantity */}
          <div className="col-span-5">
            <Dropdown
              label="Category"
              options={categories}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="Select category"
            />
          </div>
          <div className="col-span-4">
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <div className="flex">
              <input
                type="number"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="0"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <select
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-3/4 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {units.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-3">
            <InputField
              label="Quantity"
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            />
          </div>

          {/* Supplier */}
          <div className="col-span-12">
            <InputField
              label="Supplier"
              placeholder="Enter supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
            />
          </div>

          {/* Dates */}
          <div className="col-span-6">
            <InputField  
              label="Delivery date"
              type="date"
              placeholder="Choose date..."
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
            />
          </div>
          <div className="col-span-6">
            <InputField
              label="Expiration date"
              type="date"
              placeholder="Choose date..."
              value={formData.expirationDate}
              onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#B85C38] text-white rounded-lg hover:bg-[#A34E2E]"
          >
            Add
          </button> 
        </div>
      </form>
    </Modal>
  );
};

export default AddStockModal; 