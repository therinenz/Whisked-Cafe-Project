import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ selectedDate, onDateSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const today = new Date(); // Current date

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
    "July", "August", "September", "October", "November", "December",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const years = Array.from({ length: 12 }, (_, i) => currentDate.getFullYear() - 5 + i);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    const correctedDate = new Date(date);
    onDateSelect(correctedDate);
    onClose(); // Close the calendar when a date is selected
  };

  const handleMonthSelect = (index) => {
    setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
    setShowMonthPicker(false); // Navigate back to the date view
  };

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false); // Navigate back to the date view
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const isCalendarClick = target.closest(".calendar-dropdown");
      const isDateInputClick = target.closest(".date-input");
      const isMonthYearPicker = target.closest(".month-year-picker");
      const isMonthYearSelection =
        target.closest("[data-type='month-selection']") ||
        target.closest("[data-type='year-selection']");

      if (!isCalendarClick && !isDateInputClick && !isMonthYearPicker && !isMonthYearSelection) {
        onClose?.();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="bg-white rounded-lg shadow p-4 w-[300px]">
      <div className="flex justify-between items-center mb-4">
        {!showMonthPicker && !showYearPicker && (
          <button onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex gap-1">
          <button
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            className="font-semibold hover:bg-gray-200 px-2 py-1 rounded month-year-picker"
          >
            {months[currentDate.getMonth()]}
          </button>
          <button
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            className="font-semibold hover:bg-gray-200 px-2 py-1 rounded month-year-picker"
          >
            {currentDate.getFullYear()}
          </button>
        </div>

        {!showMonthPicker && !showYearPicker && (
          <button onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {showMonthPicker ? (
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => {
                handleMonthSelect(index);
              }}
              className={`p-2 text-sm rounded hover:bg-gray-200 
                ${currentDate.getMonth() === index ? "bg-[#B85C38] text-white" : ""}`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
      ) : showYearPicker ? (
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                handleYearSelect(year);
              }}
              className={`p-2 text-sm rounded hover:bg-gray-200 
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
                day,
                12
              );

              // Check if the date matches today's date
              const isToday =
                today.toDateString() === date.toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(date)}
                  className={`p-2 text-center rounded hover:bg-gray-200 
                    ${date.toDateString() === selectedDate?.toDateString() ? "bg-primary text-white" : ""}
                    ${isToday ? "bg-primary font-bold" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;
