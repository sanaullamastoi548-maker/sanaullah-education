"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // آپ کا بیک اینڈ ویب ایپ یو آر ایل (درست کیا گیا)
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxj6GVlkg56151m1G8eh7E1OIjM6SoV7HC8zvs5_LqGxWytkSaP0T3kJiHTaLSJmDhW/exec";

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
  const confirmPasswordField = document.getElementById("confirmPasswordField");

  const googleLoginBtn = document.getElementById("googleLoginBtn");
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
      menuToggle.setAttribute("aria-expanded", String(isOpen));
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

    const firstInput = authModal.querySelector("input:not([type='hidden'])");

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

    authTitle.textContent = isRegister ? "Create Your Account" : "Welcome Back";

    authDescription.textContent = isRegister
      ? "Prepare to begin your learning journey."
      : "Sign in to continue your learning journey.";

    authSubmitBtn.textContent = isRegister ? "Create Account" : "Sign In";

    if (nameField) nameField.hidden = !isRegister;
    if (fatherField) fatherField.hidden = !isRegister;
    if (confirmPasswordField) confirmPasswordField.hidden = !isRegister;

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const fullNameInput = document.getElementById("fullName");

    if (passwordInput) {
      passwordInput.autocomplete = isRegister ? "new-password" : "current-password";
      passwordInput.value = "";
      passwordInput.required = true;
    }

    if (confirmPasswordInput) {
      confirmPasswordInput.value = "";
      confirmPasswordInput.required = isRegister;
    }

    if (fullNameInput) {
      fullNameInput.required = isRegister;
    }

    if (authSwitch) {
      authSwitch.innerHTML = isRegister
        ? 'Already have an account? <button type="button" data-switch-auth="login">Sign in</button>'
        : 'New student? <button type="button" data-switch-auth="register">Create an account</button>';
    }

    if (authNotice) {
      authNotice.textContent = "Connected with Google Apps Script backend.";
    }
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
  if (authSwitch) {
    authSwitch.addEventListener("click", (event) => {
      const button = event.target.closest("[data-switch-auth]");
      if (!button) return;
      openAuth(button.dataset.switchAuth);
    });
  }

  // Close with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && authModal && authModal.classList.contains("is-open")) {
      closeAuth();
    }
  });

  // Google Login button action
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", () => {
      if (authNotice) authNotice.textContent = "Connecting with Google...";
    });
  }

  // Form submit connected with Google Apps Script Backend
  if (authForm) {
    authForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!authForm.reportValidity()) return;

      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      if (password.length < 8) {
        if (authNotice) authNotice.textContent = "Please use a password with at least 8 characters.";
        return;
      }

      let payload = {
        action: authMode, // 'login' یا 'register'
        email: email,
        password: password
      };

      if (authMode === "register") {
        const fullNameInput = document.getElementById("fullName");
        const fatherNameInput = document.getElementById("fatherName");
        const confirmPasswordInput = document.getElementById("confirmPassword");

        const fullName = fullNameInput ? fullNameInput.value.trim() : "";
        const fatherName = fatherNameInput ? fatherNameInput.value.trim() : "";
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

        if (fullName.length < 2) {
          if (authNotice) authNotice.textContent = "Please enter your full name.";
          return;
        }

        if (fatherName.length < 2) {
          if (authNotice) authNotice.textContent = "Please enter your father's name.";
          return;
        }

        if (password !== confirmPassword) {
          if (authNotice) authNotice.textContent = "The passwords do not match.";
          return;
        }

        payload.name = fullName; // Apps Script doPost کے ساتھ مطابقت کے لیے 'name' رکھا ہے
        payload.fullName = fullName;
        payload.fatherName = fatherName;
      }

      if (authNotice) authNotice.textContent = "Processing...";
      if (authSubmitBtn) authSubmitBtn.disabled = true;

      try {
        // text/plain کے ساتھ POST کی درخواست بھیجیں تاکہ CORS بلاک نہ ہو
        const response = await fetch(WEB_APP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.result === "success") {
          if (authNotice) {
            authNotice.textContent = authMode === "register"
              ? "Registration successful! Saved to Google Sheet."
              : "Login request processed!";
          }
          alert("کامیابی: ڈیٹا گوگل شیٹ میں بھیج دیا گیا ہے!");
          closeAuth();
        } else {
          if (authNotice) authNotice.textContent = "Error: " + (result.error || "Failed to process request.");
        }
      } catch (error) {
        console.error("Error:", error);
        if (authNotice) {
          authNotice.textContent = "Request sent! Please check your Google Sheet.";
        }
      } finally {
        if (authSubmitBtn) authSubmitBtn.disabled = false;
      }
    });
  }
});
