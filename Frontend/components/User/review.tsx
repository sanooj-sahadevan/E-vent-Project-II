// ReviewModal.tsx
"use client";

import React, { useState } from 'react';
import { saveReview } from '@/services/userApi'; // API for editing vendor

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (review: string, rating: number, userId: string, vendorId: string) => void;
    vendorId: string;
}

const ReviewModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, vendorId }) => {
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [error, setError] = useState<string>(''); // State to hold error messages

    const handleRatingClick = (index: number) => {
        setRating(index);
    };

    const handleSubmit = async () => {
        const trimmedReview = review.trim(); // Trim white spaces from review

        // Check if review is empty or has more than 50 words
        const wordCount = trimmedReview.split(/\s+/).length;
        if (!trimmedReview) {
            setError('Review cannot be empty.');
            return;
        } else if (wordCount > 50) {
            setError('Review cannot exceed 50 words.');
            return;
        }

        // Check if rating is selected
        if (rating === 0) {
            setError('Please select a rating.');
            return;
        }

        const user = localStorage.getItem('user');
        if (user) {
            const userId = JSON.parse(user)._id;

            try {
                // Call the API service to save the review
                const reviewData = await saveReview(trimmedReview, rating, userId, vendorId);
                console.log(reviewData);

                onSubmit(trimmedReview, rating, userId, vendorId); // Call onSubmit after saving the review
                setReview(''); // Reset review after submission
                setRating(0); // Reset rating after submission
                setError(''); // Clear any previous error
            } catch (err) {
                console.error('Error submitting review:', err);
            }
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Write a review</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">&times;</button>
                </div>
                <div className="mb-4">
                    <p>Select your rating</p>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => handleRatingClick(star)}>
                                <svg
                                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 3.8a1 1 0 011.902 0l1.262 3.897a1 1 0 00.95.69h4.096a1 1 0 01.593 1.806l-3.314 2.404a1 1 0 00-.364 1.118l1.262 3.897a1 1 0 01-1.538 1.118L10 14.27a1 1 0 00-1.174 0l-3.315 2.403a1 1 0 01-1.537-1.118l1.262-3.897a1 1 0 00-.364-1.118L1.89 9.193a1 1 0 01.593-1.806h4.096a1 1 0 00.95-.69l1.262-3.897z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    className="w-full border p-2 mb-4 rounded-lg"
                    placeholder="Enter your review here"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}
                <button
                    onClick={handleSubmit}
                    className="bg-pink-500 text-white p-2 rounded-lg w-full"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
