  import React, { useState, useEffect } from "react";
  import { MoreHorizontal, Edit2, Eye, Trash } from "lucide-react"; // Icons for actions
  import Header from "../../Components/Header";
  import Search from "../../Components/Search";
  import Table from "../../Components/Table";
  import Button from "../../Components/Button";
  import AddEmployee from "../../Components/AddEmployee";
  import ConfirmationModal from "../../Components/ConfirmationModal";
  import { toast } from 'react-hot-toast';

  const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showActions, setShowActions] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [modalMode, setModalMode] = useState("add");

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

    const handleView = async (employeeId) => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/api/employee/${employeeId}`);
        if (!response.ok) {
          throw new Error(
            response.status === 404 
              ? 'Employee not found' 
              : 'Failed to fetch employee details'
          );
        }
        const employeeData = await response.json();
        setCurrentEmployee(employeeData);
        setModalMode("view");
        setIsModalOpen(true);
        setShowActions(null);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        toast.error(error.message || 'Failed to fetch employee details');
      } finally {
        setIsLoading(false);
      }
    };

    const handleEdit = (employee) => {
      console.log('Edit mode activated for:', employee);
      setCurrentEmployee(employee);
      setModalMode("edit");
      setIsModalOpen(true);
      setShowActions(null);
    };

    const handleRemove = (employeeId) => {
      setEmployeeToDelete(employeeId);
      setShowModal(true);
    };

    const handleDelete = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/employee/${employeeToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server returned ${response.status}: ${response.statusText}`);
        }

        await fetchEmployees(); // Refresh the employee list
        setShowActions(null);
        toast.success(
          <div>
            <p className="font-bold">Employee Successfully Deleted!</p>
            <p className="text-gray-500 text-xs">The employee has been permanently deleted.</p>
          </div>,
          {
            style: {
              fontWeight: '500',
              fontSize: '16px',
            },
          }
        );
      } catch (error) {
        console.error('Error removing employee:', error);
        alert(`Failed to remove employee: ${error.message}`);
      } finally {
        setShowModal(false);
        setEmployeeToDelete(null);
      }
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
        await fetchEmployees();
        setIsModalOpen(false);
        setModalMode("add");
        setCurrentEmployee(null);
      } catch (error) {
        console.error('Error handling employee operation:', error);
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
            headers={["Name", "Email", "Mobile", "Role", "Action"]}
            rows={filteredEmployees.map((emp) => ({
        
              name: emp.name,
              email: emp.email,
              mobile: emp.mobile || "-",
              role: emp.role,

              action: (
                <div className="relative flex justify-center">
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

                <button
                  onClick={() => handleRemove(showActions)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash className="mr-3 h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          )}

          <AddEmployee
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setCurrentEmployee(null);
              setModalMode("add");
            }}
            onSave={handleAddEmployee}
            existingEmployees={employees}
            mode={modalMode}
            employeeData={currentEmployee}
          />

          <ConfirmationModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEmployeeToDelete(null);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    );
  };

  export default Employee;
