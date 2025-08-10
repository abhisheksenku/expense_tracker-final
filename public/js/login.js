document.addEventListener('DOMContentLoaded',()=>{
    const loginForm = document.getElementById('loginForm');
    const forgotBtn = document.getElementById('forgotPasswordBtn');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    loginForm.addEventListener('submit', async(event)=>{
        event.preventDefault();
        const formData = new FormData(loginForm);
        const formValues = Object.fromEntries(formData.entries());
        try {
            const response = await axios.post(`${BASE_URL}/user/login`,formValues);
            console.log('Login successful',response.data);
            localStorage.setItem('token',response.data.token);
            window.location.href = 'expense.html';
            loginForm.reset();
        } catch (error) {
            console.error('Error while logging in:', error);
            alert('Invalid email or password details');
        }
        
    });
    forgotBtn.addEventListener('click',()=>{
        const container = document.getElementById('forgotContainer');
        container.style.display = container.style.display === "none" ? "block" : "none";
    });
    forgotPasswordForm.addEventListener('submit',async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        try {
            const response = await axios.post(`${BASE_URL}/password/forgotpassword`, { email });
            // console.log('Reset link is sent successfully', response.data);
            alert('If this email exists, a mail has been sent.');
            forgotPasswordForm.reset();
        } catch (err) {
            console.error('Error sending reset email:', err);
            alert('Failed to send reset email. Please try again.');
        }
    })
})