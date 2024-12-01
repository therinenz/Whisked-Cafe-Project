import React, { useState } from "react";
import Header from "../../Components/Header"; // Import Header component
import {
  BarChart4, // Alternative for ChartIcon
  Download,    // For export button.
  ArrowUpRight, // For summary card (Sales Today).
  ArrowDownRight, // For summary card (Monthly Earnings).
  Package, // For summary card (Items in Stock).
  RefreshCw, // For summary card (Restock).
  TrendingUp,
} from "lucide-react";

import SalesAnalytics from "../../Components/SalesAnalytics";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "../../Components/Calendar";


// Utility function for currency formatting
const formatCurrency = (value) => `₱ ${value.toLocaleString("en-US")}`;


// Placeholders
const summaryData = [
  {
    title: "Sales Today",
    value: "₱5,000",
    subtext: "+20% vs yesterday",
    icon: <ArrowUpRight className="w-4 h-4 text-green-500" />,
    color: "bg-primary", // Brown
  },
  {
    title: "Monthly Earnings",
    value: "₱10,000",
    subtext: "-5% vs last month",
    icon: <ArrowDownRight className="w-4 h-4 text-red-500" />,
    color: "bg-primary", // Brown
  },
  {
    title: "Items in Stock",
    value: "15",
    subtext: "Inventory available",
    icon: <Package className="w-4 h-4 text-blue-500" />,
    color: "bg-green-500", // Green
  },
  {
    title: "Restock",
    value: "4",
    subtext: "Pending Refill",
    icon: <RefreshCw className="w-4 h-4 text-yellow-500" />,
    color: "bg-yellow-500", // Yellow
  },
];


const topSellingProducts = [
  { name: "Cappuccino", revenue: 10000 },
  { name: "Americano", revenue: 8000 },
  { name: "Spanish Latte", revenue: 5000 },
  { name: "Taro", revenue: 4000 },
  { name: "Green Apple", revenue: 4000 },
];

const salesSummary = [
  { employeeName: "Bj Cabaat", totalSales: 6000, totalTransactions: 32 },
  { employeeName: "Kim Quinonez", totalSales: 5000, totalTransactions: 21 },
];

const employeesLogin = [
  { name: "Jin Failana", role: "Cashier", timeIn: "3:10 PM", timeOut: "Active" },
  { name: "Bj Cabaat", role: "Cashier", timeIn: "9:00 AM", timeOut: "3:00 PM" },
];



// Main Dashboard Component
const Dashboard = () => {
        const [selectedDate, setSelectedDate] = useState(new Date()); // State for date picker

        const handleDateChange = (newDate) => {
          setSelectedDate(newDate);
          console.log("Selected Date:", newDate);
          // Add your logic to fetch or update data for the new date here
        };


        return (
      <div className="flex h-screen bg-whiteBg overflow-hidden">

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
          <Header title="Dashboard" subheading="Overview" />
          <div className="m-8 mt-3">


          {/* Date Picker and Export  */}
          <div className="flex justify-between">

          <h2 className="text-xl font-semibold text-brown-900 items-center mt-2">
            Hello, Ericka! 👋
          </h2>

          <div className="flex items-center mb-3">
           
          <Calendar onDateChange={handleDateChange} />

            <button className="flex items-center gap-2 ml-2 rounded-lg border bg-white px-2 py-2 text-sm font-medium text-darkGray shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
              Export as PDF
              
            </button>
            </div>
            </div>


          {/* 4 Summary Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
  {summaryData.map((item, index) => (
    <div
      key={index}
      className="bg-white p-3 pr-6 rounded-lg shadow relative border"
      style={{
        height: '90px', // Smaller height for the card
        minWidth: '120px', // Adjusted width to make it compact
      }}
    >
      <div
        className={`absolute h-14 top-4 left-5 w-1 rounded ${item.color}`} // Reduced the vertical line height and position
      ></div>
      <div className="ml-6">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xs font-medium text-darkGray">{item.title}</h3> {/* Smaller title text */}
          {item.icon}
        </div>
        <p className="text-lg font-bold mb-1">{item.value}</p> {/* Slightly smaller font for value */}
        <p className="text-xs text-gray-500">{item.subtext}</p>
      </div>
    </div>
  ))}
</div>



        {/* Analytics and Top Products */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
  {/* Sales Analytics */}
  <div className="sm:col-span-2">
    
    <SalesAnalytics />
  </div>

  {/* Top Selling Products */}
  <div className="bg-white p-8 pb-0 pt-4 rounded-lg shadow">
    <h2 className="text-base font-semibold flex items-center mb-4">
      <TrendingUp className="w-5 h-5 mr-2" />
      Top Selling Products
    </h2>
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-sm text-mediumGray">
          <td className="pb-2 pr-10">Product Name</td>
          <td className="pb-2">Revenue</td>
        </tr>
      </thead>
      <tbody>
        {topSellingProducts.map((product, index) => (
          <tr
            key={index}
            className={`border-t ${index === topSellingProducts.length - 1 ? '' : 'border-gray-200'}`}
          >
            <td className="py-3 pr-4">{product.name}</td>
            <td className="py-3">{formatCurrency(product.revenue)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


{/* Sales Summary and Employee Login */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

  {/* Sales Summary */}
  <div className="bg-white p-4 pb-2 pt-3 rounded-lg shadow">
    <h2 className="text-base font-bold mb-3">Sales Summary</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <td className="pb-2.5 pr-4">Employee Name</td>
            <td className="pb-2.5 pr-4">Total Sales</td>
            <td className="pb-2.5">Total Transactions</td>
          </tr>
        </thead>
        <tbody>
          {salesSummary.map((employee, index) => (
            <tr key={index} className="border-t">
              <td className="py-2.5">{employee.employeeName}</td>
              <td className="py-2.5">{formatCurrency(employee.totalSales)}</td>
              <td className="py-2.5">{employee.totalTransactions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Employees Login */}
  <div className="bg-white p-4 pb-2 pt-3 rounded-lg shadow">
    <h2 className="text-base font-bold mb-3">Employees Login</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <td className="pb-2.5">Name</td>
            <td className="pb-2.5">Role</td>
            <td className="pb-2.5">Time In</td>
            <td className="pb-2.5">Time Out</td>
          </tr>
        </thead>
        <tbody>
          {employeesLogin.map((employee, index) => (
            <tr key={index} className="border-t">
              <td className="py-2.5">{employee.name}</td>
              <td className="py-2.5">{employee.role}</td>
              <td className="py-2.5">{employee.timeIn}</td>
              <td className="py-2.5">{employee.timeOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

</div>

          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
