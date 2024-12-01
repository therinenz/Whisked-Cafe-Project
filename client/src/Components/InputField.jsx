import React from "react";

const InputField = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  label = "",
  required = false,
  className = "",
}) => {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-black">{label}</label>}
      <input
        type={type}
        name={name} // Add name here
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-2 p-3 block w-full border border-lightGray rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-primary sm:text-sm ${className}`}
        required={required}
      />
    </div>
  );
};

export default InputField;
