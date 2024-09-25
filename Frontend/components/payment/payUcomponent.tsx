import { useEffect, useRef, useState } from "react";
import { FRONTEND_DOMAIN, PayU } from "@/utils/constansts";
import { generateTxnId } from "@/utils/generateTxnld";
import PayUApiCalls from "@/utils/apiCalls/PayUApiCalls";

type Props = {
    BookedData: any;
};

const PayUComponent = ({ BookedData }: Props) => {
    const [hash, setHash] = useState<string | null>(null);
    const txnidRef = useRef(generateTxnId(8));
    const txnid = txnidRef.current;

    // Check the structure of BookedData
    console.log('BookedData:', BookedData);

    // Extract values with default fallback
    const amount = BookedData.advanceAmount || 0; // Default to 0 if undefined
    const productinfo = BookedData.vendorId || 'vendoriddd'; // Ensure this is set correctly
    const { username = '', email = '', phone = '' } = BookedData.userId || {};
    const key = PayU.merchantKey;
    console.log('324131');

    const surl = `${FRONTEND_DOMAIN}/api/paymentSuccess`;
    const furl = `${FRONTEND_DOMAIN}/api/paymentFailure`;

    useEffect(() => {
        const data = { txnid, amount, productinfo, username, email, phone };

        (async function () {
            try {
                console.log('Payment request data:', data);
                const res = await PayUApiCalls.paymentReq(data);
                setHash(res.hash);
            } catch (error: any) {
                console.error("Payment Error: " + error.message);
                alert(error.message);
            }
        })();
    }, [amount, productinfo, txnid, username, email, phone]);

    return (
        <form action="https://test.payu.in/_payment" method="post">
            <input type="hidden" name="key" value={key} />
            <input type="hidden" name="txnid" value={txnid} />
            <input type="hidden" name="productinfo" value={productinfo} />
            <input type="hidden" name="amount" value={amount} />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="firstname" value={username} />
            <input type="hidden" name="surl" value={surl} />
            <input type="hidden" name="furl" value={furl} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="hash" value={hash || ""} />
            {hash && (
                <button
                    type="submit"
                    value="submit"
                    className="w-full bg-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-pink-600 transition"
                >
                    Pay with PayU
                </button>
            )}
        </form>
    );
};

export default PayUComponent;
