import React, { Suspense } from 'react';
import OTPPage from '@/components/User/forgotOTP';
import { Spinner } from '@nextui-org/react';

const ForgotOtpPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
  <Spinner  color="danger" size="lg"  label="Loading..." labelColor="foreground"/>
  </div>
    } >
      <OTPPage />
    </Suspense>
  );
};

export default ForgotOtpPage;
