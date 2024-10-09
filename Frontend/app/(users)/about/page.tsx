import Navbar from '@/components/Navbar'
import React from 'react'
import UserMain from '@/components/userMain'
// import AuditoriumInfo from '@/components/User/auditoriumInfo'
import About from '@/components/User/about'
import Footer from '@/components/footer'
const page = () => {
  return (
    <div>
      <Navbar/>
      <About/>
     <Footer/>
    </div>
  )
}

export default page
