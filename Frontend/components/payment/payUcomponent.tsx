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

    console.log('BookedData:', BookedData);

    // Extract values with default fallback
    const amount = BookedData.advanceAmount || 0;
    const productinfo = BookedData.vendorId || '';
    const udf1 = BookedData.userId?._id || '';
    const { username = '', email = '', phone = '' } = BookedData.userId || {};
    const surl = `${FRONTEND_DOMAIN}/api/paymentSuccess`;
    const furl = `${FRONTEND_DOMAIN}/api/paymentFailure`;

    const udf2 = BookedData.auditoriumId || 'nil';
    const udf3 = BookedData.dishesId || 'nil';
    const udf4 = BookedData.StartingDate || 'nil';
    const udf5 = BookedData.category || 'nil';
    const udf6 = BookedData.eventType || 'nil';
    const udf7 = BookedData.EndingDate || 'nil'; 
console.log(udf7,'pap');

    const key = PayU.merchantKey;

    useEffect(() => {
        const data = { txnid, amount, productinfo, username, email, phone, udf1, udf2, udf3, udf4, udf5, udf6, udf7 };
        (async function () {
            try {
                console.log('Payment request data:', data);
                const res = await PayUApiCalls.paymentReq(data);
                setHash(res.hash);
            } catch (error: any) {
                console.error("Payment Error: " + error.message);
            }
        })();
    }, [amount, productinfo, txnid, username, email, phone, udf1, udf2, udf3, udf4, udf5, udf6, udf7]);

    return (
        <form action="https://test.payu.in/_payment" method="post">
            <input type="hidden" name="key" value={key} />
            <input type="hidden" name="txnid" value={txnid} />
            <input type="hidden" name="productinfo" value={productinfo} />
            <input type="hidden" name="amount" value={amount} />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="firstname" value={username} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="udf1" value={udf1} />
            <input type="hidden" name="udf2" value={udf2} />
            <input type="hidden" name="udf3" value={udf3} />
            <input type="hidden" name="udf4" value={udf4} />
            <input type="hidden" name="udf5" value={udf5} />
            <input type="hidden" name="udf6" value={udf6} /> 
            <input type="hidden" name="udf7" value={udf7} /> 
            <input type="hidden" name="surl" value={surl} />
            <input type="hidden" name="furl" value={furl} />
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
