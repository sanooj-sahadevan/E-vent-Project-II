import paymentService from "@/utils/apiCalls/paymentService";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  console.log("API payment success");

  const contentType = req.headers.get("content-type") || "";
  console.log({ contentType });

  const formData = await req.formData();

  const data: { [key: string]: any } = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  console.log(data, "this and all things");

  try {
    const PayUOrderId = await PayUApiCalls.saveData(data);
    console.log(PayUOrderId, "PayUOrderId");


  } catch (error) {
    console.error("Error:", error);
  }

  return redirect("/bookingSuccess");
}
