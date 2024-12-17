import React from "react";
import Modal from "./Modal";
import InputField from "./InputField";
import { Eye } from "lucide-react";

const ViewStockModal = ({ isOpen, onClose, stockData }) => {
  if (!stockData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <Eye className="h-5 w-5 mr-2 text-primary" />
          View eh connected otids
        </>
      }
      className="w-[500px]"
      height="h-[570px]"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Stock Name and ID */}
          <div className="col-span-9">
            <InputField
              label="Stock Name"
              value={stockData.stock_name}
              disabled
            />
          </div>
          <div className="col-span-3">
            <InputField
              label="Stock ID"
              value={stockData.stock_id}
              disabled
            />
          </div>

          {/* Category */}
          <div className="col-span-4">
            <InputField
              label="Category"
              value={stockData.category_name}
              disabled
            />
          </div>

          {/* Unit and Quantity */}
          <div className="col-span-5">
            <InputField
              label="Unit"
              value={`${stockData.quantity} ${stockData.unit}`}
              disabled
            />
          </div>

          <div className="col-span-3">
            <InputField
              label="Quantity"
              value={stockData.remaining_quantity}
              disabled
            />
          </div>

          {/* Supplier */}
          <div className="col-span-12">
            <InputField
              label="Supplier"
              value={stockData.supplier}
              disabled
            />
          </div>

          {/* Dates */}
          <div className="col-span-6">
            <InputField
              label="Delivery Date"
              value={new Date(stockData.delivery_date).toLocaleDateString()}
              disabled
            />
          </div>
          <div className="col-span-6">
            <InputField
              label="Expiration Date"
              value={new Date(stockData.expiration_date).toLocaleDateString()}
              disabled
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewStockModal;
