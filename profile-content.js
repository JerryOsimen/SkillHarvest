// Get user data from localStorage
const user = JSON.parse(localStorage.getItem("userProfile"));

if (user) {
  document.getElementById("name").textContent = user.name || "";
  document.getElementById("email").textContent = user.email || "";
  document.getElementById("cac").textContent = user.cac || "";
  document.getElementById("dob").textContent = user.dob || "";
  document.getElementById("gender").textContent = user.gender || "";
  document.getElementById("phone").textContent = user.phone || "";
} else {
  document.querySelector(".profile-info").innerHTML = "<p>No profile info available.</p>";
}
