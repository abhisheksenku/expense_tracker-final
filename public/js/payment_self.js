const premiumButton = document.getElementById('premiumButton');
const cashfree = new Cashfree({ mode: "sandbox" });

premiumButton.addEventListener('click', async () => {
    try {
        const response = await axios.post(`${BASE_URL}/pay/payment`,{},
            {
                headers: {
                    Authorization: token
                }
            });

        const { paymentSessionId, orderId } = response.data;
        if (!paymentSessionId || !orderId) throw new Error("Invalid response");

        const checkoutOptions = {
            paymentSessionId,
            redirectTarget: "_self"
        };

        const result = await cashfree.checkout(checkoutOptions);

        if (result.error) {
            console.error("Checkout error:", result.error);
            alert("Transaction Failed or Cancelled");

            await axios.post(`${BASE_URL}/pay/payment-failed`, { orderId },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            return;
        }

        if (result.paymentDetails) {
            const paymentId = result.paymentDetails.paymentId;
            console.log("Payment Details:", result.paymentDetails);

            await axios.post(`${BASE_URL}/pay/payment-success`, {
                orderId,
                paymentId
            },{
                    headers: {
                        Authorization: token
                    }
                });

            alert("Transaction Successful!");
        }

    } catch (error) {
        console.error("Payment initiation failed:", error);
        alert("Something went wrong. Try again.");
    }
});
