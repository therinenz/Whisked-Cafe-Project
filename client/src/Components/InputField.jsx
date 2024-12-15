import React from "react";

const InputField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required, 
  readOnly,
  disabled,
  className,
  error
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary
          ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-primary'} 
          ${className}`}
      />
    </div>
  );
};

export default InputField;
