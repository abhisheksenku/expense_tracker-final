const premiumButton = document.getElementById('premiumButton');
const cashfree = new Cashfree({ mode: "sandbox" });
const token = localStorage.getItem('token');
console.log("Sending token:", token);
premiumButton.addEventListener('click', async () => {  
    try {
        const response = await axios.post(
            `${BASE_URL}/pay/payment`,{},
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const { paymentSessionId, orderId } = response.data;
        if (!paymentSessionId || !orderId) throw new Error("Invalid response");

        const checkoutOptions = {
            paymentSessionId,
            redirectTarget: "_modal"
        };

        const result = await cashfree.checkout(checkoutOptions);

        // User closed popup
        if (result.error) {
            console.error("Checkout error:", result.error);
            alert("Transaction Failed or Cancelled");

            await axios.post(
                `${BASE_URL}/pay/payment-failed`,
                { orderId },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            return;
        }

        // Payment Success
        if (result.paymentDetails) {
            console.log("Extracted paymentId:", result.paymentDetails?.paymentId); 
            console.log("Alternative payment_id:", result.paymentDetails?.payment_id);
            const paymentId = result.paymentDetails.paymentId;
            console.log("Payment Details:", result.paymentDetails);

            await axios.post(
                `${BASE_URL}/pay/payment-success`,
                { orderId, paymentId },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Transaction Successful!");
            window.location.reload();
        }

    } catch (error) {
        console.error("Payment initiation failed:", error);
        alert("Something went wrong. Try again.");
    }
});

