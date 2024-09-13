import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import UserProfile from '@/components/User/userprofile'
const page = () => {
  return (
    <div>
      <Navbar/>
      <UserMain/>
      <UserProfile/>
    </div>
  )
}

export default page
