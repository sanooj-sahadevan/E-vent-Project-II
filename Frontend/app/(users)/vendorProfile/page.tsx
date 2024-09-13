import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import VendorList from '@/components/User/vendorlist'
import VendorProfile from '@/components/User/vendorProfile'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <UserMain/>
      <VendorProfile/>
      <Footer/>
    </div>
  )
}

export default page
