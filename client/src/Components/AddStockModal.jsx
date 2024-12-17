import { React, useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import InputField from "./InputField";
import { Plus, Eye } from "lucide-react";
import Calendar from "./Calendar";
import { inventoryService } from "../services/api";  
import { toast } from 'react-hot-toast';


const AddStockModal = ({ isOpen, onClose, onSubmit, mode = "add", stockData = null }) => {
  const [lastUsedNumber, setLastUsedNumber] = useState(0);
  const [formData, setFormData] = useState({
    stock_name: "",
    stockId: "",
    category_name: "",
    amountPerQty: 0,
    unit: "kg",
    quantity: 0,
    supplier: "",
    deliveryDate: new Date().toISOString().split('T')[0],
    expirationDate: "",
  });
  
  const [showDeliveryCalendar, setShowDeliveryCalendar] = useState(false);
  const [showExpirationCalendar, setShowExpirationCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  
  const deliveryDateRef = useRef(null);
  const expirationDateRef = useRef(null);

  const [nextNumber, setNextNumber] = useState(1);
  
  useEffect(() => {
    const fetchNextNumber = async () => {
      if (mode === "add") {
        const next = await inventoryService.getNextStockNumber();
        setNextNumber(next);
      } 
    };
    
    if (isOpen) {
      fetchNextNumber();
    }
  }, [isOpen, mode]);
  
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
  
  useEffect(() => {
    if (isOpen) {
      if (mode === "view" && stockData) {
        // Populate form with existing data when in view mode
        setFormData({
          stock_name: stockData.stock_name || "",
          stockId: stockData.stock_id || "",
          category_name: stockData.category_name || "",
          amountPerQty: stockData.amount_per_qty || 0,
          unit: stockData.unit || "kg",
          quantity: stockData.quantity || 0,
          supplier: stockData.supplier || "",
          deliveryDate: stockData.delivery_date || new Date().toISOString().split('T')[0],
          deliveryDateDisplay: stockData.delivery_date ? formatDate(new Date(stockData.delivery_date)) : "",
          expirationDate: stockData.expiration_date || "",
          expirationDateDisplay: stockData.expiration_date ? formatDate(new Date(stockData.expiration_date)) : "",
        });
      } else {
        // Reset form for add mode
        setFormData({
          stock_name: "",
          stockId: "",
          category_name: "",
          amountPerQty: 0,
          unit: "kg",
          quantity: 0,
          supplier: "",
          deliveryDate: new Date().toISOString().split('T')[0],
          deliveryDateDisplay: "",
          expirationDate: "",
          expirationDateDisplay: "",
        });
      }
    }
  }, [isOpen, mode, stockData]);
  
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
  const generateStockId = (stock_name) => {
    if (!stock_name) return "";
    const prefix = stock_name.slice(0, 3).toUpperCase();
    return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
  };

const formatDate = (date) => {
  if (!date) return ""; // Handle empty values

  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "short" }); // e.g., Dec
  const day = date.getDate();

  return `${year} / ${month} / ${day}`;
};



  const handleStockNameChange = (e) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      stock_name: newName,
      stockId: generateStockId(newName)
    });
  };

  const categories = ["Base Ingredients", "Drinks", "Pastry"];
  
  const units = [
    "kg",
    "liters",
    "tablespoons",
    "g",
    "ml",
    "teaspoons"
  ];
  
  <select
    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
    className="w-3/4 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-primary"
  >
    {units.map((unit, index) => (
      <option key={index} value={unit.value}>
        {unit.label}
      </option>
    ))}
  </select>
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Validate required fields
      if (!formData.stock_name || !formData.category_name || !formData.quantity || !formData.unit) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Get the prefix (first 3 letters) of the new stock
      const newStockPrefix = formData.stock_name.slice(0, 3).toUpperCase();

      // Check if any stock exists with the same prefix
      const allStocks = await inventoryService.getAllStock();
      const stockPrefixExists = allStocks.some(stock => {
        const existingPrefix = stock.stock_id.split('-')[0];
        return existingPrefix === newStockPrefix;
      });

      if (stockPrefixExists) {
        toast.error("A stock with this prefix already exists. Please use a different stock name.");
        return;
      }

      // Map category to category_id
      const categoryMap = {
        "Base Ingredients": 1,
        "Drinks": 2,
        "Pastry": 3
      };

      // Ensure numbers are properly parsed
      const quantity = parseFloat(formData.quantity) || 0;
      const amountPerQty = parseFloat(formData.amountPerQty) || 0;
      const totalQuantity = quantity * amountPerQty;

      const stockData = {
        stock_id: formData.stockId || generateStockId(formData.stock_name),
        stock_name: formData.stock_name,
        category_id: categoryMap[formData.category_name],
        quantity: totalQuantity,
        remaining_quantity: totalQuantity,
        unit: formData.unit,
        delivery_date: formData.deliveryDate,
        expiration_date: formData.expirationDate || null,
        threshold: 2,
        supplier: formData.supplier || null,
        status: 'Available'
      };

      console.log("Sending data to backend:", stockData);
      const response = await inventoryService.addStock(stockData);
    
      // Show success toast
      toast.success("Stock added successfully!");

      // Refresh the inventory table
      if (onSubmit) {
        onSubmit();
      }

      onClose();

    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error(error.message || "Failed to add stock");
    }
  };
  

  
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <>
            {mode === "add" ? (
              <Plus className="h-5 w-5 mr-2 text-primary" />
            ) : (
              <Eye className="h-5 w-5 mr-2 text-primary" />
            )}
            {mode === "add" ? "Add New Stock" : "View Stock"}
          </>
        }
        className="w-[500px] position-fixed"
        height="h-[570px]"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-12 gap-4">

            {/* Stock Name and ID */}
            <div className="col-span-9">
               <InputField
                id="stock_name"
                label="Stock Name"
                placeholder="Enter stock name"
                value={formData.stock_name}
                onChange={handleStockNameChange}
              />

            </div>
            <div className="col-span-3">
              <InputField
                id="stockId"
                name="stockId"
                label="Stock ID"
                value={generateStockId(formData.stock_name)}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Category, Unit, and Quantity */}
            <div className="col-span-4">
            <Dropdown
             label="Category"
            options={categories}
            selectedValue={formData.category_name} // Pass the current value to display
            onSelect={(value) => {
              setFormData({ ...formData, category_name: value }); // Update state with selected value
              console.log("Category Selected:", value); // Debugging to verify
            }}
            placeholder="Select category"
          />


            </div>
            <div className="col-span-5 mt-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Unit per Quantity</label>
                  
              <div className="flex">
  {/* Input Field for Amount */}
  <input
    type="number"
    value={formData.amountPerQty} // Separate state
    onChange={(e) =>
      setFormData({ ...formData, amountPerQty: e.target.value })
    }
    placeholder="0"
    className="w-1/3 px-3 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
  />

            {/* Dropdown for Unit */}
            <select
              value={formData.unit} // State for unit
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
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
                  value={formData.deliveryDateDisplay || ''}
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
                  value={formData.expirationDateDisplay || ''}
                  onClick={toggleExpirationCalendar}
                  readOnly
                  placeholder="Select date"
                />
              </div>
            </div>
          </div>

          {/* Only show Add button in add mode */}
          {mode === "add" && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#B85C38] text-white rounded-lg hover:bg-[#A34E2E]"
              >
                Add
              </button> 
            </div>
          )}
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
  onDateSelect={({ dbFormat, displayFormat }) => {
    setFormData({
      ...formData,
      deliveryDate: dbFormat,      // Store DB format for submission
      deliveryDateDisplay: displayFormat  // Store display format for input
    });
  }}
  onClose={() => setShowDeliveryCalendar(false)}
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
              onDateSelect={({ dbFormat, displayFormat }) => {
                setFormData({
                  ...formData,
                  expirationDate: dbFormat,      // Store DB format for submission
                  expirationDateDisplay: displayFormat  // Store display format for input
                });
              }}
              onClose={() => setShowExpirationCalendar(false)}
            />

          
        </div>
      )}
    </>
  );
};

export default AddStockModal; 