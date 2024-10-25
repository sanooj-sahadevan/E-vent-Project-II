import React, { Suspense } from 'react';
import Otp from '@/components/vendorOTP'
const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Otp />
      </Suspense>
    </div>
  )
}

export default page
