import VendorNavbar from '@/components/vendorNavbar'
import VendorMain from '@/components/Vendor/vendorMain'
import VendorDashboard from '@/components/Vendor/vendordashboard'
import AddDishes from '@/components/Vendor/addDishes'
import React from 'react'
import Footer from '@/components/footer'

const vendorDashboard = () => {
  return (
    <div>
      <VendorNavbar />
      <VendorMain />
      <AddDishes/>
      <Footer/>
    </div>
  )
}

export default vendorDashboard
