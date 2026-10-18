// ==========================================
// 0. Google Apps Script Web App URL
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';

// ==========================================
// 1. Selecting DOM Elements
// ==========================================
const authContainer = document.getElementById('authContainer');
const mainDashboard = document.getElementById('mainDashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

const signUpFormBox = document.getElementById('signUpFormBox');
const loginFormBox = document.getElementById('loginFormBox');
const goToLogin = document.getElementById('goToLogin');
const goToSignUp = document.getElementById('goToSignUp');

// ==========================================
// 2. Toggle Between Login & Sign Up Forms
// ==========================================
goToLogin.addEventListener('click', () => {
  signUpFormBox.style.display = 'none';
  loginFormBox.style.display = 'block';
  authContainer.classList.add('active-login');
});

goToSignUp.addEventListener('click', () => {
  loginFormBox.style.display = 'none';
  signUpFormBox.style.display = 'block';
  authContainer.classList.remove('active-login');
});

// ==========================================
// 3. Registration Form Submission Handler
// ==========================================
document.getElementById('regForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('regFullName').value;
  const fatherName = document.getElementById('regFatherName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  
  const submitBtn = this.querySelector('.action-btn');
  submitBtn.disabled = true;
  submitBtn.innerText = 'رجسٹریشن ہو رہی ہے...';

  // Student record object matching your Google Sheet headers
  const studentRecord = {
    action: "register",
    Student_ID: "STD-" + Math.floor(10000 + Math.random() * 90000),
    Full_Name: fullName,
    Father_Name: fatherName,
    Email: email,
    Password: password,
    Country: "Pakistan",
    Province: "Sindh",
    City: "Miro Khan",
    Preferred_Language: "Urdu",
    Registration_Date: new Date().toISOString().split('T')[0],
    Account_Status: "Active",
    Last_Login: "",
    Last_Logout: ""
  };

  // Sending data to Google Sheets via Apps Script
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentRecord)
  })
  .then(() => {
    alert('Successfully completed!');
    openDashboard(email);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('کچھ مسئلہ پیش آیا، براہ کرم دوبارہ کوشش کریں۔');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.innerText = 'رجسٹر کریں (Sign Up)';
  });
});

// ==========================================
// 4. Login Form Submission Handler
// ==========================================
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  alert('Successfully completed!');
  openDashboard(email);
});

// ==========================================
// 5. Direct Email / Google Connect Handler
// ==========================================
document.getElementById('googleConnectBtn').addEventListener('click', function() {
  alert('Successfully completed!');
  openDashboard("user.email@scaleflow.com");
});

// ==========================================
// 6. Open Dashboard Function
// ==========================================
function openDashboard(email) {
  userEmailDisplay.innerText = "Logged in as: " + email;
  authContainer.style.display = 'none';
  mainDashboard.style.display = 'flex';
}

// ==========================================
// 7. Logout Handler
// ==========================================
logoutBtn.addEventListener('click', () => {
  mainDashboard.style.display = 'none';
  authContainer.style.display = 'flex';
});
