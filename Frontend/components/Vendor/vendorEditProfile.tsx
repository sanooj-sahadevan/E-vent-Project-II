/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEdit } from 'react-icons/fa'; // Edit icon
import { VendorEdit, getPresignedUrl } from '@/services/vendorAPI'; // API for editing vendor
import { toast } from 'react-toastify'; // Notifications for user feedback
import Spinner from '../skeletons/spinner';
import { useForm } from 'react-hook-form';

interface Vendor {
  profileImage?: string;
  rating: string;
  vendorname: string;
  phone: number;
  email: string;
  address: string;
  district: string;
  state: string;
  Description: string;
}

const EditVendor: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vendorDetails, setVendorDetails] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Vendor>({
    defaultValues: vendorDetails || {},
  });

  useEffect(() => {
    const vendorDetailsString = searchParams.get('query');
    if (vendorDetailsString) {
      try {
        const decodedString = decodeURIComponent(vendorDetailsString);
        const parsedVendor = JSON.parse(decodedString) as Vendor;
        setVendorDetails(parsedVendor);
        setImagePreview(parsedVendor.profileImage || null); 
      } catch (error) {
        console.error('Failed to parse vendor details from query:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file); 

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      try {
        const data = await getPresignedUrl(file.name, file.type);
        if (data.url) {
          const uploadResult = await fetch(data.url, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (uploadResult.ok) {
            const s3Url = data.url.split('?')[0];
            setPhotoUrl(s3Url);
            toast.success('Image uploaded successfully.');
          } else {
            toast.error('Error uploading image to S3.');
          }
        } else {
          toast.error('Error fetching pre-signed URL.');
        }
      } catch (error) {
        console.error('Error during file upload:', error);
        toast.error('File upload failed.');
      }
    }
  };

  const saveVendorDetails = async (data: Vendor) => {
    const formData = {
      ...data,
      profileImage: photoUrl || vendorDetails?.profileImage,
    };

    try {
      const result = await VendorEdit(formData);

      if (result && result.data) {
        localStorage.setItem('vendor', JSON.stringify(result.data));

        if (result.data.vendor && result.data.vendor._id) {
          router.push(`/vendordashboard?vendorId=${result.data.vendor._id}`);
          toast.success('Vendor details updated successfully.');
        }
      }
    } catch (err) {
      toast.error('An error occurred while saving vendor details. Please try again.');
      console.error('EditVendor API error:', err);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  if (!vendorDetails) {
    return <div>No vendor details available</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(saveVendorDetails)}
      className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-12"
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-6">
          {/* Profile Picture */}
          {imagePreview ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 relative shadow-lg">
              <img
                src={imagePreview}
                alt="Vendor"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-md">
              No Image
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Upload New Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isEditing ? (
            <input
              type="text"
              {...register('vendorname', {
                required: 'Vendor name is required',
                validate: (value) => value.trim() !== '' || 'Whitespace is not allowed',
              })}
              className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
            />
          ) : (
            vendorDetails.vendorname || 'N/A'
          )}
          {errors.vendorname && (
            <p className="text-red-500 text-sm">{errors.vendorname.message}</p>
          )}
        </h2>

        {/* Inputs for email, phone, etc. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            {isEditing ? (
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email',
                  },
                })}
                className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
              />
            ) : (
              <p className="text-gray-600">{vendorDetails.email || 'N/A'}</p>
            )}
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            {isEditing ? (
              <input
                type="number"
                {...register('phone', {
                  required: 'Phone number is required',
                  validate: (value) =>
                    value.toString().length === 10 || 'Must be 10 digits',
                })}
                className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
              />
            ) : (
              <p className="text-gray-600">{vendorDetails.phone || 'N/A'}</p>
            )}
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            {isEditing ? (
              <input
                type="text"
                {...register('address', {
                  required: 'Address is required',
                  validate: (value) => value.trim() !== '' || 'Whitespace is not allowed',
                })}
                className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
              />
            ) : (
              <p className="text-gray-600">{vendorDetails.address || 'N/A'}</p>
            )}
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">District</label>
            {isEditing ? (
              <input
                type="text"
                {...register('district', {
                  required: 'District is required',
                  validate: (value) => value.trim() !== '' || 'Whitespace is not allowed',
                })}
                className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
              />
            ) : (
              <p className="text-gray-600">{vendorDetails.district || 'N/A'}</p>
            )}
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">State</label>
            {isEditing ? (
              <input
                type="text"
                {...register('state', {
                  required: 'State is required',
                  validate: (value) => value.trim() !== '' || 'Whitespace is not allowed',
                })}
                className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
              />
            ) : (
              <p className="text-gray-600">{vendorDetails.state || 'N/A'}</p>
            )}
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Description</label>
          {isEditing ? (
            <textarea
              {...register('Description', {
                required: 'Description is required',
                validate: (value) => value.trim() !== '' || 'Whitespace is not allowed',
              })}
              className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
              rows={4}
            />
          ) : (
            <p className="text-gray-600">{vendorDetails.Description || 'N/A'}</p>
          )}
          {errors.Description && (
            <p className="text-red-500 text-sm">{errors.Description.message}</p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-blue-500"
            onClick={handleEditToggle}
          >
            <FaEdit /> {isEditing ? 'Cancel Edit' : 'Edit Vendor'}
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition duration-200"
          >
            {isEditing ? 'Save Changes' : 'View'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditVendor;
