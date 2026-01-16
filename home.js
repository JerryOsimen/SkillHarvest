const videoGrid = document.getElementById("videoGrid");

// Load uploaded videos
const videos = JSON.parse(localStorage.getItem("videos")) || [];

if (videos.length === 0) {
  videoGrid.innerHTML = `
    <p class="text-gray-500 col-span-full text-center">
      No videos uploaded yet
    </p>
  `;
}

videos.forEach((video, index) => {
  const card = document.createElement("a");
<<<<<<< HEAD
  const url = new URL("video.html", window.location.origin);
url.searchParams.set("title", video.title);
url.searchParams.set("desc", video.description);
url.searchParams.set("videoURL", video.videoURL);
card.href = url.toString();
=======
  card.href = `video.html?id=${index}`;
>>>>>>> parent of bebbcf6 (updated)
  card.className = "block";

  card.innerHTML = `
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <video 
        src="${video.videoURL}" 
        class="w-full h-40 object-cover"
        muted
      ></video>

      <div class="p-4">
        <h3 class="font-semibold text-lg">${video.title}</h3>
        <p class="text-sm text-gray-600">${video.description}</p>
      </div>
    </div>
  `;

  videoGrid.appendChild(card);
});

/* Sidebar */
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const links = sidebar.querySelectorAll("a");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});

links.forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full");
  });
});

/* Search */
const searchInput = document.getElementById("searchinput");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll("#videoGrid a");

  cards.forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(query)
      ? "block"
      : "none";
  });
});
