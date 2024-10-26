import Navbar from '@/components/Navbar'
import React, { Suspense } from 'react'
import Footer from '@/components/footer'
import DishesPage from '@/components/User/disheslist'

const Page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading Dishes...</div>}>
        <DishesPage />
      </Suspense>
      <Footer />
    </div>
  )
}

export default Page



