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

/* =======================
   SIGN UP
======================= */
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = {
    name: this[0].value,
    email: this[1].value,
    dob: this[2].value,
    gender: this[3].value,
    phone: this[4].value,
    password: this[5].value,
    experience: this[6].value,
    location: this[7].value,
    farmType: this[8].value,
    cac: this[9].value
  };

  // save user (temporary)
  localStorage.setItem("skillHarvestUser", JSON.stringify(user));

  alert("Account created successfully!");
  window.location.href = "Homepage.html";
});

/* =======================
   LOGIN
======================= */
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const storedUser = JSON.parse(
    localStorage.getItem("skillHarvestUser")
  );

  if (!storedUser) {
    alert("No account found. Please sign up.");
    return;
  }

  const name = this[0].value;
  const phone = this[1].value;
  const password = this[2].value;

  if (
    name === storedUser.name &&
    phone === storedUser.phone &&
    password === storedUser.password
  ) {
    alert("Login successful!");
    window.location.href = "Homepage.html";
  } else {
    alert("Incorrect login details");
  }
});
