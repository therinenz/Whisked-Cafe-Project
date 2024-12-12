import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Plus } from "lucide-react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import { toast } from 'react-hot-toast';

const AddEmployee = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingEmployees, 
  mode = "add",
  employeeData = null
}) => {
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
    if (mode === "view" && employeeData) {
      setFormData({
        name: employeeData.name,
        email: employeeData.email,
        mobile: employeeData.mobile,
        password: employeeData.password,
        role: employeeData.role
      });
    }
  }, [mode, employeeData]);

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
        if (!value) {
          return 'This field is required';
        }
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
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
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
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

      onSave(data);
      
      setFormData({
        name: '',
        email: '',
        password: '',
        mobile: '',
        role: ''
      });
      onClose();
      
      toast.success(
        <div>
          <p className="font-normal">Employee Successfully Added!</p>
          <p className="text-gray-500 text-xs">New employee has been created.</p>
        </div>,
        {
          style: {
            fontWeight: '500',
            fontSize: '16px',
          },
        }
      );
    } catch (error) {
      console.error('Error details:', error);
      toast.error(`Error adding employee: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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

          <div className="col-span-4 flex justify-end">
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
        </div>
      </form>
    </Modal>
  );
};

export default AddEmployee;
