import VendorNavbar from '@/components/vendorNavbar';
import VendorMain from '@/components/Vendor/vendorMain';
import VendorDashboard from '@/components/Vendor/vendordashboard';
import AddDishes from '@/components/Vendor/addDishes';
import React, { Suspense } from 'react';
import Footer from '@/components/footer';
import VendorEditProfile from '@/components/Vendor/vendorEditProfile';

const vendorDashboard = () => {
  return (
    <div>
      <VendorNavbar />
      <VendorMain />
      <Suspense fallback={<div>Loading...</div>}>
        <VendorEditProfile />
      </Suspense>
      <Footer />
    </div>
  );
};

export default vendorDashboard;
