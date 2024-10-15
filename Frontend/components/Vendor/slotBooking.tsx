"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createSlotAPI, getSlotsByWorkerAPI } from '@/services/vendorAPI';

type Slot = {
    startDate: Date | null;
    endDate: Date | null;
};

const CreateSlotsPage = () => {
    const { handleSubmit, setValue, watch } = useForm<Slot>();
    const [newSlots, setNewSlots] = useState<Slot[]>([]);

    const startDate = watch('startDate');
    const endDate = watch('endDate');

    const onSubmit = async (data: Slot) => {
        const storedVendor = localStorage.getItem("vendor");
        let vendorId = '';

        if (storedVendor) {
            const parsedVendor = JSON.parse(storedVendor);
            vendorId = parsedVendor._id;
        }

        if (!data.startDate || !data.endDate) {
            toast.warning("Please fill out both start date and end date.");
            return;
        }

        if (data.startDate > data.endDate) {
            toast.warning("End Date must be later than Start Date.");
            return;
        }

        if (!vendorId) {
            toast.error("No vendor found, please log in again.");
            return;
        }

        try {
            const res = await createSlotAPI({ startDate: data.startDate, endDate: data.endDate }, vendorId);
            console.log(res);
            toast.success("Slot created successfully!");

            setNewSlots(prevSlots => [...prevSlots, { startDate: data.startDate, endDate: data.endDate }]);

            setValue('startDate', null);
            setValue('endDate', null);
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while creating the slot.");
        }
    };

    useEffect(() => {
        const storedVendor = localStorage.getItem("vendor");
        let vendorId = '';

        if (storedVendor) {
            const parsedVendor = JSON.parse(storedVendor);
            vendorId = parsedVendor._id;
        }

        const fetchSlots = async () => {
            if (vendorId) {
                try {
                    const slotsData = await getSlotsByWorkerAPI(vendorId);
                    setNewSlots(slotsData);
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to load slots."); // Notify user of the error
                }
            }
        };

        fetchSlots();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <ToastContainer />  {/* Ensure to add this */}
            <div className="flex justify-between items-start space-x-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Slots</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-md">
                        <div>
                            <label className="block text-gray-700 font-medium">Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setValue('startDate', date as Date | null)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="mm/dd/yyyy"
                                className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">End Date</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setValue('endDate', date as Date | null)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="mm/dd/yyyy"
                                className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button type="submit" className="bg-pink-500 text-white py-2 px-6 rounded-md shadow hover:bg-pink-700 transition duration-200">
                            CREATE SLOT
                        </button>
                    </form>
                </div>

                <div className="flex-1">
                    <h2 className="text-3xl font-bold mt-8 text-gray-800">My Slots</h2>
                    <div className="mt-4">
                        {newSlots.length > 0 ? (
                            <div className="border rounded-lg overflow-hidden shadow-md">
                                {/* Added max-height and overflow-y-auto for scroll */}
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="w-full bg-white">
                                        <thead className="bg-gray-200">
                                            <tr className="text-left">
                                                <th className="p-4">Start Date</th>
                                                <th className="p-4">End Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newSlots.map((slot, index) => (
                                                <tr key={index} className="border-t hover:bg-gray-100">
                                                    <td className="p-4">
                                                        {slot.startDate ? format(new Date(slot.startDate), 'dd MMM yyyy') : 'N/A'}
                                                    </td>
                                                    <td className="p-4">
                                                        {slot.endDate ? format(new Date(slot.endDate), 'dd MMM yyyy') : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600">No slots created yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateSlotsPage;
