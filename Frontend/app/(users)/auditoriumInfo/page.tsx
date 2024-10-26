import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
import AuditoriumInfo from '@/components/User/auditoriumInfo'
import AuditoriumList from '@/components/User/auditoriumList'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <AuditoriumInfo />
      <Footer/>
    </div>
  )
}

export default page
