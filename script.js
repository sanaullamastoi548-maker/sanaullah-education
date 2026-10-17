"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // آپ کا بیک اینڈ ویب ایپ یو آر ایل
  const WEB_APP_URL = "۔const SCRIPT_URL ="https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec";
  ";

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const authModal = document.getElementById("authModal");
  const authTitle = document.getElementById("authTitle");
  const authDescription = document.getElementById("authDescription");
  const authNotice = document.getElementById("authNotice");

  const authForm = document.getElementById("authForm");
  const authSwitch = document.getElementById("authSwitch");
  const authSubmitBtn = document.getElementById("authSubmitBtn");

  const nameField = document.getElementById("nameField");
  const fatherField = document.getElementById("fatherField");
  const passwordField = document.getElementById("passwordField");
  const confirmPasswordField =
    document.getElementById("confirmPasswordField");

  const googleLoginBtn =
    document.getElementById("googleLoginBtn");

  const currentYear = document.getElementById("currentYear");

  let authMode = "login";


  // Footer year
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }


  // Mobile navigation
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");

        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  // Open authentication modal
  function openAuth(mode) {
    authMode = mode === "register" ? "register" : "login";

    updateAuthInterface();

    authModal.classList.add("is-open");
    authModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    const firstInput = authModal.querySelector(
      "input:not([type='hidden'])"
    );

    if (firstInput) {
      window.setTimeout(() => firstInput.focus(), 100);
    }
  }


  // Close authentication modal
  function closeAuth() {
    authModal.classList.remove("is-open");
    authModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  }


  // Update login/register appearance
  function updateAuthInterface() {
    const isRegister = authMode === "register";

    authTitle.textContent = isRegister
      ? "Create Your Account"
      : "Welcome Back";

    authDescription.textContent = isRegister
      ? "Prepare to begin your learning journey."
      : "Sign in to continue your learning journey.";

    authSubmitBtn.textContent = isRegister
      ? "Create Account"
      : "Sign In";

    nameField.hidden = !isRegister;
    fatherField.hidden = !isRegister;
    confirmPasswordField.hidden = !isRegister;

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput =
      document.getElementById("confirmPassword");

    const fullNameInput =
      document.getElementById("fullName");

    passwordInput.autocomplete = isRegister
      ? "new-password"
      : "current-password";

    passwordInput.value = "";
    confirmPasswordInput.value = "";

    passwordInput.required = true;
    confirmPasswordInput.required = isRegister;
    fullNameInput.required = isRegister;

    authSwitch.innerHTML = isRegister
      ? 'Already have an account? ' +
        '<button type="button" data-switch-auth="login">' +
        'Sign in' +
        '</button>'
      : 'New student? ' +
        '<button type="button" data-switch-auth="register">' +
        'Create an account' +
        '</button>';

    authNotice.textContent =
      "Connected with Google Apps Script backend.";
  }


  // Open modal buttons
  document.querySelectorAll("[data-open-auth]").forEach((button) => {
    button.addEventListener("click", () => {
      openAuth(button.dataset.openAuth);
    });
  });


  // Close modal buttons
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeAuth);
  });


  // Switch login/register
  authSwitch.addEventListener("click", (event) => {
    const button = event.target.closest("[data-switch-auth]");

    if (!button) {
      return;
    }

    openAuth(button.dataset.switchAuth);
  });


  // Close with Escape
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      authModal.classList.contains("is-open")
    ) {
      closeAuth();
    }
  });


  // Google Login button action (can be linked to backend if needed)
  googleLoginBtn.addEventListener("click", () => {
    authNotice.textContent = "Connecting with Google...";
    // یہاں آپ گوگل اتھینیکیشن کا کوڈ یا بیک اینڈ کال شامل کر سکتے ہیں
  });


  // Form submit connected with Google Apps Script Backend
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!authForm.reportValidity()) {
      return;
    }

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (password.length < 8) {
      authNotice.textContent =
        "Please use a password with at least 8 characters.";
      return;
    }

    let payload = {
      action: authMode, // 'login' یا 'register'
      email: email,
      password: password
    };

    if (authMode === "register") {
      const fullName = document.getElementById("fullName").value.trim();
      const fatherName = document.getElementById("fatherName").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (fullName.length < 2) {
        authNotice.textContent = "Please enter your full name.";
        return;
      }

      if (fatherName.length < 2) {
        authNotice.textContent = "Please enter your father's name.";
        return;
      }

      if (password !== confirmPassword) {
        authNotice.textContent = "The passwords do not match.";
        return;
      }

      payload.fullName = fullName;
      payload.fatherName = fatherName;
    }

    authNotice.textContent = "Processing...";
    authSubmitBtn.disabled = true;

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // گوگلپ اسکرپٹ کے ساتھ عموماً CORS کے لیے یہ طریقہ استعمال ہوتا ہے
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      authNotice.textContent = authMode === "register" 
        ? "Registration request sent successfully to Google Sheet!" 
        : "Login request processed!";
      
      console.info("Backend response sent successfully");
    } catch (error) {
      console.error("Error:", error);
      authNotice.textContent = "Connection failed. Please try again.";
    } finally {
      authSubmitBtn.disabled = false;
    }
  });

});
