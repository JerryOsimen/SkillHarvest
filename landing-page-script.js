const slides = document.getElementById("slides");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const skipBtn = document.getElementById("skipBtn");

let currentIndex = 0;
const totalSlides = dots.length;

function updateSlider() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

 dots.forEach(dot => dot.classList.remove("bg-green-600"));
 dots.forEach(dot => dot.classList.add("bg-gray-400"));

 dots[ currentIndex].classList.remove("bg-gray-400");
 dots[ currentIndex].classList.add("bg-green-600");

 if (currentIndex === totalSlides - 1) {
    nextBtn.textContent = "Get Started";
  } else {
    nextBtn.textContent = "Next";
  }
}
// Next button click
nextBtn.addEventListener("click", () => {
  if (currentIndex === totalSlides - 1) {
    window.location.href = "signup.html";
  } else {
    currentIndex++;
    updateSlider();
  }
});
// Previous button click
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlider();
});

dots.forEach(dot => {
  dot.addEventListener("click", () => {
currentIndex = Number(dot.dataset.index);
updateSlider();
  });
});
// Skip button click
skipBtn.addEventListener("click", () => {
  window.location.href = "homepage.html"; 
});
