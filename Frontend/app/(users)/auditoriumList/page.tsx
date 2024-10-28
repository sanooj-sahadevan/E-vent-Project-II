import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import VendorList from '@/components/User/vendorlist'
import AuditoriumList from '@/components/User/auditoriumList'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <AuditoriumList />
      <Footer/>
    </div>
  )
}

export default page
