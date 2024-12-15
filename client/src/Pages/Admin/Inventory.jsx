import {  React, useState, useRef, useEffect, Fragment } from "react";
import Header from "../../Components/Header";
import Search from "../../Components/Search";
import Button from "../../Components/Button";
import AddStockModal from "../../Components/AddStockModal";
import { MoreHorizontal, Edit2, Eye, RefreshCcw, Archive, ChevronDown, ChevronRight, FilterIcon, ArchiveIcon, MinusCircle } from "lucide-react";
import { inventoryService } from "../../services/api";

const Inventory = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All Stocks');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [archivedItems, setArchivedItems] = useState([]);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockHistory, setStockHistory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, detailsRes] = await Promise.all([
          fetch('http://localhost:3000/api/inventory'),
          fetch('http://localhost:3000/api/inventory/history')
        ]);

        const inventory = await inventoryRes.json();
        let details = await detailsRes.json();

        if (details.error) {
          console.error('Error from history endpoint:', details.error);
          details = [];
        }

        // Group details by inventory_id
        const detailsByInventory = details.reduce((acc, detail) => {
          if (!acc[detail.inventory_id]) {
            acc[detail.inventory_id] = [];
          }
          acc[detail.inventory_id].push(detail);
          return acc;
        }, {});

        // Sort details by delivery_date for each inventory (NEWEST FIRST)
        Object.keys(detailsByInventory).forEach(inventoryId => {
          detailsByInventory[inventoryId].sort((a, b) => 
            new Date(a.delivery_date) - new Date(b.delivery_date)  // Changed sorting order
          );
        });

        console.log('Processed Details:', detailsByInventory);

        setInventoryData(inventory);
        setStockHistory(detailsByInventory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setError(error.message);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".action-dropdown") && !event.target.closest(".rounded-full")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleDropdown = (id, ref) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      const rect = ref.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 50,
      });
      setActiveDropdown(id);
    }
  };

  const MainDropdown = ({ id, onRestock, status }) => (
    <div className="relative flex justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown(`main-${id}`, e.currentTarget);
        }}
        className="rounded-full p-1 hover:bg-gray-100"
      >
        <MoreHorizontal className="h-5 w-5 text-gray-500" />
      </button>
      
    </div>
  );

  const DetailDropdown = ({ stockId, detailId }) => (
    <div className="relative flex justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown(`detail-${stockId}-${detailId}`, e.currentTarget);
        }}
        className="rounded-full p-1 hover:bg-gray-100"
      >
        <MoreHorizontal className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterByStatus = (data) => {
    if (filterStatus === 'All Stocks') return data;
    
    return data.filter(item => {
      return item.status === filterStatus;
    });
  };

  const filteredData = filterByStatus(
    inventoryData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stock_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const FilterDropdown = () => (
    <div className="relative">
      <button
        className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150"
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
      >
        <span className="text-xs"><FilterIcon className="w-4 h-4" /></span>
        <span>Filter</span>
      </button>
      
      {showFilterDropdown && (
        <div className="fixed right-auto mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {['All Stocks', 'Available', 'Restock', 'Out-of-Stock'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setShowFilterDropdown(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors duration-150
                ${filterStatus === status 
                  ? 'bg-brown-50 text-brown-700' 
                  : 'text-gray-700 hover:bg-gray-50'
                } first:rounded-t-lg last:rounded-b-lg`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const handleArchive = (stockId) => {
    const itemToArchive = inventoryData.find(item => item.id === stockId);
    if (itemToArchive) {
      setArchivedItems([...archivedItems, itemToArchive]);
      alert(`${itemToArchive.name} has been archived`);
    }
  };

  const StockLevelBadge = ({ level }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        level === "Available"
          ? "bg-green-100 text-green-700"
          : level === "Restock"
          ? "bg-yellow-100 text-yellow-700"
          : level === "Last Stock"
          ? "bg-orange-100 text-orange-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {level}
    </span>
  );

  const handleRestock = async (stockId) => {
    try {
      const currentStock = inventoryData.find(item => item.stock_id === stockId);
      if (currentStock) {
        await inventoryService.moveToHistory(stockId);
        
        setStockHistory(prev => ({
          ...prev,
          [stockId]: [...(prev[stockId] || []), { ...currentStock, status: 'Last Stock' }]
        }));
      }

      setIsAddModalOpen(true);
    } catch (error) {
      console.error('Error handling restock:', error);
    }
  };

  const handleDeductStock = async (stockId, quantity) => {
    try {
      const response = await fetch(`http://localhost:3000/api/inventory/${stockId}/deduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Refresh the inventory data
      fetchInventoryData();
      
    } catch (error) {
      console.error('Error deducting stock:', error);
      // Show error message to user
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-hidden">
      <Header
        title="Inventory"
        subheading="Track and Manage Real-Time Stock Levels"
      />

      <div className="p-8 pt-6 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base font-semibold text-gray-900">
            All Products
          </h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Search 
              placeholder="Search product" 
              value={searchTerm} 
              onChange={handleSearch}
              className="min-w-[250px]"
            />

            <div className="flex gap-2">
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                label="Add New Stock"
                className="bg-brown-600 hover:bg-brown-700 text-white" 
              />
              <FilterDropdown />
              <button
                className="rounded-lg border border-gray-300 p-3   text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  alert("Viewing archived items");
                }}
              >
                <ArchiveIcon className="w-4 h-4 text-red-600"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="m-8 mt-0">
        <table className="w-full border border-gray-300 table-fixed text-center items-center">
          <thead>
            <tr className="bg-gray-200 text-sm font-medium text-gray-500 items-center text-center">
              <th className="px-8 py-2" style={{ width: "50px" }}>Stock ID</th>
              <th className="px-8 py-2" style={{ width: "50px" }}>Stock Name</th>
              <th className="px-8 py-2" style={{ width: "50px" }}>Quantity</th>
              <th className="px-8 py-2" style={{ width: "50px" }}>Expiration Date</th>
              <th className="px-8 py-2" style={{ width: "50px" }}>Status</th>
              <th className="pl-2 py-2" style={{ width: "50px" }}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((stock) => {
              const stockDetails = (stockHistory[stock.id] || [])
                .filter(detail => detail.remaining_quantity > 0);
              
              stockDetails.sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));
              
              const currentStock = stockDetails[0];
              const pastStocks = stockDetails.slice(1);
              const hasLastStock = pastStocks.length > 0;

              return (
                <Fragment key={stock.stock_id}>
                  {/* Main Stock Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-8 py-2 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {hasLastStock ? (
                          <button
                            onClick={() => toggleRow(stock.id)}
                            className="focus:outline-none"
                          >
                            {expandedRows.has(stock.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <div className="w-4"></div>
                        )}
                        <span>{stock.stock_id}</span>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-gray-900">{stock.name}</td>
                    <td className="py-2 text-sm text-gray-900">
                     {currentStock
                     ? `${Math.floor(currentStock.remaining_quantity)} / ${Math.floor(currentStock.quantity)}`
                     : `${Math.floor(stock.quantity)} / ${Math.floor(stock.quantity)}`
                      }
                    </td>

                    <td className="py-2 text-sm text-gray-900">
                      {currentStock?.expiration_date 
                        ? new Date(currentStock.expiration_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-8 py-2 text-sm text-gray-900">
                      <StockLevelBadge level={stock.status} />
                    </td>
                    <td className="px-8 py-2">
                      <MainDropdown
                        id={stock.stock_id}
                        onRestock={() => handleRestock(stock.stock_id)}
                        status={stock.status}
                      />
                    </td>
                  </tr>

                  {/* Accordion for past stocks */}
                  {hasLastStock && expandedRows.has(stock.id) && (
                    <tr>
                      <td colSpan={6} className="p-0 bg-gray-50">
                        <table className="w-full text-center">
                          <thead className="bg-gray-100 text-sm font-medium text-gray-5">
                            <tr>
                              <th className="px-8 py-2">Delivery Date</th>
                              <th className="px-8 py-2">Quantity</th>
                              <th className="px-8 py-2">Expiration Date</th>
                              <th className="px-8 py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pastStocks.map((detail, index) => (
                              <tr key={index} className="hover:bg-gray-100">
                                <td className="px-8 py-2 text-sm">
                                  {new Date(detail.delivery_date).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-2 text-sm">
                                {Math.floor(detail.remaining_quantity)} / {Math.floor(detail.quantity)}
                                </td>
                                <td className="px-8 py-2 text-sm">
                                  {new Date(detail.expiration_date).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-2 text-sm">
                                  <StockLevelBadge level="Last Stock" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeDropdown && (
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
            {activeDropdown.startsWith('main-') ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(null);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span>View</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(null);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(null);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span>Restock</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(activeDropdown.replace('main-', ''));
                    setActiveDropdown(null);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Archive className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span>Archive</span>
                </button>
              </>
            ) : (
              <>
              </>
            )}
          </div>
        </div>
      )}

      <AddStockModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Inventory;
