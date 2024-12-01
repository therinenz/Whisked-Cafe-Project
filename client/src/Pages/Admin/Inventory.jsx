import { useState } from "react";
import Header from "../../Components/Header";
import Search from "../../Components/Search";
import Button from "../../Components/Button";

const MOCK_DATA = [
  {
    id: "BUT-001",
    name: "Butter",
    category: "Pastry",
    details: [
      {
        id: "1",
        deliveryDate: "11-01-2024",
        quantity: 2,
        unit: "Grams",
        expiration: "09-03-2026",
        stockLevel: "Restock",
      },
      {
        id: "2",
        deliveryDate: "11-23-2024",
        quantity: 10,
        unit: "Grams",
        expiration: "10-20-2026",
        stockLevel: "Available",
      },
    ],
  },
  {
    id: "SYR-002",
    name: "Syrup",
    category: "Drinks",
    details: [],
  },
];

const Inventory = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null); // Tracks active dropdown
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

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

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const Dropdown = ({ id, options }) => (
    <div className="relative">
      <button
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown(id);
        }}
      >
        ...
      </button>
      {activeDropdown === id && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(null);
                alert(option.label);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered Data Based on Search Term
  const filteredData = MOCK_DATA.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-hidden">
      <Header
        title="Inventory"
        subheading="Track and Manage Real-Time Stock Levels"
      />

      {/* Headings */}
      <div className="p-8 pt-6 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base font-semibold text-gray-900">
            All Products
          </h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Search placeholder="Seacrh product" value={searchTerm} onChange={handleSearch} />


            <div className="flex gap-2">

              <Button onClick={onclick} label="Add New Stock" />

              <button className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50">
                Filter
              </button>dfffffffffffffffffffffffxcfyth67u

              

              <button
                className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50"
                onClick={() => alert("Go to Archive")}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>






      {/* Table */}
      <div className="m-8">
        <table className="w-full border border-gray-300 table-fixed">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-medium text-gray-500">
              <th className="px-8 py-2" style={{ width: "150px" }}>
                Stock ID
              </th>
              <th className="px-32 py-2" style={{ width: "150px" }}>
                Stock Name
              </th>
              <th className="px-32 py-2" style={{ width: "150px" }}>
                Category
              </th>
              <th className="pl-48 py-2" style={{ width: "250px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((stock) => (
              <>
                {/* Parent Row */}
                <tr
                  key={stock.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleRow(stock.id)}
                >
                  <td className="px-8 py-2 text-sm text-gray-900">
                    <span>{expandedRows.has(stock.id) ? "▼" : "▶"}</span>{" "}
                    {stock.id}
                  </td>
                  <td className="px-32 py-2 text-sm text-gray-900">
                    {stock.name}
                  </td>
                  <td className="px-32 py-2 text-sm text-gray-900">
                    {stock.category}
                  </td>
                  <td className="px-48 py-2 text-sm text-gray-900">
                    <Dropdown
                      id={stock.id}
                      options={[
                        { label: "Archive" },
                        { label: "View" },
                        { label: "Edit" },
                        { label: "Restock" },
                      ]}
                    />
                  </td>
                </tr>

                {/* Child Rows (Accordion) */}
                {expandedRows.has(stock.id) && stock.details.length > 0 && (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <table className="w-full border-t border-gray-300">
                        <thead className="bg-gray-100 text-left text-sm font-medium text-gray-500">
                          <tr>
                            <th className="px-8 py-2" style={{ width: "150px" }}>
                              Delivery Date
                            </th>
                            <th
                              className="px-8 py-2"
                              style={{ width: "150px" }}
                            >
                              Quantity
                            </th>
                            <th
                              className="px-8 py-2"
                              style={{ width: "150px" }}
                            >
                              Unit
                            </th>
                            <th
                              className="px-8 py-2"
                              style={{ width: "150px" }}
                            >
                              Expiration
                            </th>
                            <th
                              className="px-8 py-2"
                              style={{ width: "150px" }}
                            >
                              Stock Level
                            </th>
                            <th
                              className="pl-14 py-2"
                              style={{ width: "150px" }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {stock.details.map((detail) => (
                            <tr key={detail.id} className="hover:bg-gray-50">
                              <td className="px-8 py-2 text-sm text-gray-900">
                                {detail.deliveryDate}
                              </td>
                              <td className="px-8 py-2 text-sm text-gray-900">
                                {detail.quantity}
                              </td>
                              <td className="px-8 py-2 text-sm text-gray-900">
                                {detail.unit}
                              </td>
                              <td className="px-8 py-2 text-sm text-gray-900">
                                {detail.expiration}
                              </td>
                              <td className="px-8 py-2 text-sm text-gray-900">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    detail.stockLevel === "Available"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {detail.stockLevel}
                                </span>
                              </td>
                              <td className="pl-14 py-2 text-sm text-gray-900">
                                <Dropdown
                                  id={`${stock.id}-${detail.id}`}
                                  options={[
                                    { label: "View" },
                                    { label: "Edit" },
                                  ]}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
