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

const signupName = document.querySelector(".signupName");
const signupEmail = document.querySelector(".signupEmail");
const signupDob = document.querySelector(".dob");
const signupGender = document.querySelector(".gender");
const signupPhone = document.querySelector(".phone");
const signupPassword = document.querySelector(".password");
const signupExperience = document.querySelector(".experience");
const signupLocation = document.querySelector(".farmLocation");
const signupFarmType = document.querySelector(".farmType");

/* =======================
   SIGN UP
======================= */
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearErrors();

  const user = {
    name: signupName.value,
    email: signupEmail.value,
    DateOfBirth: signupDob.value, // Backend expects DateOfBirth
    gender: signupGender.value,
    phoneNumber: signupPhone.value, // Backend expects phoneNumber
    password: signupPassword.value,
    experience: signupExperience.value,
    farmLocation: signupLocation.value, // Backend expects farmLocation
    farmType: signupFarmType.value, // Backend expects farmType
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification("User registered successfully!", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
      window.location.href = "Homepage.html";
    } else {
      if (response.status === 400 && data.errors) {
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
      } else if (response.status === 409) {
        displayError("signup", "email", data.message);
      } else {
        showNotification(data.message || "Registration failed.", "error");
      }
    }
  } catch (error) {
    console.error("Signup error:", error);
    showNotification("An error occurred during signup.", "error");
  }
});

/* =======================
    LOGIN
======================= */
const loginEmail = document.querySelector(".loginEmail");
const loginPassword = document.querySelector(".loginPassword");
const loginName = document.querySelector(".loginName");
const loginPhone = document.querySelector(".loginPhone");

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearErrors();

  const credentials = {
    email: loginEmail.value,
    password: loginPassword.value,
    name: loginName.value,
    phoneNumber: loginPhone.value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification("Login successful!", "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
      window.location.href = "Homepage.html";
    } else {
      if (response.status === 401) {
        displayError("login", "general", data.message);
      } else if (response.status === 400 && data.errors) {
        data.errors.forEach(msg => {
          if (msg.toLowerCase().includes("email")) displayError("login", "email", msg);
          else if (msg.toLowerCase().includes("password")) displayError("login", "password", msg);
          else if (msg.toLowerCase().includes("name")) displayError("login", "name", msg);
          else if (msg.toLowerCase().includes("phone")) displayError("login", "phone", msg);
        });
      } else {
        displayError("login", "general", data.message || "Login failed.");
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    displayError("login", "general", "An error occurred during login.");
  }
});

/* =======================
    FORGOT PASSWORD
======================= */
document.getElementById("forgotForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearErrors();

  const email = document.querySelector(".forgotName").value;

  if(signupEmail.value !== email){
    return
  }
    const newPassword = document.getElementById("resetPassword").value;


  showNotification("Password reset functionality is being processed. Please check console for errors if any occur.", "info");
});
