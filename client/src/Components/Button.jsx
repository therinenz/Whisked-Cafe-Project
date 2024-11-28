import React from 'react';
import { Plus } from 'lucide-react'; // Icon for the "+" symbol

const Button = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
};

export default Button;
