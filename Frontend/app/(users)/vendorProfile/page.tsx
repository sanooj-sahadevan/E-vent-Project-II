import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import UserMain from '@/components/userMain';
import VendorProfile from '@/components/User/vendorProfile';
import Footer from '@/components/footer';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Navbar />
        <UserMain />
        <VendorProfile />
        <Footer />
      </div>
    </Suspense>
  );
};

export default Page;
