// Helper to validate email with a simple regex
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subscribeForm');
  const emailInput = document.getElementById('email');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const subscribeButton = document.getElementById('subscribeButton');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const emailValue = emailInput.value.trim();
    if (!isValidEmail(emailValue)) {
      errorMessage.textContent = 'Please enter a valid email address.';
      emailInput.focus();
      return;
    }

    // Disable button to prevent multiple clicks
    subscribeButton.disabled = true;
    subscribeButton.textContent = 'Subscribing...';

    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue })
      });

      if (response.ok) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
      } else {
        let data;
        try {
          data = await response.json();
        } catch {
          data = null;
        }
        const serverMsg = data && data.error ? data.error : 'Subscription failed. Please try again later.';
        errorMessage.textContent = serverMsg;
        subscribeButton.disabled = false;
        subscribeButton.textContent = 'Subscribe';
      }
    } catch (err) {
      console.error('Error while subscribing:', err);
      errorMessage.textContent = 'Network error. Please check your connection and try again.';
      subscribeButton.disabled = false;
      subscribeButton.textContent = 'Subscribe';
    }
  });

  emailInput.addEventListener('input', () => {
    if (errorMessage.textContent) {
      errorMessage.textContent = '';
    }
  });
});
