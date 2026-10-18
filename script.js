// آپ کا ایپس اسکرپٹ ویب ایپ یو آر ایل
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';

document.addEventListener('DOMContentLoaded', () => {
  const authModal = document.getElementById('authModal');
  const authForm = document.getElementById('authForm');
  const authTitle = document.getElementById('authTitle');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const nameField = document.getElementById('nameField');
  const fatherField = document.getElementById('fatherField');
  const confirmPasswordField = document.getElementById('confirmPasswordField');
  const authSwitch = document.getElementById('authSwitch');

  // موڈل کھولنے کے لیے بٹن ہینڈلرز
  document.querySelectorAll('[data-open-auth]').forEach(button => {
    button.addEventListener('click', () => {
      setAuthMode(button.getAttribute('data-open-auth'));
      authModal.classList.add('is-open');
    });
  });

  // موڈل بند کرنے کے لیے
  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      authModal.classList.remove('is-open');
    });
  });

  // لاگ ان اور سائن اپ کے درمیان سوئچ کرنے کے لیے
  if (authSwitch) {
    authSwitch.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        setAuthMode(e.target.getAttribute('data-switch-auth'));
      }
    });
  }

  function setAuthMode(mode) {
    if (mode === 'register') {
      authTitle.innerText = 'Create Account';
      authSubmitBtn.innerText = 'Sign Up';
      nameField.removeAttribute('hidden');
      fatherField.removeAttribute('hidden');
      confirmPasswordField.removeAttribute('hidden');
      authSwitch.innerHTML = 'Already have an account? <button type="button" data-switch-auth="login">Login</button>';
    } else {
      authTitle.innerText = 'Welcome Back';
      authSubmitBtn.innerText = 'Sign In';
      nameField.setAttribute('hidden', 'true');
      fatherField.setAttribute('hidden', 'true');
      confirmPasswordField.setAttribute('hidden', 'true');
      authSwitch.innerHTML = 'New student? <button type="button" data-switch-auth="register">Create an account</button>';
    }
  }

  // فارم سبمٹ ہونے کا عمل
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isRegistering = !nameField.hasAttribute('hidden');

      if (isRegistering) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
          alert('پاس ورڈز میچ نہیں کر رہے۔');
          return;
        }

        authSubmitBtn.disabled = true;
        authSubmitBtn.innerText = 'رجسٹریشن ہو رہی ہے...';

        // آپ کی شیٹ کے کالمز کے مطابق ڈیٹا کا ڈھانچہ
        const studentData = {
          action: 'register',
          Student_ID: 'STD-' + Math.floor(1000 + Math.random() * 9000),
          Full_Name: document.getElementById('fullName').value,
          Father_Name: document.getElementById('fatherName').value || 'N/A',
          Email: document.getElementById('email').value,
          Password: password, 
          Country: 'Pakistan',
          Province: 'Sindh',
          City: 'Miro Khan',
          Preferred_Language: 'Urdu',
          Registration_Date: new Date().toISOString().split('T')[0],
          Account_Status: 'Active'
        };

        // گوگل شیٹ کو بیک اینڈ کے ذریعے ڈیٹا بھیجنا
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        })
        .then(() => {
          alert('Successfully completed!');
          authModal.classList.remove('is-open');
          authForm.reset();
        })
        .catch(error => {
          console.error('Error:', error);
          alert('کچھ مسئلہ پیش آیا، دوبارہ کوشش کریں۔');
        })
        .finally(() => {
          authSubmitBtn.disabled = false;
          authSubmitBtn.innerText = 'Sign Up';
        });

      } else {
        alert('لاگ ان فیچر کی توثیق جاری ہے۔');
        authModal.classList.remove('is-open');
      }
    });
  }
});
