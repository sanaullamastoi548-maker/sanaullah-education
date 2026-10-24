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

function displayMedia(mediaList) {
    const container = document.getElementById('mediaContainer');
    if (!container) return;
    container.innerHTML = '';

    mediaList.forEach(item => {
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

                        ${item.Embed_Audio_URL ? `
                            <div class="custom-audio-box">
                                <button class="audio-play-btn"><i class="fa-solid fa-play"></i></button>
                                <div class="audio-waveform"></div>
                                <span class="audio-duration">0:00 / 3:12</span>
                            </div>
                        ` : ''}

                        ${item.Embed_Video_URL ? `
                            <div class="custom-video-box">
                                <iframe src="${item.Embed_Video_URL}" allow="autoplay" allowfullscreen></iframe>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            container.innerHTML += card;
        }
    });
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
