// import { useEffect, useRef, useState } from "react";
// // import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";
// // import {  FRONTEND_DOMAIN, PayU } from "@/utils/constants";
// // import { IUser } from "@/types/types";
// // import { generateTxnId } from "@/utils/generateTxnId";
// // import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";

// type props = {
//   BookedData: any;
// };

// const PayUComponent = ({ BookedData }: props) => {
//   const [hash, setHash] = useState(null);

//   const { username, phone, email } = BookedData.userId;
//   console.log({ BookedData });

// //   const txnidRef = useRef(generateTxnId(8));
// //   const txnid = txnidRef.current;
//   const amount = BookedData.totalAmount; // Ensure correct format
//   const productinfo = BookedData._id;
//   const key = PayU.merchantKey;
// //   const surl = `${FRONTEND_DOMAIN}/api/paymentSuccess`;
// //   const furl = `${FRONTEND_DOMAIN}/api/paymentFailure`;
//   // const service_provider = "payu_paisa";

//   useEffect(() => {
//     const data = { txnid, amount, productinfo, username, email, phone };

//     (async function (data) {
//       try {
//         const res = await PayUApiCalls.paymentReq(data);
//         console.log(res.hash);
        
//         setHash(res.hash);
//       } catch (error: any) {
//         console.error("Payment Error: " + error.message);
//         alert(error.message);
//       }
//     })(data);
//   }, [amount, email, username, productinfo]);

//   return (
//     <form action="https://test.payu.in/_payment" method="post">
//       <input type="hidden" name="key" value={key} />
//       <input type="hidden" name="txnid" value={txnid} />
//       <input type="hidden" name="productinfo" value={productinfo} />
//       <input type="hidden" name="amount" value={amount} />
//       <input type="hidden" name="email" value={email} />
//       <input type="hidden" name="firstname" value={username} />
//       <input type="hidden" name="surl" value={surl} />
//       <input type="hidden" name="furl" value={furl} />
//       <input type="hidden" name="phone" value={phone} />
//       <input type="hidden" name="hash" value={hash || ""} />
//       {hash && (
//         <button
//           type="submit"
//           value="submit"
//           className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
//         >
//           Pay with PayU
//         </button>
//       )}
//     </form>
//   );
// };

// export default PayUComponent;
