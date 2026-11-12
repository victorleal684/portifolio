
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((element) => observer.observe(element));

// Selected videos carousel

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".video-track");
  const slides = [...carousel.querySelectorAll(".video-slide")];
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");
  const dots = carousel.querySelector(".carousel-dots");

  let index = 0;
  let startX = 0;
  let currentX = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to video ${i + 1}`);
    dot.onclick = () => goTo(i);
    dots.appendChild(dot);
  });

  function pauseSlide(slide) {
    // Pause local MP4 videos
    const video = slide.querySelector("video");
    if (video) video.pause();

    // Pause YouTube videos
    const iframe = slide.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: []
        }),
        "*"
      );
    }
  }

  function goTo(i) {
    const previousSlide = slides[index];

    // Pause the previous video before changing slides
    if (previousSlide) pauseSlide(previousSlide);

    index = (i + slides.length) % slides.length;

    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, n) => {
      slide.classList.toggle("active", n === index);
    });

    [...dots.children].forEach((dot, n) => {
      dot.classList.toggle("active", n === index);
    });
  }

  prev.onclick = () => goTo(index - 1);
  next.onclick = () => goTo(index + 1);

  const viewport = carousel.querySelector(".video-viewport");

  viewport.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchmove",
    (e) => {
      currentX = e.touches[0].clientX;
    },
    { passive: true }
  );

  viewport.addEventListener("touchend", () => {
    const distance = currentX - startX;

    if (Math.abs(distance) > 50) {
      goTo(distance < 0 ? index + 1 : index - 1);
    }
  });
});
