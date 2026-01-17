function showForm(form) {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("forgotForm").classList.add("hidden");

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
const API_BASE_URL = "http://localhost:5000/api";

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
    console.log("Sending signup data:", user);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log("Signup response data:", data);

    if (response.ok) {
      alert("User registered successfully!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
      window.location.href = "Homepage.html";
    } else {
      console.error("Signup failed:", data);
      alert(data.message || "Registration failed. Check console for details.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("An error occurred during signup. Please try again.");
  }
});

/* =======================
    LOGIN
======================= */
const loginName = document.querySelector(".loginName");
const loginEmail = document.querySelector(".loginEmail");
const loginPhone = document.querySelector(".loginPhone");
const loginPassword = document.querySelector(".loginPassword");

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const credentials = {
    name: loginName.value,
    email: loginEmail.value,
    phoneNumber: loginPhone.value,
    password: loginPassword.value,
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
      alert("Login successful!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("skillHarvestUser", JSON.stringify(data.user));
      window.location.href = "Homepage.html";
    } else {
      alert(data.message || "Invalid login details");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login. Please try again.");
  }
});
