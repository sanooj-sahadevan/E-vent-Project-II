import React from 'react';

interface ChatSidebarProps {
  users: string[];
  selectedUser: string;
  setSelectedUser: (user: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ users, selectedUser, setSelectedUser }) => {
  return (
    <div className="w-1/4 h-full bg-gray-200 p-4">
      {users.length > 0 ? (
        <ul>
          {users.map((name, index) => (
            <li
              key={index}
              onClick={() => setSelectedUser(name)}
              className={`mb-4 cursor-pointer text-lg p-2 rounded-lg hover:bg-blue-200 
              ${selectedUser === name ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
            >
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users available</p>
      )}
    </div>
  );
};

export default ChatSidebar;
