const PAYSTACK_BASE_URL = "https://api.paystack.co";

const paystackFetch = async (path, options = {}) => {
    const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();

    if(!response.ok || data.status === false){
        throw new Error(data.message || "Paystack request failed");
    }

    return data;
};

// start of initializeTransaction
export const initializeTransaction = async ({ email, amount, reference, callback_url, metadata }) => {
    return paystackFetch("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify({
            email,
            amount, // smallest currency unit - cents, for ZAR
            currency: "ZAR",
            reference,
            callback_url,
            metadata,
        }),
    });
};
// end of initializeTransaction

// start of verifyTransaction
export const verifyTransaction = async (reference) => {
    return paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`, {
        method: "GET",
    });
};
// end of verifyTransaction