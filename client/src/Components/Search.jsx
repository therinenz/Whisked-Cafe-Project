import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

const Search = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-1.5 focus:border-primary focus:outline-none  focus:ring-primary sm:w-64"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Search;
