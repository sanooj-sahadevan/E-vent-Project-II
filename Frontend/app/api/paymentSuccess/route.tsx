// import paymentService from "@/utils/apiCalls/paymentService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextApiResponse } from "next";
// import { redirect } from "next/navigation";

// export async function POST(req: any, res: NextApiResponse) {
//   console.log('api payment sucesss');
//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();

//   const data: { [key: string]: any } = {};
//   formData.forEach((value: any, key: string) => {
//     data[key] = value;
//   });
//   console.log(data, 'this and all things')

//   let PayUOrderId
//   try {
//     PayUOrderId = await PayUApiCalls.saveData(data);
//     console.log(PayUOrderId, 'pauorderId');

//   } catch (error: any) {
//     console.log(error.message);
//   }
  
//   redirect(`/bookingSucess`);
// }



// import paymentService from "@/utils/apiCalls/paymentService";
// import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// import { NextResponse } from "next/server"; // Import NextResponse for API responses

// export async function POST(req: Request) {
//   console.log('api payment success');

//   const contentType = req.headers.get("content-type") || "";
//   console.log({ contentType });

//   const formData = await req.formData();
//   const data: { [key: string]: any } = {};
//   formData.forEach((value, key) => {
//     data[key] = value;
//   });
//   console.log(data, 'this and all things');

//   let PayUOrderId;
//   try {
//     PayUOrderId = await PayUApiCalls.saveData(data);
//     console.log(PayUOrderId, 'PayUOrderId');
//   } catch (error: any) {
//     console.log(error.message);
//   }

//   return NextResponse.redirect('/bookingSuccess'); // Use NextResponse for redirection
// }


import paymentService from "@/utils/apiCalls/paymentService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

export async function POST(req: any, res: NextApiResponse) {
  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });

  const formData = await req.formData();

  const data: { [key: string]: any } = {};
  formData.forEach((value: any, key: string) => {
    data[key] = value;
  });
  console.log(data)
  console.log('sanooj');
  
  let PayUOrderId
  try {
     PayUOrderId = await PayUApiCalls.saveData(data);
    // await paymentService.addTransaction(PayUOrderId, data.email, "success");
  } catch (error: any) {
    console.log(error);
  }
  redirect('/bookingSuccess')
}