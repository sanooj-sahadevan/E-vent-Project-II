import Navbar from '@/components/Navbar'
import React, { Suspense } from 'react'
import Footer from '@/components/footer'
import DishesPage from '@/components/User/disheslist'
import { Spinner } from '@nextui-org/react'

const Page = () => {
  return (
    <div>
      <Navbar />
      <Suspense  fallback={
          <div className="flex justify-center items-center h-screen">
      <Spinner  color="danger" size="lg"  label="Loading..." labelColor="foreground"/>
      </div>
        }>
        <DishesPage />
      </Suspense>
      <Footer />
    </div>
  )
}

export default Page



