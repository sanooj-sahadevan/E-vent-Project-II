import Navbar from '@/components/Navbar';
import React, { Suspense } from 'react';
import UserMain from '@/components/userMain';
import VendorList from '@/components/User/vendorlist';
import Dishesinfo from '@/components/User/dishesinfo';
import Footer from '@/components/footer';
import { Spinner } from '@nextui-org/spinner';

const page = () => {
  return (
    <div>
      <Navbar />
      <Suspense   fallback={
          <div className="flex justify-center items-center h-screen">
      <Spinner  color="danger" size="lg"  label="Loading..." labelColor="foreground"/>
      </div>
        }>
        <Dishesinfo />
      </Suspense>
      <Footer />
    </div>
  );
}

export default page;
