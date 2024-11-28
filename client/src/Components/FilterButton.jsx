import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const FilterButton = ({ options, onFilterSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(options[0]); // Default to the first option

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    onFilterSelect(filter); // Notify parent component
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-40" // Fixed width
      >
        <Filter className="h-4 w-4" />
        <span className="truncate">{selectedFilter}</span> {/* Truncate long text */}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleFilterClick(option)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
