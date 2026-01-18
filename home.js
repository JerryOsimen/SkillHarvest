const API_BASE_URL = "https://skillharvest-backend.onrender.com/api";
const videoGrid = document.getElementById("videoGrid");
const trendingGrid = document.getElementById("trendingGrid");
const trendingSection = document.getElementById("trendingSection");

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const limit = 8;

/**
 * Renders a single video card
 */
function renderVideoCard(video) {
  const card = document.createElement("a");

  // Set up video link using relative path to avoid 404 on different project structures
  const url = new URL("video.html", window.location.href);
  url.searchParams.set("id", video.id);
  url.searchParams.set("title", video.title);
  url.searchParams.set("desc", video.description);
  url.searchParams.set("videoURL", video.videoUrl);
  url.searchParams.set("authorId", video.userId);
  url.searchParams.set("authorName", video.user?.name || "Farmer");
  card.href = url.href;

  card.className = "block bg-white rounded-xl shadow overflow-hidden transform transition-transform hover:scale-[1.02]";

  card.innerHTML = `
    <div class="relative pb-[56.25%]">
      <video 
        src="${video.videoUrl}" 
        class="absolute top-0 left-0 w-full h-full object-cover"
        muted
        onmouseover="this.play()"
        onmouseout="this.pause(); this.currentTime = 0;"
      ></video>
      <div class="absolute bottom-2 right-2 flex gap-2">
        <div class="bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
          <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          ${video._count?.likes || 0}
        </div>
        <div class="bg-black/60 text-white text-[10px] px-2 py-1 rounded">
          ${video.views || 0} views
        </div>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-semibold text-lg line-clamp-1">${video.title}</h3>
      <p class="text-sm text-gray-600 line-clamp-2 mt-1">${video.description}</p>
      <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>By ${video.user?.name || "Farmer"}</span>
        <span>${new Date(video.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  `;
  return card;
}

/**
 * Fetches and renders trending videos
 */
async function fetchTrendingVideos() {
  try {
    const response = await fetch(`${API_BASE_URL}/video/trending`);
    const data = await response.json();

    if (response.ok && data.success && data.count > 0) {
      trendingSection.classList.remove("hidden");
      trendingGrid.innerHTML = "";
      data.videos.forEach(video => {
        trendingGrid.appendChild(renderVideoCard(video));
      });
    } else if (!response.ok) {
      showNotification(data.message || "Failed to load trending videos.", "error");
    }
  } catch (error) {
    console.error("Error fetching trending videos:", error);
    showNotification("Failed to load trending videos.", "error");
  }
}

/**
 * Fetches and renders global videos with pagination
 */
async function fetchGlobalVideos(page = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/video?page=${page}&limit=${limit}`);
    const data = await response.json();

    if (response.ok && data.success) {
      videoGrid.innerHTML = "";

      if (data.videos.length === 0) {
        videoGrid.innerHTML = `
          <p class="text-gray-500 col-span-full text-center py-10">
            No videos found. Check back later!
          </p>
        `;
      } else {
        data.videos.forEach(video => {
          videoGrid.appendChild(renderVideoCard(video));
        });
      }

      // Update pagination state
      currentPage = data.page;
      pageInfo.textContent = `Page ${currentPage} of ${data.totalPages || 1}`;
      prevPageBtn.disabled = currentPage <= 1;
      nextPageBtn.disabled = currentPage >= (data.totalPages || 1);
    } else {
      console.error("Failed to fetch videos:", data.message);
      showNotification(data.message || "Failed to load videos.", "error");
    }
  } catch (error) {
    console.error("Error fetching global videos:", error);
    showNotification("Failed to load videos. Is the backend running?", "error");
    videoGrid.innerHTML = `<p class="text-red-500 col-span-full text-center">Failed to load videos. Is the backend running?</p>`;
  }
}

// Initial Load
fetchTrendingVideos();
fetchGlobalVideos(currentPage);

// Pagination Listeners
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) fetchGlobalVideos(currentPage - 1);
});

nextPageBtn.addEventListener("click", () => {
  fetchGlobalVideos(currentPage + 1);
});

/* Sidebar */
const sideMenu = document.getElementById('sidebar');
const menuBtn = document.getElementById("menuBtn");
const links = sidebar.querySelectorAll("a");

const closeSidebar = document.getElementById('closeBtn');
const menuItems = document.getElementById('menuItems');

  closeSidebar.addEventListener('click', () => {
        sideMenu.classList.add('hidden');
    });

    menuBtn.addEventListener('click', () => {
        sideMenu.classList.toggle('hidden');
    });


/* Search */
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll("main a.block");

  cards.forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(query)
      ? "block"
      : "none";
  });
});
