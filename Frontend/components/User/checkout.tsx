/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react';

const CheckoutPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string>('Visa');

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-center text-3xl font-bold mb-6">Checkout Page</h1>
      <p className="text-center mb-8">If you confirm the event, please pay the advance amount</p>

      <div className="flex justify-center">
        {/* Left: Price Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-1/3 mr-8">
          <h2 className="text-lg font-semibold mb-4">PRICE DETAILS</h2>
          <div className="flex justify-between mb-2">
            <p>Advance cash</p>
            <p>10,000</p>
          </div>
          <hr />
          <div className="flex justify-between mt-4">
            <p className="font-semibold">TOTAL PAYABLE</p>
            <p className="font-semibold">10,000</p>
          </div>
        </div>

        {/* Right: Payment Method */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

          {/* Payment Cards */}
          <div className="mb-4">
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="Visa"
                checked={selectedCard === 'Visa'}
                onChange={() => setSelectedCard('Visa')}
                className="mr-2"
              />
              <img src="/visa.png" alt="Visa" className="h-8 w-auto mr-2" />
              <span className="text-gray-600">.... .... .... 1234</span>
            </label>

            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="MasterCard"
                checked={selectedCard === 'MasterCard'}
                onChange={() => setSelectedCard('MasterCard')}
                className="mr-2"
              />
              <img src="/mastercard.png" alt="MasterCard" className="h-8 w-auto mr-2" />
              <span className="text-gray-600">.... .... .... 1234</span>
            </label>

            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="Amex"
                checked={selectedCard === 'Amex'}
                onChange={() => setSelectedCard('Amex')}
                className="mr-2"
              />
              <img src="/amex.png" alt="Amex" className="h-8 w-auto mr-2" />
              <span className="text-gray-600">.... .... .... 1234</span>
            </label>
          </div>

          {/* Total Price and Pay Button */}
          <div className="flex justify-between mb-4">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">10,000</p>
          </div>
          <button className="bg-pink-500 text-white py-2 w-full rounded-lg">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
