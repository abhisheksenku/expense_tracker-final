document.addEventListener('DOMContentLoaded',()=>{
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        const formData = new FormData(signupForm);
        const formValues = Object.fromEntries(formData.entries());
        console.log(formValues);
    });
});