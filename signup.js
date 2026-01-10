function showForm(form) {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  if (form === "signup") {
    document.getElementById("signupForm").classList.remove("hidden");
  } else {
    document.getElementById("loginForm").classList.remove("hidden");
  }
}