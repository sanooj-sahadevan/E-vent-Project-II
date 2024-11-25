/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { VendorEdit, getPresignedUrl } from '@/services/vendorAPI';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import Spinner from '../skeletons/spinner';

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
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
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
        // Pre-fill form with vendor details
        Object.entries(parsedVendor).forEach(([key, value]) =>
          setValue(key as keyof Vendor, value)
        );
      } catch (error) {
        console.error('Failed to parse vendor details from query:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams, setValue]);

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
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
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

  const saveVendorDetails = async (formData: Vendor) => {
    if (!vendorDetails) return;

    const updatedData = {
      ...formData,
      profileImage: photoUrl || vendorDetails.profileImage,
    };

    try {
      const result = await VendorEdit(updatedData);

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
          {imagePreview ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 relative shadow-lg">
              <img src={imagePreview} alt="Vendor" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shadow-md">
              No Image
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="text"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be 10 digits',
                },
              })}
              className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
            />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Vendor Name</label>
            <input
              type="text"
              {...register('vendorname', {
                required: 'Vendor name is required',
                validate: (value) =>
                  value.trim() !== '' || 'Vendor name cannot be empty or whitespace only',
              })}
              className="border border-gray-300 rounded p-2 w-full hover:border-pink-500 transition duration-200"
            />
            {errors.vendorname && <p className="text-red-500">{errors.vendorname.message}</p>}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="text-pink-600 hover:underline focus:outline-none"
            onClick={handleEditToggle}
          >
            {isEditing ? 'Cancel' : <FaEdit className="inline" />} Edit
          </button>

          {isEditing && (
            <button
              type="submit"
              className="bg-pink-600 text-white rounded px-4 py-2 hover:bg-pink-700 transition duration-200"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default EditVendor;
