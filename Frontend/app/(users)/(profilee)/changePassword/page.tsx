import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import UserProfile from '@/components/User/userprofile'
import ChangePassword from '@/components/User/changePassword'
const page = () => {
  return (
    <div>
      <Navbar/>
      <ChangePassword/>
      {/* <UserMain/> */}
      {/* <UserProfile/> */}
    </div>
  )
}

export default page
