function showForm(form) {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.add("hidden");

  if (form === "signup") {
    document.getElementById("signupForm").classList.remove("hidden");
  } else {
    document.getElementById("loginForm").classList.remove("hidden");
  }
}
document.getElementById("signupForm").addEventListener("submit", function(e) {
  e.preventDefault(); // stop page reload
  alert("Sign-up successful!");
  window.location.href = "home.html";
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Login successful!");
  window.location.href = "home.html";
});
