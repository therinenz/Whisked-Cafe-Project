import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const Calendar = ({ onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const handleMonthChange = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset)
    );
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onDateChange(newDate); // Pass the selected date to the parent component
    setIsOpen(false); // Close the dropdown
  };

  const isToday = (day) =>
    day === new Date().getDate() &&
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  const isSelected = (day) =>
    day === selectedDate.getDate() &&
    currentDate.getMonth() === selectedDate.getMonth() &&
    currentDate.getFullYear() === selectedDate.getFullYear();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button to toggle calendar dropdown */}
      <button
        onClick={toggleDropdown}
        className="flex items-center pr-4 py-1.5 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-50"
      >
        <CalendarIcon className="w-10 h-4  text-[#8B4513]" />
        {selectedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute left-1/2 mt-2 transform -translate-x-1/2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => handleMonthChange(-1)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-sm font-medium text-gray-900">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => handleMonthChange(1)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Days of the Week */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-500">
              {days.map((day) => (
                <div key={day}>{day.slice(0, 2)}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={`h-8 w-8 text-sm flex items-center justify-center rounded-full ${
                      isToday(day)
                        ? "bg-gray-900 text-white"
                        : isSelected(day)
                        ? "bg-gray-300 text-black"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
