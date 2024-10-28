"use client"; // Ensure this is included

import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import UserMain from '@/components/userMainII';
import VendorList from '@/components/User/vendorlist';
import Footer from '@/components/footer';

// interface Vendor {
//   _id: string;
//   vendorname: string;
//   state: string;
//   rating: number;
//   profileImage?: string;
// }

const Page: React.FC = () => {
  // const [vendors, setVendors] = useState<Vendor[]>([]);

  return (
    <div>
      <Navbar />
      <UserMain />
      <VendorList  />
      <Footer />
    </div>
  );
};

export default Page;
