function clearErrors() {
  const errorSpans = document.querySelectorAll(".error-text");
  errorSpans.forEach((span) => {
    span.textContent = "";
  });
}

function displayError(formPrefix, field, message) {
  const errorSpan = document.getElementById(`${formPrefix}-${field}-error`);
  if (errorSpan) {
    errorSpan.textContent = message;
  } else {
    // Fallback to general error if specific field span not found
    const generalSpan = document.getElementById(`${formPrefix}-general-error`);
    if (generalSpan) generalSpan.textContent = message;
  }
}

function showForm(form) {
  clearErrors();
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("forgotForm").classList.add("hidden");
  document.getElementById("welcome").classList.add("hidden")
  document.getElementById("holder").classList.remove("hidden")
 if (form === "signup") {
     document.getElementById("signupForm").classList.remove("hidden");
  } else if (form === "login") {
    document.getElementById("loginForm").classList.remove("hidden");
  } else {
    document.getElementById("forgotForm").classList.remove("hidden");
  }
}


const toggleElement = document.querySelector(".toggleElement");
//show password toggle
function togglePassword(inputId, toggleElement) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    toggleElement.textContent = "👁️ Hide Password";
  } else {
    input.type = "password";
    toggleElement.textContent = "👁️ Show Password";
  }
}
const API_BASE_URL = "https://skillharvest-backend.onrender.com/api";

/* ======== ELEMENTS ======== */
const welcome = document.getElementById("welcome");
const holder = document.getElementById("holder");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const forgotForm = document.getElementById("forgotForm");

/* Buttons / links */
document.getElementById("welcomeSignup").addEventListener("click", () => showForm("signup"));
document.getElementById("welcomeLogin").addEventListener("click", () => showForm("login"));
document.getElementById("signupToLogin").addEventListener("click", () => showForm("login"));
document.getElementById("loginToSignup").addEventListener("click", () => showForm("signup"));
document.getElementById("forgotPasswordBtn").addEventListener("click", () => showForm("forgot"));
document.getElementById("forgotToLogin").addEventListener("click", () => showForm("login"));

/* Form fields */
const signupName = document.querySelector(".signupName");
const signupEmail = document.querySelector(".signupEmail");
const signupDob = document.querySelector(".dob");
const signupGender = document.querySelector(".gender");
const signupPhone = document.querySelector(".phone");
const signupPassword = document.querySelector(".password");
const signupExperience = document.querySelector(".experience");
const signupLocation = document.querySelector(".farmLocation");
const signupFarmType = document.querySelector(".farmType");

const loginEmail = document.querySelector(".loginEmail");
const loginPassword = document.querySelector(".loginPassword");

const forgotEmail = document.querySelector(".forgotName");
const forgotNewPassword = document.getElementById("resetPassword");

/* ======== FUNCTIONS ======== */
function clearErrors() {
  const errorSpans = document.querySelectorAll(".error-text");
  errorSpans.forEach((span) => span.textContent = "");
}

function showForm(form) {
  clearErrors();
  welcome.classList.add("hidden");
  holder.classList.remove("hidden");
  signupForm.classList.add("hidden");
  loginForm.classList.add("hidden");
  forgotForm.classList.add("hidden");

  if (form === "signup") signupForm.classList.remove("hidden");
  if (form === "login") loginForm.classList.remove("hidden");
  if (form === "forgot") forgotForm.classList.remove("hidden");
}

/* ======== SIGNUP ======== */
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const user = {
    name: signupName.value,
    email: signupEmail.value,
    DateOfBirth: signupDob.value,
    gender: signupGender.value,
    phoneNumber: signupPhone.value,
    password: signupPassword.value,
    experience: signupExperience.value,
    farmLocation: signupLocation.value,
    farmType: signupFarmType.value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (res.ok) {
      showNotification("User registered successfully!", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
      window.location.href = "Homepage.html";
    } else {
      showNotification(data.message || "Signup failed.", "error");
    }
  } catch (err) {
    console.error(err);
    showNotification("An error occurred during signup.", "error");
  }
});

/* ======== LOGIN ======== */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const credentials = {
    email: loginEmail.value,
    password: loginPassword.value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    const data = await res.json();

    if (res.ok) {
      showNotification("Login successful!", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
      window.location.href = "Homepage.html";
    } else {
      showNotification(data.message || "Login failed.", "error");
    }
  } catch (err) {
    console.error(err);
    showNotification("An error occurred during login.", "error");
  }
});

/* ======== FORGOT PASSWORD ======== */
forgotForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const payload = {
    email: forgotEmail.value,
    newPassword: forgotNewPassword.value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      showNotification("Password reset successfully!", "success");
      showForm("login");
    } else {
      showNotification(data.message || "Password reset failed.", "error");
    }
  } catch (err) {
    console.error(err);
    showNotification("An error occurred during password reset.", "error");
  }
});
