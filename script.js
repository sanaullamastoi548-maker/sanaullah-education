// ==========================================
// 1. Google Apps Script Web App URLs
// ==========================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';
const MEDIA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec';

const authContainer = document.getElementById('authContainer');
const mainDashboard = document.getElementById('mainDashboard');
const logoutBtn = document.getElementById('logoutBtn');

document.getElementById('toRegister').addEventListener('click', () => authContainer.classList.add('active'));
document.getElementById('toLogin').addEventListener('click', () => authContainer.classList.remove('active'));

function showToast(msg) {
    const toast = document.getElementById('customToast');
    document.getElementById('toastMessage').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// رجسٹریشن ہینڈلر
document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    
    const record = {
        action: "register",
        Student_ID: "STD-" + Math.floor(10000 + Math.random() * 90000),
        Full_Name: document.getElementById('regFullName').value,
        Father_Name: document.getElementById('regFatherName').value,
        Email: email,
        Password: document.getElementById('regPassword').value,
        Country: "Pakistan", Province: "Sindh", City: "Miro Khan",
        Preferred_Language: "Urdu",
        Registration_Date: new Date().toISOString().split('T')[0],
        Account_Status: "Active"
    };

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    }).then(() => {
        showToast('کامیابی سے رجسٹر ہو گئے!');
        openDashboard(email);
    }).catch(() => showToast('خرابی پیش آئی'));
});

// لاگ ان ہینڈلر
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    showToast('کامیابی سے لاگ ان ہو گئے!');
    openDashboard(email);
});

let allMediaData = [];

function openDashboard(email) {
    document.getElementById('userEmailDisplay').innerText = "Logged in as: " + email;
    authContainer.style.display = 'none';
    mainDashboard.style.display = 'flex';
    fetchMediaData();
}

function fetchMediaData() {
    fetch(MEDIA_SCRIPT_URL)
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success' && data.media) {
                allMediaData = data.media;
                generateSubjectButtons(allMediaData);
                displayMedia(allMediaData);
            }
        })
        .catch(err => console.error(err));
}

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
        btn.innerText = sub === 'All' ? 'جميع / All' : sub;
        btn.onclick = () => filterMedia(sub);
        btnContainer.appendChild(btn);
    });
}

// میڈیا کارڈز جنریٹ کرنے کا فنکشن (آئی فریم کے ساتھ جو فوراً پلے ہو گا)
function displayMedia(mediaList) {
    const container = document.getElementById('mediaContainer');
    if (!container) return;
    container.innerHTML = '';

    mediaList.forEach((item, index) => {
        if(item.Status === 'Active') {
            const card = `
                <div class="lesson-card">
                    <div class="lesson-thumb-container">
                        ${item.Direct_Image_URL ? `<img src="${item.Direct_Image_URL}" alt="${item.Title}">` : ''}
                        <span class="lesson-subject-badge">${item.Subject}</span>
                    </div>

                    <div class="lesson-details">
                        <h3>${item.Title}</h3>
                        <p>${item.Description}</p>

                        <!-- صوتی سبق (Audio Player using iframe) -->
                        ${item.Embed_Audio_URL ? `
                            <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 15px;">
                                <label style="font-size: 13px; font-weight: bold; color: #1e293b; display: block; margin-bottom: 10px;">🎙️ صوتی سبق (Audio):</label>
                                <div id="audio_box_${index}" style="display: none; margin-bottom: 10px;">
                                    <iframe src="${item.Embed_Audio_URL}" width="100%" height="90" style="border:none; border-radius:8px;" allow="autoplay"></iframe>
                                </div>
                                <button onclick="toggleIframeAudio('audio_box_${index}', this)" style="width: 100%; background: #0f172a; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: 0.3s;">
                                    <i class="fa-solid fa-play" style="font-size: 16px;"></i> صوتی سبق پلے کریں (Play Audio)
                                </button>
                            </div>
                        ` : ''}

                        <!-- ویڈیو سبق (Video Player using iframe) -->
                        ${item.Embed_Video_URL ? `
                            <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <label style="font-size: 13px; font-weight: bold; color: #1e293b; display: block; margin-bottom: 10px;">🎥 ویڈیو سبق (Video):</label>
                                <div id="video_box_${index}" style="display: none; margin-bottom: 10px;">
                                    <iframe src="${item.Embed_Video_URL}" width="100%" height="220" style="border:none; border-radius:8px;" allow="autoplay" allowfullscreen></iframe>
                                </div>
                                <button onclick="toggleIframeVideo('video_box_${index}', this)" style="width: 100%; background: #d97706; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: 0.3s;">
                                    <i class="fa-solid fa-play" style="font-size: 16px;"></i> ویڈیو پلے کریں (Play Video)
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            container.innerHTML += card;
        }
    });
}

// آڈیو آئی فریم کو کھولنے اور بند کرنے کا فنکشن
function toggleIframeAudio(boxId, btn) {
    const box = document.getElementById(boxId);
    
    if (box.style.display === 'none') {
        box.style.display = 'block';
        btn.innerHTML = '<i class="fa-solid fa-pause" style="font-size: 16px;"></i> صوتی سبق بند کریں (Close Audio)';
        btn.style.background = '#ef4444'; // سرخ رنگ
    } else {
        box.style.display = 'none';
        btn.innerHTML = '<i class="fa-solid fa-play" style="font-size: 16px;"></i> صوتی سبق پلے کریں (Play Audio)';
        btn.style.background = '#0f172a'; // ڈارک بلیو رنگ
    }
}

// ویڈیو آئی فریم کو کھولنے اور بند کرنے کا فنکشن
function toggleIframeVideo(boxId, btn) {
    const box = document.getElementById(boxId);
    
    if (box.style.display === 'none') {
        box.style.display = 'block';
        btn.innerHTML = '<i class="fa-solid fa-pause" style="font-size: 16px;"></i> ویڈیو بند کریں (Close Video)';
        btn.style.background = '#ef4444';
    } else {
        box.style.display = 'none';
        btn.innerHTML = '<i class="fa-solid fa-play" style="font-size: 16px;"></i> ویڈیو پلے کریں (Play Video)';
        btn.style.background = '#d97706';
    }
}

function filterMedia(subject) {
    if (subject === 'All' || subject === 'جميع / All') {
        displayMedia(allMediaData);
    } else {
        const filtered = allMediaData.filter(m => m.Subject && m.Subject.trim().toLowerCase() === subject.trim().toLowerCase());
        displayMedia(filtered);
    }
}

logoutBtn.addEventListener('click', () => {
    mainDashboard.style.display = 'none';
    authContainer.style.display = 'block';
    authContainer.classList.remove('active');
    document.getElementById('loginForm').reset();
    document.getElementById('regForm').reset();
    showToast('لاگ آؤٹ ہو گئے');
});
