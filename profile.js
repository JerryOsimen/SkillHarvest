function displayVideos(key, containerId) {
  const videos = JSON.parse(localStorage.getItem(key)) || [];
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  videos.forEach((video) => {
    const div = document.createElement("div");
    div.className = "video-item";

    div.innerHTML = `
      <img src="${video.thumbnail}" style="width:100%">
      <p>${video.title}</p>
    `;

    container.appendChild(div);
  });
}

displayVideos("history", "historyGrid");
displayVideos("likes", "likesGrid");
