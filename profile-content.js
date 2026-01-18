// Get user data from localStorage
const user = JSON.parse(localStorage.getItem("skillHarvestUser"));
const date = user.DateOfBirth || user.dob;
const dob = new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
if (user) {
  const fields = {
    name: user.name,
    email: user.email,
    dob: dob,
    gender: user.gender,
    phone: user.phoneNumber
  };

  const displayNameEl = document.getElementById("display-name");
  if (displayNameEl) displayNameEl.textContent = user.name || "User";

  for (const [id, value] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "N/A";
  }
} else {
  const info = document.querySelector(".identity-card-container");
  if (info) info.innerHTML = "<p>No profile info available.</p>";
}
