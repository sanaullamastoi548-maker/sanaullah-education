// ==========================================
// 1. Google Apps Script Web App URL
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';

// DOM ELEMENTS
const authContainer = document.getElementById("authContainer");
const mainDashboard = document.getElementById("mainDashboard");

const regForm = document.getElementById("regForm");
const loginForm = document.getElementById("loginForm");

const regMessage = document.getElementById("regMessage");
const loginMessage = document.getElementById("loginMessage");

let currentUser = null;

// SHOW MESSAGE FUNCTION
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = "message " + type;
}

// SWITCH TO REGISTER
document.getElementById("toRegister").addEventListener("click", function() {
    authContainer.classList.add("active");
    showMessage(regMessage, "", "");
});

// SWITCH TO LOGIN
document.getElementById("toLogin").addEventListener("click", function() {
    authContainer.classList.remove("active");
    showMessage(loginMessage, "", "");
});

// REGISTER SUBMIT HANDLER
regForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const fatherName = document.getElementById("regFatherName").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;

    const regBtn = document.getElementById("regBtnText");
    regBtn.disabled = true;
    regBtn.innerText = "پروسیسنگ... (Processing)";

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

    // Send Data to Google Sheet
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
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage(regMessage, "کچھ مسئلہ پیش آیا، دوبارہ کوشش کریں۔", "error");
    })
    .finally(() => {
        regBtn.disabled = false;
        regBtn.innerText = "رجسٹر کریں (Register)";
    });
});

// LOGIN SUBMIT HANDLER
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    showMessage(loginMessage, "لاگ اِن کامیاب!", "success");

    const user = {
        Full_Name: "Student",
        Email: email,
        Student_ID: "STD_LOGGED_IN"
    };

    currentUser = user;

    setTimeout(function() {
        openDashboard(user);
    }, 800);
});

// OPEN DASHBOARD
function openDashboard(user) {
    document.getElementById("userDisplayName").textContent = user.Full_Name;
    document.getElementById("studentInfo").textContent =
        "Student ID: " + (user.Student_ID || 'Active') + " | Email: " + user.Email;

    authContainer.style.display = "none";
    mainDashboard.style.display = "flex";
}

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", function() {
    currentUser = null;
    mainDashboard.style.display = "none";
    authContainer.style.display = "block";
    authContainer.classList.remove("active");

    loginForm.reset();
    regForm.reset();

    showMessage(loginMessage, "", "");
    showMessage(regMessage, "", "");
});
