// ==========================================
// 1. Google Apps Script Web App URL
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';
const MEDIA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';

// DOM Elements Selection
const authContainer = document.getElementById("authContainer");
const mainDashboard = document.getElementById("mainDashboard");

const regForm = document.getElementById("regForm");
const loginForm = document.getElementById("loginForm");

const regMessage = document.getElementById("regMessage");
const loginMessage = document.getElementById("loginMessage");

let currentUser = null;
let allMediaData = [];

// SHOW MESSAGE FUNCTION
function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = "message " + type;
}

// SWITCH TO REGISTER
const toRegisterBtn = document.getElementById("toRegister");
if (toRegisterBtn) {
    toRegisterBtn.addEventListener("click", function() {
        authContainer.classList.add("active");
        showMessage(regMessage, "", "");
    });
}

// SWITCH TO LOGIN
const toLoginBtn = document.getElementById("toLogin");
if (toLoginBtn) {
    toLoginBtn.addEventListener("click", function() {
        authContainer.classList.remove("active");
        showMessage(loginMessage, "", "");
    });
}

// REGISTER SUBMIT HANDLER
regForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const nameInput = document.getElementById("regName") || document.getElementById("regFullName");
    const fatherInput = document.getElementById("regFatherName");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");

    const name = nameInput ? nameInput.value.trim() : "";
    const fatherName = fatherInput ? fatherInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value : "";

    const regBtn = document.querySelector("#regForm button[type='submit']");
    const originalBtnText = regBtn ? regBtn.innerText : "Register Now";

    if (regBtn) {
        regBtn.disabled = true;
        regBtn.innerText = "پروسیسنگ... (Processing)";
    }

    const studentRecord = {
        action: "register",
        Student_ID: "STD_" + Math.floor(10000 + Math.random() * 90000),
        Full_Name: name,
        Father_Name: fatherName,
        Email: email,
        Password: password,
        Country: "Pakistan",
        Province: "Sindh",
        City: "Miro Khan",
        Preferred_Language: "Urdu",
        Registration_Date: new Date().toISOString().split('T')[0],
        Account_Status: "Active"
    };

    // Send Data to Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentRecord)
    })
    .then(() => {
        showMessage(regMessage, "رجسٹریشن کامیاب! ڈیش بورڈ کھل رہا ہے...", "success");
        currentUser = studentRecord;
        
        setTimeout(() => {
            openDashboard(studentRecord);
        }, 800);
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage(regMessage, "کچھ مسئلہ پیش آیا، دوبارہ کوشش کریں۔", "error");
    })
    .finally(() => {
        if (regBtn) {
            regBtn.disabled = false;
            regBtn.innerText = originalBtnText;
        }
    });
});

// LOGIN SUBMIT HANDLER
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";

    showMessage(loginMessage, "لاگ اِن کامیاب!", "success");

    const user = {
        Full_Name: "Student",
        Email: email,
        Student_ID: "STD_LOGGED_IN"
    };

    currentUser = user;

    setTimeout(function() {
        openDashboard(user);
    }, 600);
});

// OPEN DASHBOARD & FETCH MEDIA DATA
function openDashboard(user) {
    const userDisplay = document.getElementById("userDisplayName");
    const studentInfo = document.getElementById("studentInfo");

    if (userDisplay) userDisplay.textContent = user.Full_Name || "Student";
    if (studentInfo) {
        studentInfo.textContent = "Student ID: " + (user.Student_ID || 'Active') + " | Email: " + user.Email;
    }

    authContainer.style.display = "none";
    mainDashboard.style.display = "flex";

    // گوگل شیٹ سے آٹومیٹک ڈیٹا فیچ کرنا
    fetchMediaData();
}

// FETCH MEDIA FROM GOOGLE SHEETS
function fetchMediaData() {
    fetch(MEDIA_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success' && data.media) {
                allMediaData = data.media;
                generateSubjectButtons(allMediaData);
                displayMedia(allMediaData);
            }
        })
        .catch(err => console.error('Error fetching media:', err));
}

// DYNAMIC SUBJECT BUTTONS GENERATOR
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

// DISPLAY MEDIA CARDS
function displayMedia(mediaList) {
    const container = document.getElementById('mediaContainer');
    if (!container) return;
    container.innerHTML = '';

    mediaList.forEach(item => {
        if(item.Status === 'Active') {
            const card = `
                <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); overflow: hidden; padding: 18px; display: flex; flex-direction: column; gap: 12px; text-align: right; direction: rtl;">
                    
                    ${item.Direct_Image_URL ? `<img src="${item.Direct_Image_URL}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px;" alt="${item.Title}">` : ''}
                    
                    <div>
                        <span style="background: #0f172a; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold;">${item.Subject}</span>
                    </div>

                    <h3 style="font-size: 18px; color: #0f172a; margin: 0;">${item.Title}</h3>
                    <p style="font-size: 13px; color: #64748b; margin: 0;">${item.Description}</p>

                    ${item.Embed_Audio_URL ? `
                        <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <label style="font-size: 12px; font-weight: bold; color: #333; display: block; margin-bottom: 5px;">🎙️ صوتی سبق (Audio):</label>
                            <iframe src="${item.Embed_Audio_URL}" width="100%" height="80" style="border:none; border-radius:6px;" allow="autoplay"></iframe>
                        </div>
                    ` : ''}

                    ${item.Embed_Video_URL ? `
                        <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
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

// FILTER MEDIA BY SUBJECT
function filterMedia(subject) {
    if (subject === 'All' || subject === 'سب / All') {
        displayMedia(allMediaData);
    } else {
        const filtered = allMediaData.filter(m => m.Subject && m.Subject.trim().toLowerCase() === subject.trim().toLowerCase());
        displayMedia(filtered);
    }
}

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        currentUser = null;
        mainDashboard.style.display = "none";
        authContainer.style.display = "block";
        authContainer.classList.remove("active");

        if (loginForm) loginForm.reset();
        if (regForm) regForm.reset();

        showMessage(loginMessage, "", "");
        showMessage(regMessage, "", "");
    });
}
