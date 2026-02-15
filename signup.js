const API_BASE_URL = "https://skillharvest-backend.onrender.com/api";

/* ===== ELEMENTS ===== */
const welcome = document.getElementById("welcome");
const holder = document.getElementById("holder");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const forgotForm = document.getElementById("forgotForm");

/* ===== INPUTS ===== */
// Signup
const signupName = document.querySelector(".signupName");
const signupEmail = document.querySelector(".signupEmail");
const signupDob = document.querySelector(".dob");
const signupGender = document.querySelector(".gender");
const signupPhone = document.querySelector(".phone");
const signupPassword = document.getElementById("signupPassword");
const signupExperience = document.getElementById("experience");
const signupLocation = document.getElementById("farmLocation");
const signupFarmType = document.querySelector(".farmType");

// Login
const loginEmail = document.querySelector(".loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginName = document.querySelector(".loginName");
const loginPhone = document.querySelector(".loginPhone");


// Forgot
const forgotEmail = document.getElementById("forgotEmail");
const forgotCode = document.getElementById("forgotCode");
const forgotNewPassword = document.getElementById("forgotNewPassword");




/// ===== NOTIFICATIONS ===== */
function displayError(formPrefix, field, message) {
  const errorSpan = document.getElementById(`${formPrefix}-${field}-error`);

  if (!errorSpan) {
    console.warn(`Missing error span: ${formPrefix}-${field}-error`);
    return;
  }
  errorSpan.textContent = message;
  errorSpan.classList.remove("hidden");
  errorSpan.classList.add("block");
}


/* ===== HELPERS ===== */
function clearErrors() {
  document.querySelectorAll(".error-text").forEach(span => {
    span.textContent = ""
    span.classList.add("hidden")
     span.classList.remove("block");
  }
  );
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

function togglePassword(inputId, el) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
  el.textContent =
    input.type === "password" ? "👁️" : "👁️ Hide Password";
    el.classList.toggle("min-w-max");
}

function setLoading(btn, isLoading, text = "Loading...") {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? text : btn.dataset.originalText;
}

/* ===== VALIDATION ===== */
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

/* ===== SIGNUP ===== */
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const btn = signupForm.querySelector("button");
  btn.dataset.originalText = btn.textContent;
  setLoading(btn, true);

  const payload = {
    name: signupName.value,
    email: signupEmail.value,
    DateOfBirth: signupDob.value,
    gender: signupGender.value,
    phoneNumber: signupPhone.value,
    password: signupPassword.value,
    // experience: signupExperience.value,
    farmLocation: signupLocation.value,
    farmType: signupFarmType.value
  };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
   
    if (!res.ok) {
      showNotification(data.message || "Signup failed", "error");
      // Express-validator errors
        data.errors.forEach(msg => {
          if (msg.toLowerCase().includes("name")) displayError("signup", "name", msg);
          else if (msg.toLowerCase().includes("email")) displayError("signup", "email", msg);
          else if (msg.toLowerCase().includes("password")) displayError("signup", "password", msg);
          else if (msg.toLowerCase().includes("birth") || msg.toLowerCase().includes("dob")) displayError("signup", "DateOfBirth", msg);
          else if (msg.toLowerCase().includes("gender")) displayError("signup", "gender", msg);
          else if (msg.toLowerCase().includes("phone")) displayError("signup", "phoneNumber", msg);
          else if (msg.toLowerCase().includes("experience")) displayError("signup", "experience", msg);
          else if (msg.toLowerCase().includes("location")) displayError("signup", "farmLocation", msg);
          else if (msg.toLowerCase().includes("farm type")) displayError("signup", "farmType", msg);
        });
      return;
      }else if (data.status === 409) {
        displayError("signup", "email", data.message);
        return;
      } else {
        showNotification(data.message || "Registration failed.", "error");
      }

    localStorage.setItem("token", data.token);
    localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
    window.location.href = "signup.html";
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    showNotification("Network error. Try again.", "error");
  } finally {
    setLoading(btn, false);
  }
});

/* ===== LOGIN ===== */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();


  const btn = loginForm.querySelector("button");
  btn.dataset.originalText = btn.textContent;
  setLoading(btn, true);
   
   const payload = {
  name: loginName.value,
  phoneNumber: loginPhone.value,
  email: loginEmail.value,
  password: loginPassword.value
};

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
       data.errors.forEach(msg => {
          if (msg.toLowerCase().includes("email")) displayError("login", "email", msg);
          else if (msg.toLowerCase().includes("password")) displayError("login", "password", msg);
          else if (msg.toLowerCase().includes("name")) displayError("login", "name", msg);
          else if (msg.toLowerCase().includes("phone")) displayError("login", "phone", msg);
        });
      showNotification(
        data.message || data.errors?.[0] || "Login failed",
        "error"
      );
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
    window.location.href = "Homepage.html";
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    showNotification("Invalid login details or Network error",
       "error");
  } finally {
    setLoading(btn, false);
  }
});

let resetStep = 1; 

forgotForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const btn = forgotForm.querySelector("button");
  btn.dataset.originalText = btn.textContent;
  setLoading(btn, true);

  try {
    let res;
    let payload;

    // ===============================
    // STEP 1: SEND RESET CODE
    // ===============================
    if (resetStep === 1) {
      payload = {
        email: forgotEmail.value
      };

      res = await fetch(`${API_BASE_URL}/password-reset/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log(data.errors)
      if (!res.ok) {
        showNotification(data.message || "Failed to send reset code", "error");
        return;
      }

      showNotification("Reset code sent to your email", "success");

      resetStep = 2;

      // Show code input field
      document.querySelector(".code-field").classList.remove("hidden");

      return;
    }

    // ===============================
    // STEP 2: VERIFY CODE
    // ===============================
    if (resetStep === 2) {
      payload = {
        email: forgotEmail.value,
        resetCode: forgotCode.value
      };

      res = await fetch(`${API_BASE_URL}/password-reset/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message || "Invalid reset code", "error");
        return;
      }

      showNotification("Code verified successfully", "success");

      resetStep = 3;

      // Show new password field
      document.querySelector(".new-password-field").classList.remove("hidden");

      return;
    }

    // ===============================
    // STEP 3: RESET PASSWORD
    // ===============================
    if (resetStep === 3) {
      payload = {
        email: forgotEmail.value,
        code: forgotCode.value,
        newPassword: forgotNewPassword.value
      };

      res = await fetch(`${API_BASE_URL}/password-reset/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message || "Password reset failed", "error");
        return;
      }

      showNotification("Password reset successful!", "success");

      setTimeout(() => {
        window.location.href = "signup.html";
      }, 1500);
    }

  } catch (err) {
    console.error("RESET ERROR:", err);
    showNotification("Network error. Try again.", "error");
  } finally {
    setLoading(btn, false);
  }
});




