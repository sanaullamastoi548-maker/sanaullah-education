const GOOGLE_SCRIPT_URL = https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';

const authContainer = document.getElementById('authContainer');
const mainDashboard = document.getElementById('mainDashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

const signUpFormBox = document.getElementById('signUpFormBox');
const loginFormBox = document.getElementById('loginFormBox');
const goToLogin = document.getElementById('goToLogin');
const goToSignUp = document.getElementById('goToSignUp');

function showToast(message) {
  const toast = document.getElementById('customToast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.innerText = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// زبان کی تبدیلی کا نظام (Urdu / English Switcher)
let currentLang = 'ur';
const langToggleBtn = document.getElementById('langToggleBtn');

langToggleBtn.addEventListener('click', () => {
  if (currentLang === 'ur') {
    currentLang = 'en';
    langToggleBtn.innerText = 'اردو';
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
    
    document.getElementById('brandTitle').innerHTML = 'WELCOME TO<br>SANAULLAH<br>EDUCATION';
    document.getElementById('brandSubtitle').innerText = 'Modern and Secure Educational Portal';
    document.getElementById('signUpTitle').innerText = 'Sign Up';
    document.getElementById('loginTitle').innerText = 'Login';
    document.getElementById('signUpBtnText').innerText = 'Sign Up';
    document.getElementById('loginBtnText').innerText = 'Login';
    document.getElementById('hasAccountText').innerText = 'Already have an account?';
    document.getElementById('noAccountText').innerText = "Don't have an account?";
    document.getElementById('goToLogin').innerText = 'Login';
    document.getElementById('goToSignUp').innerText = 'Sign Up';
    document.getElementById('logoutBtn').innerText = 'Logout';
    document.getElementById('dashBrand').innerText = 'SANAULLAH EDUCATION';
    document.getElementById('dashWelcome').innerText = 'Welcome to Sanaullah Education!';
    document.getElementById('dashSubText').innerText = 'Your account has been successfully registered / logged in.';
  } else {
    currentLang = 'ur';
    langToggleBtn.innerText = 'English';
    document.documentElement.setAttribute('lang', 'ur');
    document.documentElement.setAttribute('dir', 'rtl');
    
    document.getElementById('brandTitle').innerHTML = 'WELCOME TO<br>SANAULLAH<br>EDUCATION';
    document.getElementById('brandSubtitle').innerText = 'تعلیمی نظام کا جدید اور محفوظ پلیٹ فارم';
    document.getElementById('signUpTitle').innerText = 'Sign Up';
    document.getElementById('loginTitle').innerText = 'Login';
    document.getElementById('signUpBtnText').innerText = 'Sign Up';
    document.getElementById('loginBtnText').innerText = 'Login';
    document.getElementById('hasAccountText').innerText = 'پہلے سے اکاؤنٹ موجود ہے؟';
    document.getElementById('noAccountText').innerText = 'اکاؤنٹ نہیں ہے؟';
    document.getElementById('goToLogin').innerText = 'Login';
    document.getElementById('goToSignUp').innerText = 'Sign Up';
    document.getElementById('logoutBtn').innerText = 'لاگ آؤٹ';
    document.getElementById('dashBrand').innerText = 'SANAULLAH EDUCATION';
    document.getElementById('dashWelcome').innerText = 'Welcome to Sanaullah Education!';
    document.getElementById('dashSubText').innerText = 'آپ کا اکاؤنٹ کامیابی سے لاگ ان / رجسٹر ہو چکا ہے۔';
  }
});

// تھری ڈی فلپ اور پینل سویپ اینیمیشن
goToLogin.addEventListener('click', () => {
  signUpFormBox.style.display = 'none';
  loginFormBox.style.display = 'block';
  authContainer.classList.add('flip-layout');
});

goToSignUp.addEventListener('click', () => {
  loginFormBox.style.display = 'none';
  signUpFormBox.style.display = 'block';
  authContainer.classList.remove('flip-layout');
});

// رجسٹریشن فارم سبمٹ ہونے پر شیٹ میں ڈیٹا بھیجنا
document.getElementById('regForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('regFullName').value;
  const fatherName = document.getElementById('regFatherName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  
  const submitBtn = document.getElementById('signUpBtnText');
  submitBtn.disabled = true;
  submitBtn.innerText = 'Processing...';

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

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentRecord)
  })
  .then(() => {
    showToast('Successfully completed!');
    openDashboard(email);
  })
  .catch(error => {
    console.error('Error:', error);
    showToast('کچھ مسئلہ پیش آیا، دوبارہ کوشش کریں۔');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.innerText = 'Sign Up';
  });
});

// لاگ ان فارم ہینڈلر
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  showToast('Successfully completed!');
  openDashboard(email);
});

function openDashboard(email) {
  userEmailDisplay.innerText = "Logged in as: " + email;
  authContainer.style.display = 'none';
  mainDashboard.style.display = 'flex';
}

logoutBtn.addEventListener('click', () => {
  mainDashboard.style.display = 'none';
  authContainer.style.display = 'flex';
  showToast('Logged out successfully!');
});
