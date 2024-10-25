import React, { Suspense } from 'react';
import OTPPage from '@/components/User/forgotOTP';

const ForgotOtpPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPPage />
    </Suspense>
  );
};

export default ForgotOtpPage;
