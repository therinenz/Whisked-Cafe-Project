import React from 'react'

const Header = ({ title, subheading }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 pl-8  border-b bg-whiteBg">
      {/* Title and Subheading */}
      <div>
        <h1 className="text-lg font-extrabold text-primary">{title}</h1>
        <p className="text-sm text-darkGray">{subheading}</p>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <div className="w-8 h-8 rounded-full bg-[#FFA07A] flex items-center justify-center mr-5">
          <span className="sr-only">User profile</span>
        </div>
      </div>
    </div>
  );
};


export default Header
