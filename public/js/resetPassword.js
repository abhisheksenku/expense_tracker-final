document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('resetForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value.trim();
    const messageEl = document.getElementById('message');
    const errorEl = document.getElementById('error');
    messageEl.textContent = '';
    errorEl.textContent = '';

    if (!newPassword || newPassword.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters long.';
      return;
    }

    const token = window.location.pathname.split('/').pop();

    try {
      const response = await axios.post(
        `/password/resetpassword/${token}`,
        { newPassword },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Axios puts response data in `response.data`
      const result = response.data;

      messageEl.textContent = result.message || 'Password reset successful!';
      document.getElementById('resetForm').reset();

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        errorEl.textContent = err.response.data.error;
      } else {
        errorEl.textContent = 'Error connecting to server.';
      }
      console.error(err);
    }
  });
});
