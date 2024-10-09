/* eslint-disable @next/next/no-img-element */
// pages/about.js
'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import img1 from '../../public/aboutH.webp'
import img2 from '../../public/6.jpg.jpg'
import img3 from '../../public/aboutM.jpg'






const AboutPage = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="relative h-[400px]">

                <Image
                    src={img1}
                    alt="Event"
                    className="object-cover w-full h-full"
                />

                {/* <img 
            src="https://your-image-url-here.com" 
            alt="Event" 
            className="object-cover w-full h-full" 
          /> */}
            </div>

            {/* Who We Are Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8">Who we are ?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-left">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.</p>
                        </div>
                        <div>
                            <Image
                                src={img2}
                                alt="Event"
                                className="object-cover w-full h-[300px]" />
                            {/* <img src="https://your-second-image-url.com" alt="About Us" className="object-cover w-full h-[300px]" /> */}
                        </div>
                        <div>
                            <Image
                                src={img3}
                                alt="Event"
                                className="object-cover w-full h-[300px]" />
                            {/* <img src="https://your-third-image-url.com" alt="Event Image" className="object-cover w-full h-[300px]" /> */}
                        </div>
                        <div className="text-left">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce egestas elit eget lorem tincidunt,
                                vitae malesuada quam aliquam. Vivamus dignissim magna.</p>                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 shadow-md">Step 1</div>
                        <div className="bg-white p-6 shadow-md">Step 2</div>
                        <div className="bg-white p-6 shadow-md">Step 3</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
