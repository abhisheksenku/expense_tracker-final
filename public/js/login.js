document.addEventListener('DOMContentLoaded',()=>{
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async(event)=>{
        event.preventDefault();
        const formData = new FormData(loginForm);
        const formValues = Object.fromEntries(formData.entries());
        try {
            const response = await axios.post('http://localhost:3000/user/login',formValues);
            console.log('Login successful',response.data);
            window.location.href = 'expense.html';
            loginForm.reset();
        } catch (error) {
            console.error('Error while logging in:', error);
            alert('Invalid email or password details');
        }
        
    })
})