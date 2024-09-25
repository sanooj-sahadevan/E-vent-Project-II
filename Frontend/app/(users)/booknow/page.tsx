import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import VendorList from '@/components/User/vendorlist'
import Booknow from '@/components/User/booknow'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <Booknow/>
      <Footer/>
    </div>
  )
}

export default page
