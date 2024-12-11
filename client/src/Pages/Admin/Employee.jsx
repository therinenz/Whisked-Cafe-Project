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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/api/employee');
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchEmployees();
    }, []);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!event.target.closest(".action-dropdown") && !event.target.closest(".rounded-full")) {
          setShowActions(null);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [showActions]);

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

    const handleView = (employeeId) => {
      console.log(`Viewing employee with ID: ${employeeId}`);
      setShowActions(null);
    };

    const handleEdit = (employee) => {
      console.log(`Editing employee:`, employee);
      setShowActions(null);
    };

    const filteredEmployees = employees.filter((employee) =>
      (employee.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (employee.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (employee.mobile?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (employee.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleAddEmployee = async (newEmployee) => {
      try {
        const response = await fetch('http://localhost:3000/api/employee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmployee)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add employee');
        }

        const data = await response.json();
        setEmployees(prevEmployees => [...prevEmployees, data]);
        setIsModalOpen(false);
        alert('Employee added successfully!');
      } catch (error) {
        console.error('Error adding employee:', error);
        alert(`Failed to add employee: ${error.message}`);
      }
    };

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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading employees...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            <Table 
              headers={["Name", "Email", "Mobile", "Role", "Actions"]}
              rows={filteredEmployees.map(emp => ({
                name: emp.name,
                email: emp.email,
                mobile: emp.mobile || '-',
                role: emp.role,
                action: (
                  <div className="relative">
                    <button
                      onClick={(e) => toggleActions(emp.id, e.currentTarget)}
                      className="rounded-full p-1 hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                ),
              }))}
            />
          )}

          {showActions && (
            <div
              style={{
                position: "fixed",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                zIndex: 50,
              }}
              className="w-36 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 action-dropdown"
            >
              <div className="py-1">
                <button
                  onClick={() => handleEdit(filteredEmployees.find((e) => e.id === showActions))}
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

          <AddEmployee
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddEmployee}
            existingEmployees={employees}
          />
        </div>
      </div>
    );
  };

  export default Employee;
