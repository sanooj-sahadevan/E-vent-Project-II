import VendorNavbar from '@/components/vendorNavbar'
import VendorMain from '@/components/Vendor/vendorMain'
import VendorDashboard from '@/components/Vendor/vendordashboard'
import React from 'react'

const vendorDashboard = () => {
  return (
    <div>
      <VendorNavbar />
      <VendorMain />
      <VendorDashboard/>
      <></>
    </div>
  )
}

export default vendorDashboard
