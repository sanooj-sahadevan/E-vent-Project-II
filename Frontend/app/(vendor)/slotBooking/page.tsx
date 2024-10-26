import VendorNavbar from '@/components/vendorNavbar'
import VendorMain from '@/components/Vendor/vendorMain'
import React from 'react'
import Footer from '@/components/footer'
import SlotBooking from '@/components/Vendor/slotBooking'

const vendorDashboard = () => {
  return (
    <div>
      <VendorNavbar />
      <VendorMain />
      <SlotBooking/>
      <Footer/>
      <></>
    </div>
  )
}

export default vendorDashboard
