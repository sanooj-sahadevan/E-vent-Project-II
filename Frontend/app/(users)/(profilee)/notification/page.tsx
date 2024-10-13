import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import Notification from '@/components/User/notification'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <Notification/>
     {/* <Footer/> */}
    </div>
  )
}

export default page
