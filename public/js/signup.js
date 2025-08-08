document.addEventListener('DOMContentLoaded',async ()=>{
    const signupForm = document.getElementById('signupForm');
    const BASE_URL = 'http://65.2.33.7:3000';
    try {
        const response = await axios.get('http://localhost:3000/user/fetch');
        const users = response.data;
        console.log('response.data of fetch',users);
        console.log('response of fetch',response)
    } catch (error) {
        
    }
    signupForm.addEventListener('submit',async (event)=>{
        event.preventDefault();
        const formData = new FormData(signupForm);
        const formValues = Object.fromEntries(formData.entries());
        // console.log(formValues);
        try {
            const response = await axios.post(`${BASE_URL}/user/add`,formValues);
            // const response = await axios.post('http://localhost:3000/user/add',formValues);
            console.log('User added:',response.data);
            console.log('reponse of add',response);
            window.location.href = 'login.html';
            signupForm.reset();
        } catch (err) {      
            console.log("Error caught:", err); 
            if (err.response && err.response.status === 409) {
              console.log("Alerting user");    
              alert(err.response.data.error); 
            } else {
              alert('Something went wrong!');
            }
        }
    });
});
{/* <div class="form-container">
      <form id="signupForm">
        <div class="input-group">
          <input type="text" id="name" name="name" required />
          <label for="name">Full Name</label>
        </div>

        <div class="input-group">
          <input type="email" id="email" name="email" required />
          <label for="email">Email</label>
        </div>

        <div class="input-group">
          <input type="password" id="password" name="password" required />
          <label for="password">Password</label>
        </div>

        <button type="submit">Sign Up</button>
      </form>

      <p class="text-center">
        Already have an account? <a href="login.html">Log in</a>
      </p>
    </div>
  </div> */}