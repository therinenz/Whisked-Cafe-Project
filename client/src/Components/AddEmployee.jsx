import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Plus } from "lucide-react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";

const AddEmployee = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: ''
  });
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const fetchRoleOptions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/employee/roles');
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const data = await response.json();
        setRoleOptions(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoleOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Sending employee data:', formData);

      const response = await fetch('http://localhost:3000/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add employee');
      }

      console.log('Success response:', data);
      alert('Employee added successfully!');
      onSave(data);
      onClose();
      setFormData({
        name: '',
        email: '',
        password: '',
        mobile: '',
        role: ''
      });
    } catch (error) {
      console.error('Error details:', error);
      alert(`Error adding employee: ${error.message}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={<div className="flex items-center"><Plus className="h-5 w-5 mr-2 text-primary" />Add Employee</div>}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-3">
          {/* Left Column - Name (larger) */}
          <div className="col-span-4">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

         

          {/* Left Column - Email (larger) */}
          <div className="col-span-3">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email Address"
              required
            />
          </div>

          {/* Right Column - Mobile (smaller) */}
          <div className="col-span-1">
            <InputField
              label="Mobile No."
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter number"
            />
          </div>

          {/* Left Column - Password (larger) */}
          <div className="col-span-3">
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          {/* Right Column - Role (smaller) */}
          <div className="col-span-1">
            <Dropdown
              label="Role"
              options={roleOptions}
              onSelect={(value) => {
                console.log('Selected role:', value);
                setFormData(prev => ({ ...prev, role: value }));
              }}
              selectedValue={formData.role}
              placeholder="Select Role"
            />
          </div>

          {/* Button - Full Width */}
          <div className="col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddEmployee;
