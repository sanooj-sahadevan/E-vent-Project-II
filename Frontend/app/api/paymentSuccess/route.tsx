import paymentService from "@/utils/apiCalls/paymentService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

export async function POST(req: any, res: NextApiResponse) {
  console.log('API payment success started');
  
  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });

  try {
    const formData = await req.formData();
    const data: { [key: string]: any } = {};
    console.log(formData,'formatdata');
    
    // Collect form data into an object
    formData.forEach((value: any, key: string) => {
      data[key] = value;
    });

    // Log the entire data object to ensure all fields are captured
    console.log("Received Data:", data);

    // Check if the new fields are missing and log a message
    if (!data.udf6 || !data.udf7) {
      console.warn("Missing udf6 or udf7 fields in the submitted data");
    }

    // Save the data using PayU API calls
    let PayUOrderId;
    try {
      PayUOrderId = await PayUApiCalls.saveData(data);
      console.log('PayUOrderId:', PayUOrderId);
    } catch (error: any) {
      console.error("Error saving PayU data:", error.message);
    }

    redirect(`/bookingSucess`);
    
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).send("Internal Server Error");
  }
}
