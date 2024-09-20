/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEdit } from 'react-icons/fa'; // Edit icon
import { VendorEdit } from '@/services/vendorAPI'; // API for editing vendor
import { toast } from 'react-toastify'; // Notifications for user feedback

interface Vendor {
  profileImage?: string;
  rating: string;
  vendorname: string;
  phone: number;
  email: string;
  address: string;
  district: string;
  state: string;
  reviews: string;
}

const EditVendor: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vendorDetails, setVendorDetails] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Image file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview URL for the image

  useEffect(() => {
    const vendorDetailsString = searchParams.get('query');

    if (vendorDetailsString) {
      try {
        const decodedString = decodeURIComponent(vendorDetailsString);
        const parsedVendor = JSON.parse(decodedString) as Vendor;
        setVendorDetails(parsedVendor);
      } catch (error) {
        console.error('Failed to parse vendor details from query:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  // Function to handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Preview image before upload
    }
  };

  // Function to save vendor details
  const saveVendorDetails = async () => {
    if (!vendorDetails) return;

    const formData = new FormData();
    formData.append('rating', vendorDetails.rating);
    formData.append('vendorname', vendorDetails.vendorname);
    formData.append('phone', vendorDetails.phone.toString());
    formData.append('email', vendorDetails.email);
    formData.append('address', vendorDetails.address);
    formData.append('district', vendorDetails.district);
    formData.append('state', vendorDetails.state);
    formData.append('reviews', vendorDetails.reviews);

    if (selectedImage) {
      formData.append('image', selectedImage); // Append the selected image file to the formData
    }

    try {
      const result = await VendorEdit(formData);
      if (result) {
        localStorage.setItem('vendor', JSON.stringify(result.data)); // Update local storage

        router.push(`/vendordashboard`); // Redirect on success
        toast.success('Vendor details updated successfully.');
      }
    } catch (err) {
      toast.error('An error occurred while saving vendor details. Please try again.');
      console.error('EditVendor API error:', err);
    }
  };

  // Toggle editing mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Display a loading state while data is being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle case where no vendor details are available
  if (!vendorDetails) {
    return <div>No vendor details available</div>;
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await saveVendorDetails();
        setIsEditing(false);
      }}
      className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-12"
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          {/* Profile Picture */}
          {vendorDetails?.profileImage || imagePreview ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 relative">
              <img
                src={imagePreview || vendorDetails.profileImage}
                alt="Vendor"
                className="w-full h-full object-cover"
              />
              {/* Edit Image Button */}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full hover:bg-gray-300 cursor-pointer">
                  <FaEdit className="text-gray-700" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange} // Handle image change
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

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
            vendorDetails.vendorname || 'N/A'
          )}
        </h2>

        {/* Inputs for email, phone, etc. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="text-gray-600">{vendorDetails.email || 'N/A'}</p>
            )}
          </div>

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
              <p className="text-gray-600">{vendorDetails.phone || 'N/A'}</p>
            )}
          </div>

          {/* Other input fields for state, district, etc. */}
          {/* State */}
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
              <p className="text-gray-600">{vendorDetails.state || 'N/A'}</p>
            )}
          </div>

          {/* District */}
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
              <p className="text-gray-600">{vendorDetails.district || 'N/A'}</p>
            )}
          </div>

          {/* Address */}
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
              <p className="text-gray-600">{vendorDetails.address || 'N/A'}</p>
            )}
          </div>

          {/* Reviews */}
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
              <p className="text-gray-600">{vendorDetails.reviews || 'N/A'}</p>
            )}
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="mt-6">
          {isEditing ? (
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-yellow-600 w-full"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default EditVendor;
