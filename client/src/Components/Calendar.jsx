import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ selectedDate, onDateSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const today = new Date();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate array of years (from current year - 10 to current year + 10)
  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 10 + i);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
  
    const displayFormat = `${year} / ${month} / ${day}`; // Display format
    const dbFormat = date.toISOString().split("T")[0]; // Database format
  
    onDateSelect({ dbFormat, displayFormat });
    if (onClose) onClose();
  };
  

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth()));
    setShowYearPicker(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-[300px]">
      <div className="flex justify-between items-center mb-4">
        {!showMonthPicker && !showYearPicker && (
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            className="font-semibold hover:bg-gray-100 px-2 py-1 rounded"
          >
            {months[currentDate.getMonth()]}
          </button>
          <button
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            className="font-semibold hover:bg-gray-100 px-2 py-1 rounded"
          >
            {currentDate.getFullYear()}
          </button>
        </div>

        {!showMonthPicker && !showYearPicker && (
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {showMonthPicker ? (
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={`p-2 text-sm rounded hover:bg-gray-100 
                ${currentDate.getMonth() === index ? "bg-[#B85C38] text-white" : ""}`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
      ) : showYearPicker ? (
        <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`p-2 text-sm rounded hover:bg-gray-100 
                ${currentDate.getFullYear() === year ? "bg-[#B85C38] text-white" : ""}`}
            >
              {year}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-sm text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );

              const isToday = today.toDateString() === date.toDateString();
              const isSelected = selectedDate && 
                selectedDate.toDateString() === date.toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(date)}
                  className={`p-2 text-center rounded hover:bg-gray-100 
                    ${isSelected ? "bg-[#B85C38] text-white" : ""}
                    ${isToday ? "font-bold border border-[#B85C38]" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => handleDateSelect(new Date())}
          className="text-sm text-[#B85C38] hover:underline"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default Calendar;
