'use client';

import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import UserMain from '@/components/userMain';
import VendorList from '@/components/User/vendorlist';
import Footer from '@/components/footer';

const Page = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  interface Vendor {
    _id: string;
    vendorname: string;
    state: string;
    rating: number;
    profileImage?: string;
  }

  return (
    <div>
      <Navbar />
      <UserMain setVendors={setVendors} />
      <VendorList vendors={vendors} />
      <Footer />
    </div>
  );
};

export default Page;
