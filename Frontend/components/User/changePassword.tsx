'use client'
import React, { useState } from 'react';
import { changePassword } from '@/services/userApi';

const PasswordUpdateForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await changePassword(userId, newPassword); 
      console.log({ data }, 'changePassword');
      setLoading(false);
    } catch (err: any) {
      setError('Error updating password');
      console.error(err);
      setLoading(false);
    }
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
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdateForm;
