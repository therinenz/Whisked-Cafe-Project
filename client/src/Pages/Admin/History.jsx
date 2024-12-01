import React, { useState } from "react";
import Header from "../../Components/Header";
import Table from "../../Components/Table";

const transactions = [
  {
    invoiceNo: "INV1122-001",
    totalItems: 3,
    totalPrice: 150,
    date: "11-13-2024",
    orderMethod: "In-Store",
  },
  {
    invoiceNo: "INV1122-002",
    totalItems: 1,
    totalPrice: 50,
    date: "11-13-2024",
    orderMethod: "Pick-up",
  },
];

const productHeaders = [
  "Invoice No.",
  "Total Items",
  "Total Price",
  "Date",
  "Order Method",
  "Action"
];

const History = () => {
  const [showActions, setShowActions] =  useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const totalSales = transactions.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalTransactions = transactions.length;

  const rows = transactions.map((t) => [
    t.invoiceNo,
    t.totalItems,
    `₱${t.totalPrice}`,
    t.date,
    t.orderMethod,
    // Add the button directly here
    <button
      key={t.invoiceNo}
      className="px-4 py-1 text-sm text-black border bg-whiteBg rounded-md hover:bg-lightGray focus:outline-none focus:ring focus:ring-lightGray"
      onClick={() => handleViewDetails(t.invoiceNo)}
    >
      View Details
    </button>,
  ]);

  const handleViewDetails = (invoiceNo) => {
    alert(`View details for invoice: ${invoiceNo}`);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-white overflow-y-auto">
        <Header
          title="History"
          subheading="Reviewing past transactions and order history"
        />

          {/* Overview Cards */}
          <h2 className="p-9 pt-3 pb-1 font-bold">Invoices</h2>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mb-2 pl-8 pt-2 ">
            <div className="bg-white border rounded-lg shadow p-2">
              <p className="text-sm text-gray-500">Total Sales: <span className="mt-2 text-lg font-bold text-black">₱{totalSales}</span> </p>
            </div>

            <div className="bg-white border rounded-lg shadow p-2">
              <p className="text-sm text-gray-500">Total Transactions: <span className="mt-2 text-lg font-bold text-black">{totalTransactions}</span></p>
            </div>
          </div>

          {/* Table Section */}
          <Table headers={productHeaders} rows={rows} />

          {/* Actions Dropdown */}
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
              {/* Action items go here */}
            </div>
          )}
        </div>
      </div>
  );
};

export default History;
