import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg p-6 w-[480px] shadow-lg">
        <div className="space-y-2">
          {/* Title with warning icon */}
          <div className="flex items-center gap-2">
            <svg 
              className="w-6 h-6 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-base font-semibold text-red-600">
              Are you sure you want to delete this employee?
            </h2>
          </div>

          {/* Message */}
          <p className="text-gray-500 text-sm pl-8">
            You won't be able to recover this once deleted.
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-1 text-base font-normal text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-1 text-base font-normal text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
