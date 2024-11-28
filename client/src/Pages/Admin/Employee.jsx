import React, { useState } from "react";
import { MoreHorizontal, Edit2, Eye, Trash } from "lucide-react"; // Icons for actions
import Header from "../../Components/Header";
import Search from "../../Components/Search";
import Table from "../../Components/Table";
import Button from "../../Components/Button";

const initialEmployees = [
  { id: "EMP001", name: "B. J Cabaat", email: "Bj@whiskedcafe.com", mobile: "+639090323355", role: "Cashier" },
  { id: "EMP002", name: "Jin Failana", email: "Jin@whiskedcafe.com", mobile: "+639328183743", role: "Cashier" },
  { id: "MAN001", name: "Ariel Cabona", email: "Ariel@whiskedcafe.com", mobile: "+639231233325", role: "Asst. Manager" },
];

const Employee = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActions, setShowActions] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleActions = (employeeId, ref) => {
    if (showActions === employeeId) {
      setShowActions(null);
    } else {
      const rect = ref.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 50,
      });
      setShowActions(employeeId);
    }
  };

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

  const handleAddEmployee = () => {
    console.log("Add Employee button clicked");
    // Add employee logic
  };

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
          onClick={(e) => toggleActions(employee.id, e.currentTarget)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
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
        <div className="p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-base font-semibold text-gray-900">Employee List</h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Search
                placeholder="Search Employee"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddEmployee} label="Add Employee" />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <Table headers={employeeHeaders} rows={rows} />
        {showActions && (
          <div
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 50,
            }}
            className="w-36 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
          >
            {/* Action Buttons for employees */}
            <div className="py-1">
              <button
                onClick={() => handleEdit(showActions)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit2 className="mr-3 h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => handleView(showActions)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="mr-3 h-4 w-4" />
                View
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
