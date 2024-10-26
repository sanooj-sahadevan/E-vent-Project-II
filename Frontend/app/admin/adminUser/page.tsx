"use client";

import {
  blockUserAPI,
  getAllUsersAPI,
  unblockUserAPI,
} from "@/services/adminAPI";
import Layout from "@/components/Admin/layout";
import Table from "@/components/Admin/table";
import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}

const AdminUserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Show 5 users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");

        const response = await getAllUsersAPI(token);
        setUsers(response);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleConfirmAction = async (user: User) => {
    if (user) {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");

        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u
          )
        );
        setCurrentUser(user);

        if (user.isBlocked) {
          await unblockUserAPI(user._id, token);
          console.log("unblock success");
        } else {
          await blockUserAPI(user._id, token);
          console.log("block success");
        }
      } catch (err) {
        console.error("Failed to update user status", err);
      }
    }
  };

  const headers = ["ID", "Name", "Email", "Status", "Action"];

  const renderUserRow = (user: User) => (
    <>
      <td className="px-6 py-4 border-b">{user._id}</td>
      <td className="px-6 py-4 border-b">{user.username}</td>
      <td className="px-6 py-4 border-b">{user.email}</td>
      <td className="px-6 py-4 border-b">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      </td>
      <td className="px-6 py-4 border-b text-center">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            user.isBlocked ? "bg-green-500 text-white" : "bg-red-500 text-white"
          } rounded-lg focus:outline-none hover:opacity-90 transition`}
          onClick={() => handleConfirmAction(user)}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>
      </td>
    </>
  );

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <Table<User> headers={headers} data={currentUsers} renderRow={renderUserRow} />
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUserPage;
