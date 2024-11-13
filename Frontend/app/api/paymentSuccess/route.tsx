

import paymentService from "@/utils/apiCalls/paymentService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";


export async function POST(req: any) {
  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });
console.log('api payment sucesss');

  const formData = await req.formData();

  const data: { [key: string]: any } = {};
  formData.forEach((value: any, key: string) => {
    data[key] = value;
  });
console.log(data, 'this and all things')
let PayUOrderId
  try {
     PayUOrderId = await PayUApiCalls.saveData(data);
    // await paymentService.addTransaction(PayUOrderId, data.email, "success");
  } catch (error: any) {
    console.log(error);
  }
 redirect(`/bookingSucess`);

}

// import PayUApiCalls from '@/utils/apiCalls/PayUApiCalls';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     // Retrieve and log form data
//     const formData = await req.formData();
//     const data: { [key: string]: any } = {};

//     formData.forEach((value, key) => {
//       data[key] = value;
//     });

//     console.log(data, 'Form data received');

//     // Process payment
//     let PayUOrderId;
//     try {
//       PayUOrderId = await PayUApiCalls.saveData(data);
//     } catch (error: any) {
//       console.log(error);
//     }

//     console.log('Payment processed successfully');

//     // Redirect to /bookingSucess with the correct absolute URL
//     const redirectUrl = 'http://localhost:3000/bookingSucess'; // Replace this with your actual domain if needed
//     return NextResponse.redirect(redirectUrl);  // Full URL for redirection

//   } catch (error: any) {
//     console.error('Error processing payment:', error.message || error);
//     return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
//   }
// }
