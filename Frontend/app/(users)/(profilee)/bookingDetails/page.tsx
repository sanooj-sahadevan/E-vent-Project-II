import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import UserProfile from '@/components/User/userprofile'
import BookingDetils from '@/components/User/bookingDetils'
const page = () => {
  return (
    <div>
      <Navbar/>
      <BookingDetils/>
      {/* <UserMain/> */}
      {/* <UserProfile/> */}
    </div>
  )
}

export default page
