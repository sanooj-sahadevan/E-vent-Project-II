import Navbar from '@/components/Navbar';
import React, { Suspense } from 'react';
import UserMain from '@/components/userMain';
import VendorList from '@/components/User/vendorlist';
import Dishesinfo from '@/components/User/dishesinfo';
import Footer from '@/components/footer';

const page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Dishesinfo />
      </Suspense>
      <Footer />
    </div>
  );
}

export default page;
