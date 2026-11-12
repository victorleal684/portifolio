// Menu mobile
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Ano automático no rodapé
document.querySelector("#year").textContent = new Date().getFullYear();

// Animações de entrada
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

// Carrossel de vídeos
const viewport = document.querySelector(".video-viewport");
const track = document.querySelector(".video-track");
const slides = [...document.querySelectorAll(".video-slide")];
const videos = [...document.querySelectorAll(".video-slide video")];
const prevButton = document.querySelector(".carousel-arrow.prev");
const nextButton = document.querySelector(".carousel-arrow.next");
const dots = [...document.querySelectorAll(".carousel-dot")];

let currentIndex = 0;

function updateCarousel() {
  if (!slides.length) return;

  // Para vídeos verticais e horizontais, a moldura usa a largura do slide atual.
  const activeSlide = slides[currentIndex];
  const slideWidth = Math.min(
    activeSlide.scrollWidth,
    window.innerWidth - (window.innerWidth <= 720 ? 40 : 180)
  );

  viewport.style.width = `${slideWidth}px`;
  slides.forEach(slide => {
    slide.style.width = `${slide.scrollWidth}px`;
  });

  track.style.transform = `translateX(-${activeSlide.offsetLeft}px)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === slides.length - 1;
  prevButton.style.opacity = currentIndex === 0 ? ".35" : "1";
  nextButton.style.opacity = currentIndex === slides.length - 1 ? ".35" : "1";
}

function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));

  videos.forEach((video, videoIndex) => {
    if (videoIndex !== currentIndex) video.pause();
  });

  updateCarousel();
}

prevButton.addEventListener("click", () => goToSlide(currentIndex - 1));
nextButton.addEventListener("click", () => goToSlide(currentIndex + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => goToSlide(index)));

videos.forEach(video => {
  video.addEventListener("loadedmetadata", updateCarousel);
  video.addEventListener("error", () => {
    // Mantém o espaço do vídeo reservado caso o arquivo ainda não tenha sido adicionado.
    updateCarousel();
  });
});

window.addEventListener("resize", updateCarousel);
updateCarousel();

// Navegação por teclado quando a seção do carrossel está visível
document.addEventListener("keydown", event => {
  const carousel = document.querySelector(".video-carousel");
  if (!carousel) return;
  const rect = carousel.getBoundingClientRect();
  const visible = rect.top < window.innerHeight && rect.bottom > 0;
  if (!visible || event.target.closest("input, textarea, video")) return;

  if (event.key === "ArrowLeft") goToSlide(currentIndex - 1);
  if (event.key === "ArrowRight") goToSlide(currentIndex + 1);
});
