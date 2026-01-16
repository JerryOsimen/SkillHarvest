const videoInput = document.getElementById("videoInput");
const previewVideo = document.getElementById("previewVideo");

videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];
  if (!file) return;

  previewVideo.src = URL.createObjectURL(file);
  previewVideo.classList.remove("hidden");
});

document.querySelectorAll(".btn").forEach(but=>{
  but.addEventListener("click", () => {
  const videoFile = videoInput.files[0];
  const title = document.getElementById("videoTitle").value.trim();
  const description = document.getElementById("videoDescription").value.trim();

  if (!videoFile || !title || !description) {
    alert("Please fill all fields and select a video.");
    return;
  }

const videoData = {
  id: Date.now().toString(),
  title,
  description,
  src: URL.createObjectURL(videoFile), // ✅ SAME KEY AS video.html
  author: "You",
  comments: [],
  isTrending: false,
  likes: 0,
  location: "Unknown",
  views: "0",
  date: "Just now",
  isPlaying: false
};



  const videos = JSON.parse(localStorage.getItem("videos")) || [];
  videos.push(videoData);
  localStorage.setItem("videos", JSON.stringify(videos));

  alert("Video uploaded successfully!");
  window.location.href = "homepage.html";
});
})