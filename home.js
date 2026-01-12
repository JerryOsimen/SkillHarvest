function saveHistory(video) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(video);
  localStorage.setItem("history", JSON.stringify(history));
}

function saveLiked(video) {
  let likes = JSON.parse(localStorage.getItem("likes")) || [];
  likes.push(video);
  localStorage.setItem("likes", JSON.stringify(likes));
}


Example video object:

js
{
  title: "HTML Tutorial",
  thumbnail: "thumb1.jpg"
}
