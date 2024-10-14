/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Calendar from 'react-calendar'; // Ensure you have react-calendar installed
import 'react-calendar/dist/Calendar.css';
import { fetchSlots } from '@/services/userApi';

interface Slot {
    startDate: string;
    endDate: string;
    isAvailable: boolean;
    date: string; // Added this property based on your data structure
}

const AvailabilityModal: React.FC<{ open: boolean; onClose: () => void; vendorId: string; }> = ({ open, onClose, vendorId }) => {
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch available slots from the database
    const fetchAvailableSlots = async () => {
        try {
            const response = await fetchSlots(vendorId);
            console.log('Fetched slots:', response); // Debug log
            
            if (response) {
                setAvailableSlots(response); // Adjust this according to your response structure
            }
        } catch (error) {
            console.error("Failed to fetch available slots:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchAvailableSlots();
        }
    }, [open]);

    // Check if a date is available
    const isDateAvailable = (date: Date) => {
        return availableSlots.some(slot => {
            const slotDate = new Date(slot.date);
            return slot.isAvailable && slotDate.toDateString() === date.toDateString(); // Compare dates without time
        });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center min-h-screen">
                <div className="modal-content p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-semibold">Available Slots</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            <Calendar
                                tileDisabled={({ date }) => !isDateAvailable(date)} // Disable non-available dates
                                tileContent={({ date }) => (
                                    isDateAvailable(date) ? <span className="text-green-500">✔️</span> : null
                                )}
                            />
                            {/* <div className="mt-4">
                                <h3 className="text-lg">Slots:</h3>
                                <ul>
                                    {availableSlots.map((slot, index) => (
                                        <li key={index}>
                                            {new Date(slot.startDate).toLocaleString()} - {new Date(slot.endDate).toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </div> */}
                        </div>
                    )}
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-black rounded shadow hover:bg-gray-400"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AvailabilityModal;
