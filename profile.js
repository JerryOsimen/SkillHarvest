function displayVideos(key, containerId) {
  const videos = JSON.parse(localStorage.getItem(key)) || [];
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  if (videos.length === 0) {
    container.innerHTML = "<p class='empty'>No videos yet</p>";
    return;
  }

  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}">
      <div class="video-info">
        <div class="video-title">${video.title}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

displayVideos("history", "historyGrid");
displayVideos("likes", "likesGrid");
