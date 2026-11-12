
// Ano do rodapé
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
  const viewport = carousel.querySelector(".video-viewport");
  const prev = carousel.querySelector(".carousel-arrow.prev");
  const next = carousel.querySelector(".carousel-arrow.next");
  const dots = carousel.querySelector(".carousel-dots");

  const originalSlides = [...track.querySelectorAll(".video-slide")];

  if (
    !track ||
    !viewport ||
    !prev ||
    !next ||
    !dots ||
    originalSlides.length === 0
  ) {
    console.warn("Estrutura do carrossel incompleta.");
    return;
  }

  const total = originalSlides.length;

  // Cria cópias do último e do primeiro vídeo
  const lastClone = originalSlides[total - 1].cloneNode(true);
  const firstClone = originalSlides[0].cloneNode(true);

  lastClone.classList.add("carousel-clone");
  firstClone.classList.add("carousel-clone");

  lastClone.setAttribute("aria-hidden", "true");
  firstClone.setAttribute("aria-hidden", "true");

  track.insertBefore(lastClone, originalSlides[0]);
  track.appendChild(firstClone);

  // Lista incluindo as cópias
  const slides = [...track.querySelectorAll(".video-slide")];

  // Começa no primeiro vídeo real
  let index = 0;
  let position = 1;

  const transition = "transform .55s cubic-bezier(.22,.61,.36,1)";

  // Cria os indicadores
  dots.innerHTML = "";

  originalSlides.forEach((_, i) => {
    const dot = document.createElement("button");

    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir para o vídeo ${i + 1}`);

    dot.addEventListener("click", () => goTo(i));

    dots.appendChild(dot);
  });

  // Pausa o vídeo anterior
  function pauseSlide(slide) {
    if (!slide) return;

    const video = slide.querySelector("video");

    if (video) video.pause();

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

  // Centraliza o slide atual
  function updatePosition(animate = true) {
    const slide = slides[position];

    if (!slide) return;

    track.style.transition = animate ? transition : "none";

    const offset =
      viewport.clientWidth / 2 -
      slide.offsetLeft -
      slide.offsetWidth / 2;

    track.style.transform = `translateX(${offset}px)`;

    slides.forEach((item, i) => {
      item.classList.toggle("active", i === position);
    });

    [...dots.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // Navegação
  function goTo(target) {
    pauseSlide(slides[position]);

    if (target >= total) {
      index = 0;
      position = total + 1;
    } else if (target < 0) {
      index = total - 1;
      position = 0;
    } else {
      index = target;
      position = target + 1;
    }

    updatePosition(true);
  }

  // Corrige o salto das cópias ao chegar nas extremidades
  track.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    if (position === 0) {
      position = total;
      updatePosition(false);
    } else if (position === total + 1) {
      position = 1;
      updatePosition(false);
    }

    requestAnimationFrame(() => {
      track.style.transition = transition;
    });
  });

  // Setas
  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));

  // Deslize nas laterais dos vídeos
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

  // Reposiciona ao alterar o tamanho da tela
  window.addEventListener("resize", () => {
    updatePosition(false);
  });

  // Posição inicial
  updatePosition(false);
});
