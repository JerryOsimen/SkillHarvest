// Elements
const videoInput = document.getElementById("videoInput");
const previewVideo = document.getElementById("previewVideo");
const uploadBtn = document.getElementById("uploadBtn");
const videoTitle = document.getElementById("videoTitle");
const videoDescription = document.getElementById("videoDescription");

// Show preview when a video is selected
videoInput.addEventListener("change", () => {
  const file = videoInput.files[0];
  if (!file) return;
  previewVideo.src = URL.createObjectURL(file);
  previewVideo.classList.remove("hidden");
});

// Upload button click
uploadBtn.addEventListener("click", async () => {
  const file = videoInput.files[0];
  const title = videoTitle.value.trim();
  const description = videoDescription.value.trim();

  if (!file || !title || !description) {
    alert("Please provide a video, title, and description.");
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.innerText = "Uploading...";

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset"); // Your Cloudinary preset

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/di8aoioek/video/upload", // Your Cloudinary cloud name
      { method: "POST", body: formData }
    );

    const data = await response.json();
    const videoURL = data.secure_url;

    // Save uploaded video info in localStorage
    const videos = JSON.parse(localStorage.getItem("videos")) || [];
    videos.push({ title, description, videoURL });
    localStorage.setItem("videos", JSON.stringify(videos));

    // Redirect to homepage after upload
    window.location.href = "Homepage.html";  // change this path if your home page has a different name

  } catch (err) {
    console.error(err);
    alert("Upload failed. Check Cloudinary settings or internet connection.");
    uploadBtn.disabled = false;
    uploadBtn.innerText = "Upload";
  }
});
