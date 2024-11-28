import React, { useState } from "react";
import Header from "../../Components/Header"; // Import Header component
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  RefreshCw,
  TrendingUp,
  Calendar,
  Download,
  BarChart4,
  
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart } from "@tremor/react"

// Utility function for currency formatting
const formatCurrency = (value) => `₱ ${value.toLocaleString("en-US")}`;

// Custom Date Button for DatePicker
const CustomDateButton = React.forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    ref={ref}
    className="flex items-center px-3 py-2 bg-white border rounded shadow text-gray-700 hover:bg-gray-50"
  >
    <Calendar className="w-4 h-4 mr-2 text-[#8B4513]" />
    {value}
  </button>
));
CustomDateButton.displayName = "CustomDateButton";

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


const salesData = [
  {
    date: "Jan 23",
    SolarPanels: 2890,
    Inverters: 2338,
  },
  {
    date: "Feb 23",
    SolarPanels: 2756,
    Inverters: 2103,
  },
  {
    date: "Mar 23",
    SolarPanels: 3322,
    Inverters: 2194,
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
        return (
      <div className="flex h-screen bg-whiteBg">

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
          <Header title="Dashboard" subheading="Overview" />
          <div className="m-8">


          {/* Date Picker and Export  */}
          <div className="flex justify-between">

          <h2 className="text-2xl font-semibold text-brown-900 items-center">
            Hello, Ericka! 👋
          </h2>

          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">
                Date:
              </span>

              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMM dd, yyyy"
                customInput={
                  <CustomDateButton
                    value={selectedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  />
                }
              />
              </div>

            <button className="flex items-center gap-2 ml-4 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-darkGray shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
              Export as PDF
              
            </button>
            </div>
            </div>


          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow relative border">
              <div
                className={`absolute h-16 top-6 left-4 w-1 rounded ${item.color}`}></div>
              <div className="ml-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-darkGray">
                    {item.title}
                  </h3>
                  {item.icon}
                </div>
                <p className="text-xl font-bold mb-1">{item.value}</p>
                <p className="text-xs text-gray-500">{item.subtext}</p>
              </div>
            </div>
              ))}
            </div>


          {/* Analytics and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

            {/* Sales Analytics */}
            <div className="lg:col-span-2 bg-white p-8 pt-4 rounded-lg shadow">
              <h2 className="text-base font-bold mb-4 flex items-center">
                <BarChart4 className="w-5 h-5 mr-2" />
                Sales Analytics
              </h2>
              <BarChart
              className="h-64 text-sm"
              data={salesData}
              index="date"
              categories={["SolarPanels", "Inverters"]}
              colors={["blue", "orange"]}
              valueFormatter={(number) =>
                `₱ ${Intl.NumberFormat("en-PH").format(number)}`
              }
            />
          </div>


            {/* Top Selling Products */}
            <div className="bg-white p-8 pt-4 rounded-lg shadow">
              <h2 className="text-base font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Top Selling Products
              </h2>
        <table className="min-w-full text-sm ">
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
                className={`border-t ${index === topSellingProducts.length - 1 ? '' : 'border-gray-200'}`}>
                <td className="py-3 pr-4">{product.name}</td>
                <td className="py-3">{formatCurrency(product.revenue)}</td>
              </tr>
              ))}
            </tbody>
        </table>
              </div>
              </div>


          {/* Sales Summary and Employee Login */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Sales Summary */}
            <div className="bg-white p-8 pt-4 rounded-lg shadow ">
              <h2 className="text-base font-bold mb-4">Sales Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm ">
                  <thead>
                    <tr className="text-left text-mediumGray">
                      <td className="pb-2 pr-10">Employee Name</td>
                      <td className="pb-2 pr-10">Total Sales</td>
                      <td className="pb-2">Total Transactions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {salesSummary.map((employee, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3">{employee.employeeName}</td>
                        <td className="py-3">{formatCurrency(employee.totalSales)}</td>
                        <td className="py-3">{employee.totalTransactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Employees Login */}
            <div className="bg-white p-8 pt-4  rounded-lg shadow">
              <h2 className="text-base font-bold mb-4">Employees Login</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-mediumGray text-sm">
                      <td className="pb-2">Name</td>
                      <td className="pb-2">Role</td>
                      <td className="pb-2">Time In</td> 
                      <td className="pb-2">Time Out</td>
                    </tr>
                  </thead>
                  <tbody>
                    {employeesLogin.map((employee, index) => (
                      <tr key={index} className="border-t text-sm">
                        <td className="py-3">{employee.name}</td>
                        <td className="py-3">{employee.role}</td>
                        <td className="py-3">{employee.timeIn}</td>
                        <td className="py-3">{employee.timeOut}</td>
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
