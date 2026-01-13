const slides = document.getElementById("slides");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 0;
const totalSlides = dots.length;

function updateSlider() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

 dots.forEach(dot => dot.classList.remove("bg-green-600"));
 dots.forEach(dot => dot.classList.add("bg-gray-400"));

 dots[ currentIndex].classList.remove("bg-gray-400");
 dots[ currentIndex].classList.add("bg-green-600");
}

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
});

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
