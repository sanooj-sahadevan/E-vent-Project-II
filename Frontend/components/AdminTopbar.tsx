/* eslint-disable @next/next/no-img-element */
// components/Topbar.tsx

import React from 'react';

const Topbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow rounded-lg">
      <div className="flex items-center">
        <input 
          type="text" 
          placeholder="Search" 
          className="px-4 py-2 rounded-full border border-gray-300" 
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <span role="img" aria-label="Notifications">🔔</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Admin</span>
          {/* <img 
            src="/img/DefaultProfilePicMale.png" 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
