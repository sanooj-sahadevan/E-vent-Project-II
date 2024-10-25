import VendorNavbar from '@/components/vendorNavbar'
import VendorMain from '@/components/Vendor/vendorMain'
import VendorDashboard from '@/components/Vendor/vendordashboard'
import React, { Suspense } from 'react'  // Import Suspense
import Footer from '@/components/footer'

const VendorDashboardPage = () => {
  return (
    <div>
      <VendorNavbar />
      <VendorMain />
      <Suspense fallback={<div>Loading...</div>}>  {/* Suspense Boundary */}
        <VendorDashboard />
      </Suspense>
      <Footer />
    </div>
  )
}

export default VendorDashboardPage
