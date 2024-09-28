
'use client'
import React, { useState } from 'react';

const PasswordUpdateForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for password update (e.g., API call)
    console.log('Updating password:', { currentPassword, newPassword });
  };

  return (

    <div className="flex justify-center items-center min-h-screen">
  <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96">
    <h2 className="text-center text-2xl font-semibold mb-6">Update Password</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
      <div>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full bg-pink-400 text-white py-2 rounded-full focus:outline-none hover:bg-pink-500 transition-all"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</div>

   
  );
};

export default PasswordUpdateForm;
