import paymentService from "@/utils/apiCalls/paymentService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });
  console.log("API payment failure route hit");

  const formData = await req.formData();
  const data: { [key: string]: any } = {};

  formData.forEach((value: any, key: string) => {
    data[key] = value;
  });

  console.log(data, "Received payment failure data");

  try {
    // Optionally save or process failed payment data for tracking/debugging.
    // await paymentService.logFailedTransaction(data);
  } catch (error: any) {
    console.error("Error logging failed transaction:", error.message);
  }

  // Redirect to the checkout page
  return NextResponse.redirect("/checkout");
}
