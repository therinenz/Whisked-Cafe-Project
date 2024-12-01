import React, { useState, useMemo } from "react";
import Modal from "./Modal";
import { Plus } from "lucide-react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";

const AddEmployee = ({ isOpen, onClose, onSave, existingEmployees = [] }) => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
  });

  // Generate Employee ID based on the employee name and existing employees
  const employeeId = useMemo(() => {
    if (!employeeData.name || employeeData.name.trim().length === 0) return "Auto";
    const prefix = employeeData.name.slice(0, 3).toUpperCase();
    const sameTypeCount = existingEmployees.filter(
      (e) => e.employeeId && e.employeeId.startsWith(prefix)
    ).length;
    return `${prefix}${String(sameTypeCount + 1).padStart(3, "0")}`;
  }, [employeeData.name, existingEmployees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const newEmployee = { ...employeeData, employeeId };
    onSave(newEmployee);
    setEmployeeData({ name: "", email: "", mobile: "", role: "" }); // Reset form data
    onClose(); // Close modal
  };

  return (
    <Modal
      isOpen={isOpen}
      title={
        <>
          <Plus className="h-5 w-5 mr-2 text-primary" /> Add Employee
        </>
      }
      onClose={onClose}
      height="h-29"
    >



      <div className="grid grid-cols-3 gap-4">
        {/* Employee Name Field */}
        <div className="col-span-2">
          <InputField
            label="Employee Name"
            name="name"
            type="text"
            value={employeeData.name}
            onChange={handleChange}
            placeholder="Enter employee name"
            required
          />
        </div>

        {/* Employee ID Field */}
        <div className="col-span-1">
          <InputField
            label="Employee ID"
            value={employeeId}
            readOnly
            className="border-none bg-lightGray focus:ring-0 focus:border-none pointer-events-none cursor-default"
          />
        </div>

        {/* Email Field */}
        <div className="col-span-2">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={employeeData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Mobile Number Field */}
        <div className="col-span-1">
          <InputField
            label="Mobile No."
            name="mobile"
            type="text"
            value={employeeData.mobile}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
            placeholder="Enter mobile number"
            required
          />
        </div>

        {/* Role Field */}
            <div className="col-span-2">
          <Dropdown
            label="Role"
            options={["Cashier", "Asst. Manager"]}
            selectedValue={employeeData.role}
            onSelect={(value) => setEmployeeData((prev) => ({ ...prev, role: value }))}
            placeholder="Select Role"
          />
          </div>
     

            {/* Submit Button */}
            <div className="h-10 mt-8 flex justify-end col-span-1">
                <button
                onClick={handleSave}
                className="px-16  bg-orange-700 text-white rounded-md hover:bg-orange-800"
                >
                Add
                </button>
                </div>

      </div>
    </Modal>
  );
};

export default AddEmployee;
