const videoGrid = document.getElementById("videoGrid");

// TEMP data (later replaced by backend)
const videos = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];

videos.forEach(video => {
  const link = document.createElement("a");

  link.href = `video.html?id=${video.id}`;
  link.className = "block";

  // 👇 teammate's card component (placeholder for now)
  link.innerHTML = `
    <div class="bg-white h-60 rounded-xl shadow flex items-center justify-center">
      <span class="text-gray-500">Video ${video.id}</span>
    </div>
  `;

  videoGrid.appendChild(link);
});
//side bar js
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const links = sidebar.querySelectorAll("a");
//toggle sidebar
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});
//close sidebar when link is clicked
links.forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
  });
});
// search by keyword feature
const searchInput = document.getElementById("searchinput");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const cards = document.querySelectorAll("#videoGrid a");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});


