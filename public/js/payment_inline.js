const cashfree = new Cashfree({ mode: "sandbox" });
const token = localStorage.getItem('token');

document.getElementById("premiumButton").addEventListener('click', async () => {
    try {
        const response = await axios.post('http://localhost:3000/pay/pay',{},{
            headers: {
                Authorization: token
            }
        });

        const { paymentSessionId, orderId } = response.data;

        if (!paymentSessionId || !orderId) throw new Error("Invalid response");

        const checkoutOptions = {
            paymentSessionId,
            redirectTarget: "_inline",
            container:'#cashfree-checkout'
        };

        const result = await cashfree.checkout(checkoutOptions);

        // User closed popup
        if (result.error) {
            console.error("Checkout error:", result.error);
            alert("Transaction Failed or Cancelled");

            await axios.post('http://localhost:3000/pay/payment-failed', { orderId },{
                headers: {
                    Authorization: token
                }
            });

            return;
        }

        // Payment Success
        if (result.paymentDetails) {
            const paymentId = result.paymentDetails.paymentId;
            console.log("Payment Details:", result.paymentDetails);

            await axios.post('http://localhost:3000/pay/payment-success', {
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


