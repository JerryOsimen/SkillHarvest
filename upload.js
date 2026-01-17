const videoInput = document.getElementById("videoInput");
const previewVideo = document.getElementById("previewVideo");

videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];
  if (!file) return;

  previewVideo.src = URL.createObjectURL(file);
  previewVideo.classList.remove("hidden");
});

const API_BASE_URL = "http://localhost:5000/api";

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const videoInput = document.getElementById("videoInput");
  const videoFile = videoInput.files[0];
  const title = document.getElementById("videoTitle").value.trim();
  const description = document.getElementById("videoDescription").value.trim();
  const tags = document.getElementById("videoTags").value.trim();
  const token = localStorage.getItem("token");

  if (!videoFile || !title || !description || !tags) {
    alert("Please fill all fields and select a video.");
    return;
  }

  if (!token) {
    alert("You must be logged in to upload a video.");
    window.location.href = "signup.html";
    return;
  }

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("tags", tags);

  try {
    const uploadBtn = document.getElementById("uploadBtn");
    uploadBtn.textContent = "Uploading...";
    uploadBtn.disabled = true;

    const response = await fetch(`${API_BASE_URL}/video/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert("Video uploaded successfully!");
      window.location.href = "Homepage.html";
    } else {
      alert(data.message || "Upload failed. Please ensure the video is between 2-5 minutes.");
      uploadBtn.textContent = "Upload";
      uploadBtn.disabled = false;
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("An error occurred during upload. Please try again.");
    document.getElementById("uploadBtn").textContent = "Upload";
    document.getElementById("uploadBtn").disabled = false;
  }
});
