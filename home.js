const videoGrid = document.getElementById("videoGrid");

// Load uploaded videos from localStorage
const videos = JSON.parse(localStorage.getItem("videos")) || [];

// Show message if no videos
if (videos.length === 0) {
  videoGrid.innerHTML = `<p class="text-gray-500 col-span-full text-center">No videos uploaded yet</p>`;
}

// Create video cards dynamically
videos.forEach((video, index) => {
  const card = document.createElement("a");
  card.href = `video.html?id=${index}`; // pass index to video page
  card.className = "block";

  card.innerHTML = `
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <video src="${video.videoURL}" class="w-full h-40 object-cover" muted></video>
      <div class="p-4">
        <h3 class="font-semibold text-lg">${video.title}</h3>
        <p class="text-sm text-gray-600">${video.description}</p>
      </div>
    </div>
  `;

  videoGrid.appendChild(card);
});
