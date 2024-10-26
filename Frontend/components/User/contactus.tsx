// pages/contact.js

'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import img1 from '../../public/contatct1.jpg'
import img2 from '../../public/2.jpg.jpg'
import img3 from '../../public/banner_contact.jpg'




const ContactPage = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Contact Us Header */}
        <div className="relative h-[400px]">

                <Image
                    src={img3}
                    alt="Event"
                    className="object-cover w-full h-full"
                />

                {/* <img 
            src="https://your-image-url-here.com" 
            alt="Event" 
            className="object-cover w-full h-full" 
          /> */}
            </div>
  
        {/* Contact Info Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-pink-200 p-8 rounded-lg shadow-md">
                <p className="text-lg font-bold">Phone</p>
                <p className="text-gray-600 mt-2">7908111453</p>
              </div>
              <div className="bg-pink-200 p-8 rounded-lg shadow-md">
                <p className="text-lg font-bold">Phone</p>
                <p className="text-gray-600 mt-2">7908111453</p>
              </div>
              <div className="bg-pink-200 p-8 rounded-lg shadow-md">
                <p className="text-lg font-bold">Phone</p>
                <p className="text-gray-600 mt-2">7908111453</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Image and Information Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
            <Image
                    src={img1}
                    alt="Event"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex items-center">
              <p className="text-gray-700 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt, vitae malesuada quam aliquam. Vivamus dignissim magna ut nulla aliquet, in gravida elit consequat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Donec sollicitudin molestie malesuada.
              </p>
            </div>
          </div>
        </section>
  
        {/* Write a Message Section */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Write a Message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dignissim magna ut nulla aliquet, in gravida elit consequat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
                </p>
              </div>
              <div>
                <form className="grid grid-cols-1 gap-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <textarea
                    placeholder="Your Message"
                    className="border p-4 h-32 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-pink-500 text-white p-4 rounded-md font-bold hover:bg-pink-600 transition duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };
  
  export default ContactPage;
  