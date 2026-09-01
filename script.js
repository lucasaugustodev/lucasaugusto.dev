const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js");

const revealItems = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const header = document.querySelector(".site-header");
const setHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");
menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  menuButton?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
});

const phrases = [
  "infraestrutura que escala",
  "agentes que executam",
  "jogos que dão vontade de ficar",
];
const rotatingText = document.querySelector("#rotating-text");

if (rotatingText && !reduceMotion) {
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let direction = -1;
  let pause = 1450;

  const typeLoop = () => {
    const phrase = phrases[phraseIndex];
    if (pause > 0) {
      pause -= 75;
      window.setTimeout(typeLoop, 75);
      return;
    }

    charIndex += direction;
    rotatingText.textContent = phrase.slice(0, Math.max(0, charIndex));

    if (direction === -1 && charIndex <= 0) {
      direction = 1;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      pause = 240;
    } else if (direction === 1 && charIndex >= phrases[phraseIndex].length) {
      direction = -1;
      pause = 1850;
    }

    window.setTimeout(typeLoop, direction === 1 ? 46 : 27);
  };

  window.setTimeout(typeLoop, 1600);
}

const countNodes = document.querySelectorAll("[data-count]");
const animateCount = (node) => {
  const target = Number(node.dataset.count || 0);
  const duration = 1050;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    node.textContent = String(Math.round(target * eased)).padStart(target > 9 ? 2 : 1, "0");
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (reduceMotion || !("IntersectionObserver" in window)) {
  countNodes.forEach((node) => (node.textContent = node.dataset.count));
} else {
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  countNodes.forEach((node) => countObserver.observe(node));
}

document.querySelectorAll(".spotlight-card .case__media").forEach((media) => {
  media.addEventListener("pointermove", (event) => {
    const rect = media.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    media.style.setProperty("--glow-x", `${x}%`);
    media.style.setProperty("--glow-y", `${y}%`);
  });
});

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (finePointer && cursorDot && cursorRing && !reduceMotion) {
  let pointerX = -100;
  let pointerY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorDot.style.left = `${pointerX}px`;
    cursorDot.style.top = `${pointerY}px`;
  }, { passive: true });

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("pointerenter", () => cursorRing.classList.add("is-hovering"));
    element.addEventListener("pointerleave", () => cursorRing.classList.remove("is-hovering"));
  });

  const drawCursor = () => {
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(drawCursor);
  };
  requestAnimationFrame(drawCursor);

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.1;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

const canvas = document.querySelector("#hero-canvas");
const hero = document.querySelector(".hero");

if (canvas && hero && !reduceMotion) {
  const context = canvas.getContext("2d");
  const pointer = { x: 0, y: 0, active: false };
  let particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const resizeCanvas = () => {
    const rect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const desired = Math.max(24, Math.min(72, Math.round(width / 21)));
    particles = Array.from({ length: desired }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: index % 8 === 0 ? 1.35 : 0.7,
    }));
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  }, { passive: true });
  hero.addEventListener("pointerleave", () => (pointer.active = false));

  const drawCanvas = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 120 && distance > 1) {
          particle.x -= (dx / distance) * 0.16;
          particle.y -= (dy / distance) * 0.16;
        }
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = index % 8 === 0 ? "rgba(67,255,123,.55)" : "rgba(166,255,192,.22)";
      context.fill();

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared > 8200) continue;
        const opacity = (1 - distanceSquared / 8200) * 0.11;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(67,255,123,${opacity})`;
        context.lineWidth = 0.6;
        context.stroke();
      }
    });

    frame = requestAnimationFrame(drawCanvas);
  };

  const observer = new ResizeObserver(resizeCanvas);
  observer.observe(hero);
  resizeCanvas();
  drawCanvas();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
    } else {
      drawCanvas();
    }
  });
}

const localTime = document.querySelector("#local-time");
const updateTime = () => {
  if (!localTime) return;
  localTime.textContent = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date()) + " BRT";
};
updateTime();
window.setInterval(updateTime, 30_000);

document.querySelector("#year").textContent = new Date().getFullYear();
