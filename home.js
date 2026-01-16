const videoGrid = document.getElementById("videoGrid");
const videoGrid2 = document.getElementById("videoGrid2");


// TEMP data (later replaced by backend)
const videos = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];


 function createLinks(video,grid){
   const link = document.createElement("a");

  link.href = `video.html?id=${video.id}`;
  link.className = "block";

  // 👇 teammate's card component (placeholder for now)
  link.innerHTML = `
    <div class="bg-white h-60 rounded-xl shadow flex items-center justify-center">
      <span class="text-gray-500">Video ${video.id}</span>
    </div>
  `;
  grid.appendChild(link);
 }

videos.forEach(video => {
  createLinks(video,videoGrid)
});


videos.forEach(video => {
  createLinks(video,videoGrid2)
});

//side bar js
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeBtn');
const menuItems = document.getElementById('menuItems');

//toggle sidebar
menuBtn.addEventListener('click', () => {
    sideMenu.classList.toggle('hidden');
});


// SIDEBAR
closeSidebar.addEventListener('click', () => {
    sideMenu.classList.add('hidden');
});


// search by keyword feature
const searchInput = document.getElementById("searchinput");

searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  const query = searchInput.value.toLowerCase();

  const cards = document.querySelectorAll(".videoGrid a");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});


