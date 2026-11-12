
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

    const slide = slides[index];

const offset =
  viewport.clientWidth / 2 -
  slide.offsetLeft -
  slide.offsetWidth / 2;

track.style.transform = `translateX(${offset}px)`;const slide = slides[index];

const offset =
  viewport.clientWidth / 2 -
  slide.offsetLeft -
  slide.offsetWidth / 2;

track.style.transform = `translateX(${offset}px)`;

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
  
  // Navegação por deslize no celular
  slides.forEach((slide) => {
    const videoWrap = slide.querySelector(".video-wrap");
    if (!videoWrap) return;

    ["left", "right"].forEach((side) => {
      const zone = document.createElement("div");
      zone.className = `swipe-zone ${side}`;
      zone.setAttribute("aria-hidden", "true");

      let startX = 0;
      let startY = 0;

      zone.addEventListener("pointerdown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        zone.setPointerCapture(e.pointerId);
      });

      zone.addEventListener("pointerup", (e) => {
        const distanceX = e.clientX - startX;
        const distanceY = e.clientY - startY;

        if (
          Math.abs(distanceX) > 45 &&
          Math.abs(distanceX) > Math.abs(distanceY)
        ) {
          goTo(distanceX < 0 ? index + 1 : index - 1);
        }
      });

      videoWrap.appendChild(zone);
    });
  });


  // Estado inicial
  goTo(0);
});

window.addEventListener("resize", () => {
  const slide = slides[index];

  const offset =
    viewport.clientWidth / 2 -
    slide.offsetLeft -
    slide.offsetWidth / 2;

  track.style.transform = `translateX(${offset}px)`;
});
