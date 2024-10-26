import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
// import AuditoriumInfo from '@/components/User/auditoriumInfo'
import Contactus from '@/components/User/contactus'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <Contactus/>
     <Footer/>
    </div>
  )
}

export default page
