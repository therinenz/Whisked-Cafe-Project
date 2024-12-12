import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Plus, Eye, Edit2 } from "lucide-react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import { toast } from 'react-hot-toast';

const AddEmployee = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingEmployees, 
  mode,
  employeeData = null
}) => {
  console.log('Current mode:', mode);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    if (mode === "edit" && employeeData) {
      console.log('EDIT MODE - Employee Data received:', employeeData);
      setFormData({
        name: employeeData.name || '',
        email: employeeData.email || '',
        mobile: employeeData.mobile || '',
        role: employeeData.role || '',
        password: employeeData.password || ''
      });
    } else if (mode === "view" && employeeData) {
      setFormData({
        name: employeeData.name || '',
        email: employeeData.email || '',
        mobile: employeeData.mobile || '',
        role: employeeData.role || '',
        password: employeeData.password || ''
      });
    } else if (mode === "add") {
      setFormData({
        name: '',
        email: '',
        password: '',
        mobile: '',
        role: ''
      });
    }
  }, [mode, employeeData, isOpen]);

  // Validate form fields
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'This field is required';
        }
        return '';
        
      case 'email':
        if (!value.trim()) {
          return 'This field is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
        
      case 'password':
        if (mode === "add") {
          if (!value) {
            return 'This field is required';
          }
          if (value.length < 6) {
            return 'Password must be at least 6 characters';
          }
        } else if (mode === "edit" && value) {
          if (value.length < 6) {
            return 'Password must be at least 6 characters';
          }
        }
        return '';
        
      case 'mobile':
        if (!value.trim()) {
          return 'Number is required';
        }
        
        // Remove + prefix for length check
        const digitsOnly = value.replace(/^\+/, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
          return 'must me 10 digits';
        }
        return '';
        
      case 'role':
        if (!value) {
          return 'This field is required';
        }
        return '';
        
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, 'New value:', value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate and set error immediately on change
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
// In AddEmployee.jsx, modify the handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setIsSubmitting(true);
    
    // Handle password exactly like other fields
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role,
      // Only include password if it's not empty in edit mode
      ...(mode === "edit" && formData.password ? { password: formData.password } : {}),
      // Always include password in add mode
      ...(mode === "add" ? { password: formData.password } : {})
    };

    const url = mode === "edit" 
      ? `http://localhost:3000/api/employee/${employeeData.id}` 
      : 'http://localhost:3000/api/employee';

    const response = await fetch(url, {
      method: mode === "edit" ? 'PUT' : 'POST',
      headers: {  
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update employee');
    }

    onSave(responseData);
    onClose();
    toast.success(mode === "edit" ? "Employee updated successfully!" : "Employee added successfully!");
  } catch (error) {
    console.error('Error:', error);
    toast.error(`Error ${mode === "edit" ? "updating" : "adding"} employee: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  
  // Add this function at the top of your component to check if any changes were made
  const hasChanges = () => {
    if (!employeeData) return true; // If no employeeData, assume it's a new entry
    
    return (
      formData.name !== employeeData.name ||
      formData.email !== employeeData.email ||
      formData.mobile !== employeeData.mobile ||
      formData.role !== employeeData.role ||
      // Only consider password if it's been changed from empty
      (formData.password && formData.password !== employeeData.password)
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title={
        <div className="flex items-center">
          {mode === "add" ? (
            <Plus className="h-5 w-5 mr-2 text-primary" />
          ) : mode === "edit" ? (
            <Edit2 className="h-5 w-5 mr-2 text-brown-600" />
          ) : (
            <Eye className="h-5 w-5 mr-2 text-primary" />
          )}
          {mode === "add" ? "Add Employee" : mode === "edit" ? "Edit Employee" : "View Employee"}
        </div>
      }
      height={
        mode === "view" ? "h-[400px]" : 
        mode === "add" ? "h-[490px]" :
        mode === "edit" ? "h-[490px]" : undefined
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {mode === "view" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <div className="bg-gray-100 p-3 rounded-md text-gray-600">
                {formData.name}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="bg-gray-100 p-3 rounded-md text-gray-600">
                  {formData.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile No.</label>
                <div className="bg-gray-100 p-3 rounded-md text-gray-600">
                  {formData.mobile}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <div className="bg-gray-100 p-3 rounded-md text-gray-600">
                  {formData.password}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <div className="bg-gray-100 p-3 rounded-md text-gray-600">
                  {formData.role}
                </div>
              </div>
            </div>
          </div>
        ) : mode === "edit" ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter full name"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter Email Address"
                  />
                  {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile No.</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter number"
                  />
                  {errors.mobile && <div className="text-red-500 text-sm mt-1">{errors.mobile}</div>}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter new password"
                  />
                  {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                  <Dropdown
                    options={roleOptions}
                    onSelect={(value) => {
                      setFormData(prev => ({ ...prev, role: value }));
                      const error = validateField('role', value);
                      setErrors(prev => ({ ...prev, role: error }));
                    }}
                    selectedValue={formData.role}
                    placeholder="Select Role"
                  />
                  {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={
                  isSubmitting || 
                  Object.values(errors).some(error => error !== '') || 
                  !formData.name || 
                  !formData.email || 
                  !formData.role ||
                  !hasChanges()
                }
                className={`bg-primary text-white px-4 py-2 rounded-md ${
                  (isSubmitting || 
                    Object.values(errors).some(error => error !== '') || 
                    !formData.name || 
                    !formData.email || 
                    !formData.role ||
                    !hasChanges())
                    ? 'opacity-50 bg-gray-500 cursor-not-allowed' 
                    : 'hover:bg-primary/90'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-4">
              <InputField
                label="Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                error={errors.name}
              />
              {errors.name && <div className="text-red-500 text-sm -mt-3 mb-2">{errors.name}</div>}
            </div>

            <div className="col-span-3">
              <InputField
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
                error={errors.email}
              />
              {errors.email && <div className="text-red-500 text-sm -mt-3 mb-2">{errors.email}</div>}
            </div>  

            <div className="col-span-1">
              <InputField
                label="Mobile No. *"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter number"
                required
              />
              {errors.mobile && <div className="text-red-500 text-sm -mt-3 mb-2">{errors.mobile}</div>}
            </div>

            <div className="col-span-3">
              <InputField
                label="Password *"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                error={errors.password}
                required
              />
              {errors.password && <div className="text-red-500 text-sm -mt-3 mb-2">{errors.password}</div>}
            </div>

            <div className="col-span-1">
              <Dropdown
                label="Role *"
                options={roleOptions}
                onSelect={(value) => {
                  setFormData(prev => ({ ...prev, role: value }));
                  const error = validateField('role', value);
                  setErrors(prev => ({ ...prev, role: error }));
                }}
                selectedValue={formData.role}
                placeholder="Select Role"
              />
              {errors.role && <div className="text-red-500 text-sm -mt-3 mb-2">{errors.role}</div>}
            </div>

            {mode === "add" && (
              <div className="col-span-4 flex justify-end pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || 
                    Object.values(errors).some(error => error !== '') || 
                    !formData.name || 
                    !formData.email || 
                    !formData.password || 
                    !formData.role}
                  className={`bg-primary text-white px-4 py-2 rounded-md ${
                    (isSubmitting || 
                      Object.values(errors).some(error => error !== '') || 
                      !formData.name || 
                      !formData.email || 
                      !formData.password || 
                      !formData.role)
                      ? 'opacity-50 bg-gray-500 cursor-not-allowed' 
                      : 'hover:bg-primary/90'
                  }`}
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddEmployee;
