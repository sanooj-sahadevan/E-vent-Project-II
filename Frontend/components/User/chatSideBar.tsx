import React from 'react';

interface ChatSidebarProps {
  vendors: string[];
  selectedVendor: string;
  setSelectedVendor: (vendor: string) => void;
}


const ChatSidebar: React.FC<ChatSidebarProps> = ({ vendors, selectedVendor, setSelectedVendor }) => {
  return (
    <div className="w-1/4 h-full bg-gray-200 p-4">
      {vendors.length > 0 ? (
        <ul>
          {vendors.map((name, index) => (
            <li
              key={index}
              onClick={() => setSelectedVendor(name)}
              className={`mb-4 cursor-pointer text-lg p-2 rounded-lg hover:bg-pink-100 
              ${selectedVendor === name ? 'bg-pink-400 text-white' : 'bg-gray-100 text-black'}`}
            >
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No vendors available</p>
      )}
    </div>
  );
};

export default ChatSidebar;


