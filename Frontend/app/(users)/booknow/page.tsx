import Navbar from '@/components/Navbar'
import React, { Suspense } from 'react'
import Footer from '@/components/footer'
const Booknow = React.lazy(() => import('@/components/User/booknow'));

const page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Booknow />
      </Suspense>
      <Footer />
    </div>
  )
}

export default page;
