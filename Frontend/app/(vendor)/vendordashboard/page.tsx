import VendorNavbar from '@/components/vendorNavbar'
import VendorMain from '@/components/Vendor/vendorMain'
import VendorDashboard from '@/components/Vendor/vendordashboard'
import React from 'react'
import Footer from '@/components/footer'

const vendorDashboard = () => {
  return (
    <div>
      <VendorNavbar />
      <VendorMain />
      <VendorDashboard/>
      <Footer/>
      <></>
    </div>
  )
}

export default vendorDashboard
