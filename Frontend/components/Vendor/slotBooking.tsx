"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createSlotAPI, getSlotsByWorkerAPI } from '@/services/vendorAPI';

type Slot = {
    startDate: Date | null;
    endDate: Date | null;
};

const CreateSlotsPage = () => {
    const { handleSubmit, setValue, watch } = useForm<Slot>();
    const [newSlots, setNewSlots] = useState<Slot[]>([]);
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const localizer = momentLocalizer(moment);

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
                    setAvailableSlots(slotsData.filter((slot: { isAvailable: any; }) => slot.isAvailable));
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to load slots."); 
                }
            }
        };

        fetchSlots();
    }, []);

    // Transform newSlots for use in Calendar
    const events = newSlots.map(slot => ({
        start: new Date(slot.startDate!),
        end: new Date(slot.endDate!),
        title: `Slot from ${format(new Date(slot.startDate!), 'dd MMM')} to ${format(new Date(slot.endDate!), 'dd MMM')}`,
    }));

    return (
        <div className="max-w-5xl mx-auto p-6">
            <ToastContainer />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Slots Box */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md min-h-[350px] max-h-[350px] flex flex-col justify-between">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Slots</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setValue('startDate', date as Date | null)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">End Date</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setValue('endDate', date as Date | null)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/MM/yyyy"
                                className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button type="submit" className="bg-pink-500 text-white py-2 px-6 rounded-md shadow hover:bg-pink-700 transition duration-200">
                            CREATE SLOT
                        </button>
                    </form>
                </div>

                {/* Calendar for My Slots */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md col-span-2">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">My Slots Calendar</h2>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 350 }}
                        className="rounded-lg shadow-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateSlotsPage;
