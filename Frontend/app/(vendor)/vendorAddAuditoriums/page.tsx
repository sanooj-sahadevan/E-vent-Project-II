import VendorNavbar from '@/components/vendorNavbar'
import VendorMain from '@/components/Vendor/vendorMain'
import React from 'react'
import Footer from '@/components/footer'
import AddAuditorium from '@/components/Vendor/addAuditorium'

const vendorDashboard = () => {
  return (
    <div>
      <VendorNavbar />
      <VendorMain />
      <AddAuditorium/>
      <Footer/>
      <></>
    </div>
  )
}

export default vendorDashboard
