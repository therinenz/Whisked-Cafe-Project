import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBasket,
  History,
  Users,
} from "lucide-react";

import logo from "../assets/Logo.png";

const Sidebar = ({ User }) => {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Inventory", path: "/inventory", icon: <Package className="w-5 h-5" /> },
    { name: "Product", path: "/product", icon: <ShoppingBasket className="w-5 h-5" /> },
    { name: "History", path: "/history", icon: <History className="w-5 h-5" /> },
    { name: "Employee", path: "/employee", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-52 h-screen border-r" aria-label="Sidebar">
      {/* Sidebar Container */}
      <div className="h-full px-3 py-4 overflow-y-auto bg-whiteBg">
        {/* Logo and Cafe Information */}
        <div className="flex items-center gap-3 mb-5 px-2.5">
          <img src={logo} alt="Whisked Cafe Logo" className="w-8 h-8" />
          <div>
            <h2 className="text-balance font-bold text-primary">Whisked Cafe</h2>
            <p className="text-sm text-gray-500">{User}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2 font-normal text-sm pl-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg hover:bg-gray-100 ${
                    isActive ? "bg-gray-100 font-bold text-black" : "text-mediumGray"
                  }`
                }
              >
                {/* Icon */}
                <span>{item.icon}</span>
                {/* Text */}
                <span className="ms-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
