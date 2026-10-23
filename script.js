// ==========================================
// 1. Google Apps Script Web App URLs
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';
const MEDIA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';

// DOM Elements Selection
const authContainer = document.getElementById('authContainer');
const mainDashboard = document.getElementById('mainDashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailDisplay = document.getElementById('userEmailDisplay');

const signUpFormBox = document.getElementById('signUpFormBox');
const loginFormBox = document.getElementById('loginFormBox');
const goToLogin = document.getElementById('goToLogin');
const goToSignUp = document.getElementById('goToSignUp');

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('customToast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.innerText = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Language Switcher (Urdu / English)
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

// 3D Flip Swap
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

// Registration Form Handler
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

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  showToast('Successfully completed!');
  openDashboard(email);
});

// Dashboard Opening & Automatic Data Loading
let allMediaData = [];

function openDashboard(email) {
  userEmailDisplay.innerText = "Logged in as: " + email;
  authContainer.style.display = 'none';
  mainDashboard.style.display = 'flex';
  
  fetchMediaData();
}

function fetchMediaData() {
  fetch(MEDIA_SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
      if(data.status === 'success' && data.media) {
        allMediaData = data.media;
        generateSubjectButtons(allMediaData); // خود بخود تمام سبجیکٹس کے فلٹر بٹن بنائے گا
        displayMedia(allMediaData); // ویڈیوز، آڈیوز اور تصاویر سکرین پر شو کرے گا
      }
    })
    .catch(err => console.error('Error fetching media:', err));
}

// خود بخود شیٹ سے سبجیکٹس کے بٹن بنانے کا فنکشن (بار بار کوڈ بدلنے کی ضرورت نہیں)
function generateSubjectButtons(mediaList) {
  const btnContainer = document.querySelector('.subject-filter-buttons');
  if (!btnContainer) return;

  const subjects = ['All'];
  mediaList.forEach(item => {
    if (item.Subject && !subjects.includes(item.Subject.trim())) {
      subjects.push(item.Subject.trim());
    }
  });

  btnContainer.innerHTML = '';

  subjects.forEach(sub => {
    const btn = document.createElement('button');
    btn.innerText = sub === 'All' ? 'سب / All' : sub;
    btn.onclick = () => filterMedia(sub);
    btnContainer.appendChild(btn);
  });
}

// فائنل اور بہترین رینڈرنگ فنکشن (گوگل ڈرائیو پلے بٹن کے ساتھ)
function displayMedia(mediaList) {
  const container = document.getElementById('mediaContainer');
  if (!container) return;
  container.innerHTML = '';

  mediaList.forEach(item => {
    if(item.Status === 'Active') {
      const card = `
        <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); overflow: hidden; padding: 18px; display: flex; flex-direction: column; gap: 12px;">
          
          <!-- تصویر -->
          ${item.Direct_Image_URL ? `<img src="${item.Direct_Image_URL}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px;" alt="${item.Title}">` : ''}
          
          <div>
            <span style="background: #111; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">${item.Subject}</span>
          </div>

          <h3 style="font-size: 18px; color: #111; margin: 0;">${item.Title}</h3>
          <p style="font-size: 13px; color: #555; margin: 0;">${item.Description}</p>

          <!-- صوتی سبق (Audio Player) -->
          ${item.Embed_Audio_URL ? `
            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
              <label style="font-size: 12px; font-weight: bold; color: #333; display: block; margin-bottom: 5px;">🎙️ صوتی سبق (Audio):</label>
              <iframe src="${item.Embed_Audio_URL}" width="100%" height="80" style="border:none; border-radius:6px;" allow="autoplay"></iframe>
            </div>
          ` : ''}

          <!-- ویڈیو سبق (Video Player with Play Button) -->
          ${item.Embed_Video_URL ? `
            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
              <label style="font-size: 12px; font-weight: bold; color: #333; display: block; margin-bottom: 5px;">🎥 ویڈیو سبق (Video):</label>
              <iframe src="${item.Embed_Video_URL}" width="100%" height="220" style="border:none; border-radius:8px;" allow="autoplay" allowfullscreen></iframe>
            </div>
          ` : ''}

        </div>
      `;
      container.innerHTML += card;
    }
  });
}

// فلٹر کرنے کا فنکشن
function filterMedia(subject) {
  if (subject === 'All' || subject === 'سب / All') {
    displayMedia(allMediaData);
  } else {
    const filtered = allMediaData.filter(m => m.Subject && m.Subject.trim().toLowerCase() === subject.trim().toLowerCase());
    displayMedia(filtered);
  }
}

// Logout Handler
logoutBtn.addEventListener('click', () => {
  mainDashboard.style.display = 'none';
  authContainer.style.display = 'flex';
  showToast('Logged out successfully!');
});
