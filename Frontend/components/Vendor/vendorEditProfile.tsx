'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaEdit } from 'react-icons/fa'; // Edit icon
import { VendorEdit } from "@/services/vendorAPI";
import { toast } from 'react-toastify'; // Assuming you're using toast for notifications

interface Vendor {
  rating: string;
  vendorname: string;
  phone: number;
  email: string;
  profileImage?: string;
  address: string;
  district: string;
  state: string;
  reviews: string;
}

const EditVendor: React.FC = () => {
  const searchParams = useSearchParams();
  const [vendorDetails, setVendorDetails] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the query string and parse it
  useEffect(() => {
    const vendorDetailsString = searchParams.get('query');
    console.log("Raw query string from URL:", vendorDetailsString);

    if (vendorDetailsString) {
      try {
        const decodedString = decodeURIComponent(vendorDetailsString);
        const parsedVendor = JSON.parse(decodedString) as Vendor;
        setVendorDetails(parsedVendor);
        console.log("Parsed vendor details:", parsedVendor);
      } catch (error) {
        console.error("Failed to parse vendor details from query:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  // Function to save vendor details
  const saveVendorDetails = async () => {
    if (!vendorDetails) return;

    const reqBody = {
      rating: vendorDetails.rating,
      vendorname: vendorDetails.vendorname,
      phone: vendorDetails.phone,
      email: vendorDetails.email,
      profileImage: vendorDetails.profileImage,
      address: vendorDetails.address,
      district: vendorDetails.district,
      state: vendorDetails.state,
      reviews: vendorDetails.reviews,
    };

    try {
      const result = await VendorEdit(reqBody);
      console.log('main content', result.data);
    
      if (result) {
        // Update localStorage with result.data
        localStorage.setItem("vendor", JSON.stringify(result.data));
    
        toast.success("Vendor details updated successfully.");
      }
    } catch (err) {
      toast.error("An error occurred while saving vendor details. Please try again.");
      console.error('EditVendor API error:', err);
    }
    
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!vendorDetails) {
    return <div>No vendor details available</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-12">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isEditing ? (
            <input
              type="text"
              value={vendorDetails.vendorname}
              className="border border-gray-300 rounded p-2 w-full"
              onChange={(e) =>
                setVendorDetails((prev) =>
                  prev ? { ...prev, vendorname: e.target.value } : null
                )
              }
            />
          ) : (
            vendorDetails?.vendorname || 'N/A'
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="text"
                value={vendorDetails.email}
                className="border border-gray-300 rounded p-2 w-full"
                onChange={(e) =>
                  setVendorDetails((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
              />
            ) : (
              <p className="text-gray-600">{vendorDetails?.email || 'N/A'}</p>
            )}
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-gray-700">Phone Number</label>
            {isEditing ? (
              <input
                type="number"
                value={vendorDetails.phone}
                className="border border-gray-300 rounded p-2 w-full"
                onChange={(e) =>
                  setVendorDetails((prev) =>
                    prev ? { ...prev, phone: Number(e.target.value) } : null
                  )
                }
              />
            ) : (
              <p className="text-gray-600">{vendorDetails?.phone || 'N/A'}</p>
            )}
          </div>

          {/* State Input */}
          <div>
            <label className="block text-gray-700">State</label>
            {isEditing ? (
              <input
                type="text"
                value={vendorDetails.state}
                className="border border-gray-300 rounded p-2 w-full"
                onChange={(e) =>
                  setVendorDetails((prev) =>
                    prev ? { ...prev, state: e.target.value } : null
                  )
                }
              />
            ) : (
              <p className="text-gray-600">{vendorDetails?.state || 'N/A'}</p>
            )}
          </div>

          {/* District Input */}
          <div>
            <label className="block text-gray-700">District</label>
            {isEditing ? (
              <input
                type="text"
                value={vendorDetails.district}
                className="border border-gray-300 rounded p-2 w-full"
                onChange={(e) =>
                  setVendorDetails((prev) =>
                    prev ? { ...prev, district: e.target.value } : null
                  )
                }
              />
            ) : (
              <p className="text-gray-600">{vendorDetails?.district || 'N/A'}</p>
            )}
          </div>

          {/* Address Input */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={vendorDetails.address}
                className="border border-gray-300 rounded p-2 w-full"
                onChange={(e) =>
                  setVendorDetails((prev) =>
                    prev ? { ...prev, address: e.target.value } : null
                  )
                }
              />
            ) : (
              <p className="text-gray-600">{vendorDetails?.address || 'N/A'}</p>
            )}
          </div>

          {/* Description (Big Textbox for Reviews) */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700">Description</label>
            {isEditing ? (
              <textarea
                value={vendorDetails.reviews}
                className="border border-gray-300 rounded p-2 w-full h-24"
                onChange={(e) =>
                  setVendorDetails((prev) =>
                    prev ? { ...prev, reviews: e.target.value } : null
                  )
                }
              />
            ) : (
              <p className="text-gray-600">{vendorDetails?.reviews || 'N/A'}</p>
            )}
          </div>
        </div>

        {/* Ratings and View Reviews */}
        <div className="flex justify-between items-center mt-6">
          <div className="bg-green-500 text-white rounded-full px-4 py-1 text-sm">
            {vendorDetails?.rating || '4.7'}
          </div>
          <a href="#" className="text-sm text-green-600">
            View Reviews
          </a>
        </div>

        {/* Edit and Save Buttons */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleEditToggle}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 mr-2"
          >
            <FaEdit className="text-gray-700" />
          </button>

          {isEditing && (
            <button
              onClick={async () => {
                await saveVendorDetails(); // Save vendor details
                setIsEditing(false); // Exit edit mode after saving
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditVendor;
