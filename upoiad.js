// Title counter
const titleInput = document.getElementById("titleInput");
const titleCounter = document.getElementById("titleCounter");

titleInput.addEventListener("input", () => {
  titleCounter.textContent = ${titleInput.value.length}/100;
});

// Video upload preview
const videoInput = document.getElementById("videoInput");
const uploadText = document.getElementById("uploadText");
const uploadBtn = document.getElementById("uploadBtn");

videoInput.addEventListener("change", () => {
  if (videoInput.files.length > 0) {
    uploadText.textContent = videoInput.files[0].name;
  }
});

// Upload button action
uploadBtn.addEventListener("click", () => {
  if (!videoInput.files.length) {
    alert("Please select a video first!");
    return;
  }

  if (!titleInput.value.trim()) {
    alert("Please enter a video title!");
    return;
  }

  alert("Video details ready for upload ✅");
});