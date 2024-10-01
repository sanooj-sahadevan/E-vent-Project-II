import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import UserProfile from '@/components/User/userprofile'
import Profile from '@/components/User/userProfileMain'
const page = () => {
  return (
    <div>
      <Navbar/>
      <Profile/>
      {/* <UserMain/> */}
      {/* <UserProfile/> */}
    </div>
  )
}

export default page
