"use client";
import { getAllBookingsAPI } from "@/services/adminAPI";
import Layout from "@/components/Admin/layout";
import Table from "@/components/Admin/table";
import { ReactNode, useEffect, useState } from "react";

interface Booking {
  vendorname: ReactNode;
  _id: string;
  vendorId: string;
  userId: string;
  category: string;
  totalAmount: number;
  paymentType: string;
  paymentStatus: string;
  txnId: string;
  createdAt: string;
  updatedAt: string;
}

const AdminVendorPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");

        const response = await getAllBookingsAPI(token);
        setBookings(response.data || []);
        console.log("Fetched bookings:", response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Error fetching data");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Pagination logic
 // Pagination logic
 const indexOfLastVendor = currentPage * bookingsPerPage;
 const indexOfFirstVendor = indexOfLastVendor - bookingsPerPage;
 const currentVendors = bookings.slice(indexOfFirstVendor, indexOfLastVendor);

 const totalPages = Math.ceil(bookings.length / bookingsPerPage);

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

//  const handleToggleBlock = (id: string) => {
//    setCompanies((prevCompanies) =>
//      prevCompanies.map((vendor) =>
//        vendor._id === id
//          ? { ...vendor, isBlocked: !vendor.isBlocked }
//          : vendor
//      )
//    );
//  };



 const headers = ["ID", "Vendor Name", "User Name", "Catergory", "date" , "payment"];

 const renderVendorRow = (vendor: Booking) => (
  <>
    <td className="px-6 py-4 border-b">{vendor._id}</td>
    <td className="px-6 py-4 border-b">{typeof vendor.vendorId === 'object' ? vendor.vendorId.vendorname: vendor.vendorname}</td>
    <td className="px-6 py-4 border-b">{typeof vendor.userId === 'object' ? vendor.userId.username : vendor.userId}</td>
    <td className="px-6 py-4 border-b">{vendor.category}</td>
    <td className="px-6 py-4 border-b">{vendor.createdAt}</td>
    <td className="px-6 py-4 border-b">{vendor.paymentStatus}</td>

  </>
);
;

 return (
   <Layout>
     <div className="container mx-auto p-6">
       <h1 className="text-2xl font-bold mb-6">Company Management</h1>
       <Table<Booking>
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
