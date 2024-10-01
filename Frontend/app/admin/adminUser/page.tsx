/* eslint-disable react/jsx-no-undef */
"use client";

import {
     blockUserAPI,
     getAllUsersAPI,
      unblockUserAPI
     } from "@/services/adminAPI";
import Layout from "@/components/Admin/layout";
import Table from "@/components/Admin/table";

// import Topbar from "@/components/adminTopbar";
import React, { use, useEffect, useState } from "react";

interface User {
    _id: string;
    username: string;
    email: string;
    isBlocked: boolean;
}

const AdminUserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User>();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) throw new Error("No token found");

                const response = await getAllUsersAPI(token);
                setUsers(response);
            } catch (err) {
                console.error("Error fetching users:", err);
                // setError("Failed to fetch users");
            } finally {
                // setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const handleConfirmAction = async (user: any) => {
        if (user) {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) throw new Error("No token found");

                setUsers((prevUsers) =>
                    prevUsers.map((users) =>
                        users._id === user._id
                            ? { ...users, isBlocked: !users.isBlocked }
                            : users
                    )
                );
                setCurrentUser(user)

                if (user?.isBlocked) {
                    await unblockUserAPI(user._id, token);
                    console.log("unblock success");
                    //   toast.success("User unblocked successfully");
                } else {
                    await blockUserAPI(user?._id, token);
                    console.log("block success");
                    //   toast.success("User blocked successfully");
                }
            } catch (err) {
                console.error("Failed to update user status", err);
                // setError("Failed to update user status");
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
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                >
                    {user.isBlocked ? "Blocked" : "Active"}
                </span>
            </td>
            <td className="px-6 py-4 border-b text-center">
                <button
                    className={`px-4 py-2 text-sm font-medium ${user.isBlocked ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        } rounded-lg focus:outline-none hover:opacity-90 transition`}
                    //   onClick={() => handleToggleBlock(user._id)}
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
                <Table<User> headers={headers} data={users} renderRow={renderUserRow} />
            </div>
        </Layout>
    );
};

export default AdminUserPage;