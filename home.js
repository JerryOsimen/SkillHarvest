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
