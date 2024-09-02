import React from 'react'
import SignupForm from '@/components/Signup'
import Navbar from '@/components/Navbar'
const page = () => {
  return (
    <div>
      <Navbar />
      <SignupForm />
      {/* <LogInForm/> */}
    </div>
  )
}

export default page
