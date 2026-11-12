
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Menu mobile
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
  });
});

// Animações de entrada
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("visible"));
}

// Carrossel de vídeos
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".video-track");
  const slides = [...carousel.querySelectorAll(".video-slide")];
  const prev = carousel.querySelector(".carousel-arrow.prev");
  const next = carousel.querySelector(".carousel-arrow.next");
  const dots = carousel.querySelector(".carousel-dots");
  const viewport = carousel.querySelector(".video-viewport");

  if (!track || !slides.length || !prev || !next || !dots || !viewport) {
    console.warn("Estrutura do carrossel incompleta.");
    return;
  }

  let index = 0;
  let startX = 0;
  let currentX = 0;

  // Cria os indicadores
  dots.innerHTML = "";

  slides.forEach((_, i) => {
    const dot = document.createElement("button");

    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para o vídeo ${i + 1}`);

    dot.addEventListener("click", () => goTo(i));

    dots.appendChild(dot);
  });

  // Pausa o vídeo do slide anterior
  function pauseSlide(slide) {
    const video = slide.querySelector("video");

    if (video) {
      video.pause();
    }

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

  // Atualiza o carrossel
  function goTo(i) {
    if (slides[index]) {
      pauseSlide(slides[index]);
    }

    index = (i + slides.length) % slides.length;

    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, n) => {
      slide.classList.toggle("active", n === index);
    });

    [...dots.children].forEach((dot, n) => {
      dot.classList.toggle("active", n === index);
    });
  }

  // Setas
  prev.addEventListener("click", () => {
    goTo(index - 1);
  });

  next.addEventListener("click", () => {
    goTo(index + 1);
  });

  // Navegação por toque no celular
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

  // Estado inicial
  goTo(0);
});
