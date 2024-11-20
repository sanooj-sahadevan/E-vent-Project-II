/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@mui/material/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchSlots } from '@/services/userApi';

interface Slot {
    startDate: string;
    endDate: string;
    isAvailable: boolean;
    date: string;
}

type ValuePiece = Date | null;
type Range = [ValuePiece, ValuePiece] | null;

const AvailabilityModal: React.FC<{ open: boolean; onClose: () => void; vendorId: string; }> = ({ open, onClose, vendorId }) => {
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDates, setSelectedDates] = useState<Date | Range | null>(null); // Updated to include Range type
    const router = useRouter();

    const fetchAvailableSlots = async () => {
        try {
            const response = await fetchSlots(vendorId);
            console.log('Fetched slots:', response); 

            if (response) {
                setAvailableSlots(response);
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

    const isDateAvailable = (date: Date) => {
        return availableSlots.some(slot => {
            const slotDate = new Date(slot.date);
            return slot.isAvailable && slotDate.toDateString() === date.toDateString(); 
        });
    };

    const handleBookNow = () => {
        if (!selectedDates) {
            return; 
        }
    
        let dateQuery: string = '';
    
        if (Array.isArray(selectedDates)) {
            const [startDate, endDate] = selectedDates;
            if (startDate && endDate) {
                dateQuery = `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            }
        } else if (selectedDates instanceof Date) {
            dateQuery = `startDate=${selectedDates.toISOString()}`;
        }
    
        if (dateQuery) {
            router.push(`/booknow?${dateQuery}`);
        }
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
                                onChange={(value) => {
                                    setSelectedDates(value as Date | Range | null); // Ensure correct type is passed to state
                                }}
                                selectRange={true} // Enables selecting a range of dates
                                tileDisabled={({ date }) => !isDateAvailable(date)} // Disable non-available dates
                                tileContent={({ date }) => (
                                    isDateAvailable(date) ? <span className="text-green-500">✔️</span> : null
                                )}
                            />
                        </div>
                    )}
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-black rounded shadow hover:bg-gray-400"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleBookNow}
                            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AvailabilityModal;
