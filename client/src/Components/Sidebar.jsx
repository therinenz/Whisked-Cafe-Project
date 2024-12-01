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
    <aside className="flex flex-col w-42 min-h-screen bg-white border-r border-gray-300">
      {/* Logo and Cafe Information */}
      <div className="flex items-center gap-3 px-4 py-4">
        <img src={logo} alt="Whisked Cafe Logo" className="w-10 h-10" />
        <div>
          <h2 className="font-bold text-primary text-base">Whisked Cafe</h2>
          <p className="text-sm text-gray-500">{User}</p>
        </div>
      </div>

      {/* Navigation Items */}
      <ul className="space-y-1 text-sm">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 p-2 pl-8 hover:bg-hoverColor ${
                  isActive
                    ? "font-bold text-black bg-hoverColor before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-primary"
                    : "text-gray-500"
                }`
              }
            >
              {/* Icon */}
              <span>{item.icon}</span>
              {/* Text */}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
