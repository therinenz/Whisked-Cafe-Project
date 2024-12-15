import { React, useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import InputField from "./InputField";
import { Plus } from "lucide-react";
import Calendar from "./Calendar";
import { inventoryService } from "../services/api";  


const AddStockModal = ({ isOpen, onClose, onSubmit }) => {
  const [lastUsedNumber, setLastUsedNumber] = useState(0);
  const [formData, setFormData] = useState({
    stockName: "",
    stockId: "",
    category: "",
    amountPerQty: 0,
    quantity: 0,
    supplier: "",
    deliveryDate: "",
    expirationDate: "",
  });

  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [showExpirationCalendar, setShowExpirationCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  
  const deliveryDateRef = useRef(null);
  const expirationDateRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isCalendarClick = event.target.closest(".calendar-dropdown");
      const isDateInputClick = event.target.closest(".date-input");
      const isMonthYearPickerClick = event.target.closest(".month-year-picker");
  
      // Only close if the click is completely outside these areas
      if (!isCalendarClick && !isDateInputClick && !isMonthYearPickerClick) {
        setShowDeliveryCalendar(false);
        setShowExpirationCalendar(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside); // Use `mousedown` to capture clicks early
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  const toggleDeliveryCalendar = () => {
    const rect = deliveryDateRef.current.getBoundingClientRect();
    setCalendarPosition({
      top: rect.top - 330,
      left: rect.left + window.scrollX,
    });
    setShowDeliveryCalendar(!showDeliveryCalendar);
    setShowExpirationCalendar(false);
  };

  const toggleExpirationCalendar = () => {
    const rect = expirationDateRef.current.getBoundingClientRect();
    setCalendarPosition({
      top: rect.top - 330,
      left: rect.left + window.scrollX,
    });
    setShowExpirationCalendar(!showExpirationCalendar);
    setShowDeliveryCalendar(false);
  };

  // Generate Stock ID based on stock name
  const generateStockId = (name) => {
    if (!name) return "";
    const prefix = name.slice(0, 3).toUpperCase();
    const nextNumber = (lastUsedNumber + 1).toString().padStart(3, '0');
    return `${prefix}-${nextNumber}`;
  };

  const handleStockNameChange = (e) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      stockName: newName,
      stockId: generateStockId(newName)
    });
  };

  const categories = ["Base Ingredients", "Drinks", "Pastry"];
  const units = ["Kilogram", "Liter", "Gram", "ml"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.addStock({
        stock_id: formData.stockId,
        stock_name: formData.stockName,
        category_id: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        delivery_date: formData.deliveryDate,
        expiration_date: formData.expirationDate,
        threshold: 10,
        status: 'Available'
      });
      
      onClose();
    } catch (err) {
      console.error('Error adding stock:', err);
      alert('Failed to add stock');
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={<><Plus className="h-5 w-5 mr-2 text-primary" /> Add Product</>}
        className="w-[500px] position-fixed"
        height="h-[570px]"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Stock Name and ID */}
            <div className="col-span-9">
              <InputField
                id="stockName"
                name="stockName"
                label="Stock Name"
                placeholder="Enter stock name"
                value={formData.stockName}
                onChange={(e) => setFormData({...formData, stockName: e.target.value})}
              />
            </div>
            <div className="col-span-3">
              <InputField
                id="stockId"
                name="stockId"
                label="Stock ID"
                value={generateStockId(formData.stockName)}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Category, Unit, and Quantity */}
            <div className="col-span-4">
              <Dropdown
                label="Category"
                options={categories}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Select category"
              />
            </div>
            <div className="col-span-5 mt-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Unit per Quantity</label>
              <div className="flex">
                <input
                  type="number"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  placeholder="0"
                  className="w-1/3 px-3 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
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
            <div className="col-span-3 mt-1">
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

            {/* Date inputs */}
            <div className="col-span-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Delivery date
              </label>
              <div ref={deliveryDateRef} className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary cursor-pointer date-input"
                  value={formData.deliveryDate ? new Date(formData.deliveryDate).toLocaleDateString() : ''}
                  onClick={toggleDeliveryCalendar}
                  readOnly
                  placeholder="Select date"
                />
              </div>
            </div>
            <div className="col-span-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Expiration date
              </label>
              <div ref={expirationDateRef} className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary cursor-pointer date-input"
                  value={formData.expirationDate ? new Date(formData.expirationDate).toLocaleDateString() : ''}
                  onClick={toggleExpirationCalendar}
                  readOnly
                  placeholder="Select date"
                />
              </div>
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

      {/* Calendars positioned outside modal */}
      {showDeliveryCalendar && (
        <div
          className="calendar-dropdown"
          style={{
            position: "fixed",
            top: calendarPosition.top,
            left: calendarPosition.left,
            zIndex: 1000,
          }}
        >
          <Calendar
            selectedDate={formData.deliveryDate ? new Date(formData.deliveryDate) : null}
            onDateSelect={(date) => {
              setFormData({
                ...formData,
                deliveryDate: date.toISOString().split('T')[0]
              });
              setShowDeliveryCalendar(false);
            }}
          />
        </div>
      )}

      {showExpirationCalendar && (
        <div
          className="calendar-dropdown"
          style={{
            position: "fixed",
            top: calendarPosition.top,
            left: calendarPosition.left,
            zIndex: 1000,
          }}
        >
          <Calendar
            selectedDate={formData.expirationDate ? new Date(formData.expirationDate) : null}
            onDateSelect={(date) => {
              setFormData({
                ...formData,
                expirationDate: date.toISOString().split('T')[0]
              });
              setShowExpirationCalendar(false);
            }}
          />
          
        </div>
      )}
    </>
  );
};

export default AddStockModal; 