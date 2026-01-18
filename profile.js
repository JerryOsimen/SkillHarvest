const API_BASE_URL = "https://skillharvest-backend.onrender.com/api";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("skillHarvestUser"));

// DOM Elements
const welcomeUser = document.getElementById("welcomeUser");
const followersCount = document.getElementById("followersCount");
const followingCount = document.getElementById("followingCount");
const myVideosGrid = document.getElementById("myVideosGrid");
const bookmarksGrid = document.getElementById("bookmarksGrid");
const historyGrid = document.getElementById("historyGrid");
const likesGrid = document.getElementById("likesGrid");

/**
 * Renders a single video card with profile-specific styling
 */
function renderVideoCard(video) {
  const card = document.createElement("a");

  // Set up video link
  const url = new URL("video.html", window.location.href);
  url.searchParams.set("id", video.id);
  url.searchParams.set("title", video.title);
  url.searchParams.set("desc", video.description);
  url.searchParams.set("videoURL", video.videoUrl);
  card.href = url.href;

  card.className = "video-card premium-card";

  card.innerHTML = `
    <div class="video-thumbnail-container">
      <video 
        src="${video.videoUrl}" 
        class="video-preview"
        muted
        playsinline
      ></video>
      <div class="video-overlay">
        <span class="video-views-badge">
           <i class="eye-icon"></i> ${video.views || 0}
        </span>
      </div>
    </div>
    <div class="video-details-container">
      <h3 class="video-title-text">${video.title}</h3>
      <div class="video-meta-footer">
        <span class="video-date">${new Date(video.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
    </div>
  `;

  // Hover to play
  const videoEl = card.querySelector('video');
  card.addEventListener('mouseenter', () => {
    videoEl.play().catch(e => console.log("Auto-play blocked"));
    card.classList.add('playing');
  });
  card.addEventListener('mouseleave', () => {
    videoEl.pause();
    videoEl.currentTime = 0;
    card.classList.remove('playing');
  });

  return card;
}

/**
 * Fetch and display user profile stats
 */
async function fetchProfileStats() {
  if (!token || !user) return;

  try {
    welcomeUser.textContent = `WELCOME, ${user.name.toUpperCase()}`;

    // Fetch follower counts from new consolidated endpoint
    const response = await fetch(`${API_BASE_URL}/follow/${user.id}/stats`);
    const data = await response.json();

    if (response.ok && data.success) {
      followersCount.textContent = data.followersCount || 0;
      followingCount.textContent = data.followingCount || 0;
    }
  } catch (error) {
    console.error("Error fetching profile stats:", error);
  }
}

/**
 * Fetch and display user's own videos
 */
async function fetchMyVideos() {
  if (!token || !user) return;

  try {
    const response = await fetch(`${API_BASE_URL}/video/user/${user.id}`);
    const data = await response.json();

    if (response.ok && data.success) {
      myVideosGrid.innerHTML = "";
      if (data.videos.length === 0) {
        myVideosGrid.innerHTML = "<p class='empty'>No videos uploaded yet</p>";
      } else {
        data.videos.forEach(video => {
          myVideosGrid.appendChild(renderVideoCard(video));
        });
      }
    }
  } catch (error) {
    console.error("Error fetching my videos:", error);
    myVideosGrid.innerHTML = "<p class='empty'>Failed to load videos</p>";
  }
}

/**
 * Fetch and display user's bookmarks
 */
async function fetchBookmarks() {
  if (!token) {
    bookmarksGrid.innerHTML = "<p class='empty'>Login to see bookmarks</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();

    if (response.ok && data.success) {
      bookmarksGrid.innerHTML = "";
      if (data.bookmarks.length === 0) {
        bookmarksGrid.innerHTML = "<p class='empty'>No bookmarks yet</p>";
      } else {
        data.bookmarks.forEach(entry => {
          // entry.video contains the video data
          bookmarksGrid.appendChild(renderVideoCard(entry.video));
        });
      }
    }
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    bookmarksGrid.innerHTML = "<p class='empty'>Failed to load bookmarks</p>";
  }
}

/**
 * Fetch and display user's liked videos from backend
 */
async function fetchLikedVideos() {
  if (!token) {
    likesGrid.innerHTML = "<p class='empty'>Login to see likes</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/video/liked`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();

    if (response.ok && data.success) {
      likesGrid.innerHTML = "";
      if (data.videos.length === 0) {
        likesGrid.innerHTML = "<p class='empty'>No liked videos yet</p>";
      } else {
        data.videos.forEach(video => {
          likesGrid.appendChild(renderVideoCard(video));
        });
      }
    }
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    likesGrid.innerHTML = "<p class='empty'>Failed to load liked videos</p>";
  }
}
function displayLocalVideos(key, containerId) {
  const videos = JSON.parse(localStorage.getItem(key)) || [];
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  if (videos.length === 0) {
    container.innerHTML = "<p class='empty'>No videos yet</p>";
    return;
  }

  videos.forEach(video => {
    // History/Likes might have different structure from API, but we adapt
    container.appendChild(renderVideoCard({
      id: video.id,
      title: video.title,
      videoUrl: video.videoUrl || video.url,
      description: video.description || "",
      views: video.views || 0,
      createdAt: video.createdAt || new Date()
    }));
  });
}

// Check login status
if (!token || !user) {
  showNotification("Please login to view your full profile.", "info");
  // Redirect after a short delay
  setTimeout(() => {
    // window.location.href = "signup.html";
  }, 3000);
}

// Initial Load
fetchProfileStats();
fetchMyVideos();
fetchBookmarks();
fetchLikedVideos();
displayLocalVideos("history", "historyGrid");
