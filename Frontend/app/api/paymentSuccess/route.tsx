

// import paymentService from "@/utils/apiCalls/paymentService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextApiResponse } from "next";
// import { redirect } from "next/navigation";
// import { NextResponse } from "next/server";


// export async function POST(req: any, res: NextApiResponse) {
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });
// console.log('api payment sucesss');

//   const formData = await req.formData();

//   const data: { [key: string]: any } = {};
//   formData.forEach((value: any, key: string) => {
//     data[key] = value;
//   });
// console.log(data, 'this and all things')
// let PayUOrderId
//   try {
//      PayUOrderId = await PayUApiCalls.saveData(data);
//     // await paymentService.addTransaction(PayUOrderId, data.email, "success");
//   } catch (error: any) {
//     console.log(error);
//   }
//  redirect(`/bookingSucess`);

// }

import paymentService from "@/utils/apiCalls/paymentService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });
  console.log('API payment success');

  const formData = await req.formData();
  const data: { [key: string]: any } = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  console.log(data, 'Form data received');

  let PayUOrderId;
  try {
    PayUOrderId = await PayUApiCalls.saveData(data);
    // Uncomment below if you want to save the transaction
    // await paymentService.addTransaction(PayUOrderId, data.email, "success");
  } catch (error: any) {
    console.log('Error processing payment:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }

  // Construct absolute URL for redirection
  const redirectUrl = `${new URL(req.url).origin}/bookingSuccess`;
  return NextResponse.redirect(redirectUrl);
}
