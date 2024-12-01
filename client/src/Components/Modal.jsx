import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, width = "max-w-3xl", height = "h-[70vh]" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg w-full ${width} ${height} flex flex-col`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-lightGray">
          <h2 className="text-lg font-bold flex items-center text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
