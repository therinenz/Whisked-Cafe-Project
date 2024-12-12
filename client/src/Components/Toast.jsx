import React from 'react'

const Toast = ({ message, type = 'success', isVisible = true }) => {
    // Define color schemes based on type
    const toastStyles = {
      success: 'bg-green-50 text-green-500 border border-green-200',
      error: 'bg-red-50 text-red-500 border border-red-200',
      warning: 'bg-yellow-50 text-yellow-500 border border-yellow-200',
      info: 'bg-blue-50 text-blue-500 border border-blue-200',
    };
  
    // If not visible, don't render
    if (!isVisible) return null;
  
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`px-6 py-4 rounded-md shadow-md ${toastStyles[type]} flex items-center gap-3`}>
          {/* Success Icon */}
          {type === 'success' && (
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span className="text-lg font-medium">{message}</span>
        </div>
      </div>
    );
  };

export default Toast
