"use client";
import {
  blockVendorAPI,
  getAllVendorAPI,
  unblockVendorAPI
} from "@/services/adminAPI";
import Layout from "@/components/Admin/layout";
import Table from "@/components/Admin/table";
import { useEffect, useState } from "react";

interface Vendor {
  _id: string;
  vendorname: string;
  email: string;
  isBlocked: boolean;
}

const AdminVendorPage: React.FC = () => {
  const [companies, setCompanies] = useState<Vendor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsPerPage] = useState(5); // Show 5 vendors per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");

        const response = await getAllVendorAPI(token);
        console.log(response);

        setCompanies(response);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Pagination logic
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = companies.slice(indexOfFirstVendor, indexOfLastVendor);

  const totalPages = Math.ceil(companies.length / vendorsPerPage);

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

  const handleToggleBlock = (id: string) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((vendor) =>
        vendor._id === id
          ? { ...vendor, isBlocked: !vendor.isBlocked }
          : vendor
      )
    );
  };

  const handleConfirmAction = async (user: any) => {
    if (user) {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");

        setCompanies((prevUsers) =>
          prevUsers.map((vendor) =>
            vendor._id === user._id
              ? { ...vendor, isBlocked: !vendor.isBlocked }
              : vendor
          )
        );

        if (user.isBlocked) {
          await unblockVendorAPI(user._id, token);
          console.log("unblock success");
        } else {
          await blockVendorAPI(user?._id, token);
          console.log("block success");
        }
      } catch (err) {
        console.error("Failed to update user status", err);
      }
    }
  };

  const headers = ["ID", "Name", "Email", "Status", "Action"];

  const renderVendorRow = (vendor: Vendor) => (
    <>
      <td className="px-6 py-4 border-b">{vendor._id}</td>
      <td className="px-6 py-4 border-b">{vendor.vendorname}</td>
      <td className="px-6 py-4 border-b">{vendor.email}</td>
      <td className="px-6 py-4 border-b">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.isBlocked
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"
            }`}
        >
          {vendor.isBlocked ? "Blocked" : "Active"}
        </span>
      </td>
      <td className="px-6 py-4 border-b text-center">
        <button
          className={`px-4 py-2 text-sm font-medium ${vendor.isBlocked
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
            } rounded-lg focus:outline-none hover:opacity-90 transition`}
          onClick={() => handleConfirmAction(vendor)}
        >
          {vendor.isBlocked ? "Unblock" : "Block"}
        </button>
      </td>
    </>
  );

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Company Management</h1>
        <Table<Vendor>
          headers={headers}
          data={currentVendors}
          renderRow={renderVendorRow}
        />

        {/* Pagination controls */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          {/* <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span> */}
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

export default AdminVendorPage;
