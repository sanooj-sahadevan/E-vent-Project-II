import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import VendorList from '@/components/User/vendorlist'
import Footer from '@/components/footer'
import Disheslist from '@/components/User/disheslist'

const page = () => {
  return (
    <div>
      <Navbar />
      <Disheslist/>
      {/* <UserMain /> */}
      {/* <VendorList /> */}
      <Footer />
    </div>
  )
}

export default page


