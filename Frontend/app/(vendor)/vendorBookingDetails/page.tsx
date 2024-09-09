/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import VendorNavbar from '@/components/vendorNavbar'
import VendorMain from '@/components/Vendor/vendorMain'
import React from 'react'
import Footer from '@/components/footer'
import { useState, useEffect } from 'react';

const vendorDashboard = () => {
    const [events, setEvents] = useState([]);

    // Fetch data from API
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/events');
            const data = await response.json();
            setEvents(data);
        }

        fetchData();
    }, []);
    return (
        <div>
            <VendorNavbar />
            <VendorMain />


            <div className="flex justify-center py-10">
                <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Name</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Auditorium</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Food</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event}</td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <span className={event === 'Pending' ? 'text-blue-500' : ''}>{event}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>





            <Footer />
            <></>
        </div>
    )
}

export default vendorDashboard
