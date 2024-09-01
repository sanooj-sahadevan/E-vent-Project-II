// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-pink-50 py-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-around text-center">
        <div className="w-full sm:w-auto mb-4">
          <h4 className="text-base font-semibold mb-2">C-vent Event</h4>
          <ul>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Home</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Vendor</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">About</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Contact</a></li>
          </ul>
        </div>
        <div className="w-full sm:w-auto mb-4">
          <h4 className="text-base font-semibold mb-2">Start Planning</h4>
          <ul>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Home</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Vendor</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">About</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Contact</a></li>
          </ul>
        </div>
        <div className="w-full sm:w-auto mb-4">
          <h4 className="text-base font-semibold mb-2">Services</h4>
          <ul>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Home</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Vendor</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">About</a></li>
            <li className="mb-1"><a href="#" className="hover:underline text-sm">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-4 text-xs text-gray-500">
        Copyright © 2024 C-vent Event by Sanooj.
      </div>
    </footer>
  );
};

export default Footer;
