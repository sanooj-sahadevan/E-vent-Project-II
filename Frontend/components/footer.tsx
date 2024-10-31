import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-pink-50 py-6 border-t border-gray-200 custom-font text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-start text-gray-700">
        
        {/* Company Info Section */}
        <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
          <h4 className="text-lg font-semibold mb-2 text-black">EVENTOPIA</h4>
          <p className="mb-2 text-gray-500">
            Your one-stop solution for all event planning needs. From vendors to venues, we’ve got you covered.
          </p>
          <p className="text-gray-500 text-xs">© 2024 Eventopia. All rights reserved.</p>
        </div>
        
        {/* Quick Links Section */}
        <div className="w-full sm:w-auto mb-6 sm:mb-0">
          <h4 className="text-lg font-semibold mb-2 text-black">Quick Links</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline text-gray-600">Home</a></li>
            <li><a href="#" className="hover:underline text-gray-600">Vendor</a></li>
            <li><a href="#" className="hover:underline text-gray-600">About</a></li>
            <li><a href="#" className="hover:underline text-gray-600">Contact</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="w-full sm:w-auto mb-6 sm:mb-0">
          <h4 className="text-lg font-semibold mb-2 text-black">Support</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline text-gray-600">Help Center</a></li>
            <li><a href="#" className="hover:underline text-gray-600">Terms of Service</a></li>
            <li><a href="#" className="hover:underline text-gray-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline text-gray-600">FAQs</a></li>
          </ul>
        </div>

        {/* Contact & Social Media Section */}
        <div className="w-full sm:w-auto">
          <h4 className="text-lg font-semibold mb-2 text-black">Contact Us</h4>
          <p className="text-gray-500 mb-1">123 Event Lane, Cityville, Country</p>
          <p className="text-gray-500 mb-1">Email: contact@eventopia.com</p>
          <p className="text-gray-500 mb-4">Phone: +1 (555) 123-4567</p>
          <div className="flex space-x-3 text-gray-600">
            <a href="#"><FaFacebook className="hover:text-blue-600" /></a>
            <a href="#"><FaInstagram className="hover:text-pink-500" /></a>
            <a href="#"><FaTwitter className="hover:text-blue-400" /></a>
            <a href="#"><FaLinkedin className="hover:text-blue-700" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
