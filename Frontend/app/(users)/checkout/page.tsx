import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import VendorList from '@/components/User/vendorlist'
import Checkout from '@/components/User/checkout'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar />
      <Checkout />
      <Footer />
    </div>
  )
}

export default page
