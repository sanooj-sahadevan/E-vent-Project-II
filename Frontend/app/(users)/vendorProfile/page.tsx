import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import UserMain from '@/components/userMainII';
import VendorProfile from '@/components/User/vendorProfile';
import Footer from '@/components/footer';
import { Spinner } from '@nextui-org/react';

const Page = () => {
  return (
    <Suspense  fallback={
      <div className="flex justify-center items-center h-screen">
  <Spinner  color="danger" size="lg"  label="Loading..." labelColor="foreground"/>
  </div>
    }>
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
