import React, { Suspense } from 'react';
import OTPPage from '@/components/otp';

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OTPPage />
      </Suspense>
    </div>
  );
}

export default page;
