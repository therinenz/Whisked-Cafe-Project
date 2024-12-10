import React, { useState, useEffect } from "react";
import { MoreHorizontal, Edit2, Eye, Trash } from "lucide-react"; // Icons for actions
import Header from "../../Components/Header";
import Search from "../../Components/Search";
import Table from "../../Components/Table";
import Button from "../../Components/Button";
import AddEmployee from "../../Components/AddEmployee";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActions, setShowActions] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/employee', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (employeeId) => {
    console.log(`Editing employee with ID: ${employeeId}`);
    setShowActions(null);
  };

  const handleView = (employeeId) => {
    console.log(`Viewing employee with ID: ${employeeId}`);
    setShowActions(null);
  };

  const handleAddEmployee = async (newEmployee) => {
    try {
      const response = await fetch('http://localhost:3000/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const savedEmployee = await response.json();
      setEmployees((prevEmployees) => [...prevEmployees, savedEmployee]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const toggleDropdown = (employeeId, target) => {
    if (showActions === employeeId) {
      setShowActions(null);
    } else {
      const rect = target.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
      setShowActions(employeeId);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Prevent closing if the dropdown itself is clicked
      if (!event.target.closest(".action-dropdown") && !event.target.closest(".rounded-full")) {
        setShowActions(null); // Close dropdown if clicked outside
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showActions]);

  

  const employeeHeaders = ["Employee ID", "Name", "Email", "Mobile No.", "Role", "Action"];

  const rows = filteredEmployees.map((employee) => ({
    employee_id: employee.id,
    name: employee.name,
    email: employee.email,
    mobile: employee.mobile,
    role: employee.role,
    action: (
      <div className="relative">
        <button
          onClick={(e) => toggleDropdown(employee.id, e.currentTarget)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>


        {showActions === employee.id && (
          <div
            style={{ top: dropdownPosition.top, left: dropdownPosition.left, position: "fixed" }}
            className=" z-50 bg-white shadow rounded-lg p-2"
          >
            <button
              onClick={() => handleEdit(employee.id)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit2 className="inline-block w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => handleView(employee.id)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="inline-block w-4 h-4 mr-2" />
              View
            </button>
          </div>
            )}
          </div>
          ),
            }));

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-white overflow-y-auto">
        <Header
          title="Employee Management"
          subheading="Manage user accounts, roles, and permissions."
        />

        {/* Headings */}
        <div className="px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-base font-semibold text-gray-900">Employee List</h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Search
                placeholder="Search Employee"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button onClick={() => setIsModalOpen(true)} label="Add Employee" />
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <Table headers={employeeHeaders} rows={rows} />

        {/* Add Employee Modal */}
        <AddEmployee
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEmployee}
        />
      </div>
    </div>
  );
};

export default Employee;
