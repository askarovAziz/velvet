// script.js
document.addEventListener("DOMContentLoaded", () => {
  //
  // 0) Theme toggle (sun/moon icons)
  //
// Theme toggle standalone
// theme-toggle.js (или вставить в конец script.js, но вынести в отдельную функцию)
(function () {
  const themeBtn = document.getElementById("themeToggle");
  const iconPath = document.getElementById("iconPath");
  if (!themeBtn || !iconPath) return;

  const html = document.documentElement;
  const sunD = "M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M12 8a4 4 0 100 8 4 4 0 000-8z";
  const moonD = "M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z";

  // Вычисляем текущую тему: из localStorage или system preference
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved === "dark" || (!saved && !saved && prefersDark); // если нет сохранённой, смотрим системную

  // Применяем начальную тему
  if (isDark) {
    html.classList.add("dark");
    iconPath.setAttribute("d", sunD); // показываем солнце, чтобы кликом можно было переключить на light
  } else {
    html.classList.remove("dark");
    iconPath.setAttribute("d", moonD);
  }

  themeBtn.addEventListener("click", () => {
    const nowDark = html.classList.toggle("dark");
    localStorage.setItem("theme", nowDark ? "dark" : "light");
    iconPath.setAttribute("d", nowDark ? sunD : moonD);
  });
})();



  //
  // 1) Hero Swiper
  //
  if (typeof Swiper !== "undefined") {
    new Swiper(".hero-swiper", {
      loop: true,
      autoplay: { delay: 5000 },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  //
  // 2) Therapist auto slider
  //
  (function initTherapistSlider() {
    const container = document.querySelector(".slider-container");
    if (!container) return;

    const slideItems = Array.from(container.querySelectorAll(".slide-item"));
    if (!slideItems.length) return;
    const pagination = document.getElementById("therapist-pagination");
    const prevBtn = document.getElementById("therapist-prev");
    const nextBtn = document.getElementById("therapist-next");

    if (pagination) {
      slideItems.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.className = "w-3 h-3 rounded-full";
        dot.setAttribute("aria-label", `Slide ${idx + 1}`);
        dot.dataset.index = idx;
        dot.style.transition = "background-color .2s";
        pagination.appendChild(dot);
      });
    }

    const dots = pagination ? Array.from(pagination.children) : [];
    let currentIndex = 0;
    let autoTimer = null;

    const updateActiveDot = () => {
      dots.forEach((d, i) => {
        d.style.backgroundColor = i === currentIndex ? "#63c2bd" : "rgba(156, 163, 175, .6)";
      });
    };

    const scrollToIndex = (i, smooth = true) => {
      currentIndex = (i + slideItems.length) % slideItems.length;
      const target = slideItems[currentIndex];
      if (!target) return;
      container.scrollTo({
        left: target.offsetLeft - (container.clientWidth - target.offsetWidth) / 2,
        behavior: smooth ? "smooth" : "auto",
      });
      updateActiveDot();
    };

    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(() => {
        scrollToIndex(currentIndex + 1);
      }, 3000);
    };
    const stopAuto = () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    };

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        scrollToIndex(parseInt(dot.dataset.index, 10));
        stopAuto();
        setTimeout(startAuto, 5000);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        scrollToIndex(currentIndex - 1);
        stopAuto();
        setTimeout(startAuto, 5000);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        scrollToIndex(currentIndex + 1);
        stopAuto();
        setTimeout(startAuto, 5000);
      });
    }

    let scrollTimeout = null;
    container.addEventListener("scroll", () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const center = container.scrollLeft + container.clientWidth / 2;
        let closest = 0;
        let minDiff = Infinity;
        slideItems.forEach((slide, idx) => {
          const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
          const diff = Math.abs(center - slideCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closest = idx;
          }
        });
        currentIndex = closest;
        updateActiveDot();
      }, 100);
    });

    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);
    container.addEventListener("pointerdown", stopAuto);
    container.addEventListener("pointerup", () => {
      setTimeout(startAuto, 2000);
    });

    scrollToIndex(0, false);
    startAuto();
  })();

  //
  // 3) Desktop SERVICES dropdown
  //
  (function initDesktopDropdown() {
    const desktopBtn = document.getElementById("dropdownToggleBtn");
    const desktopMenu = document.getElementById("services-dropdown");
    const desktopArrow = document.getElementById("services-arrow");
    if (!desktopBtn || !desktopMenu || !desktopArrow) return;

    desktopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      desktopMenu.classList.toggle("invisible");
      desktopMenu.classList.toggle("opacity-0");
      desktopMenu.classList.toggle("opacity-100");
      desktopMenu.classList.toggle("visible");
      desktopArrow.classList.toggle("rotate-180");
    });

    window.addEventListener("click", (e) => {
      if (!desktopMenu.contains(e.target) && !desktopBtn.contains(e.target)) {
        desktopMenu.classList.add("invisible", "opacity-0");
        desktopMenu.classList.remove("visible", "opacity-100");
        desktopArrow.classList.remove("rotate-180");
      }
    });
  })();

  //
  // 4) Mobile SERVICES dropdown
  //
  (function initMobileDropdown() {
    const mobileBtn = document.getElementById("dropdownMobileBtn");
    const mobileMenu = document.getElementById("services-dropdown-mobile");
    const mobileArrow = document.getElementById("services-arrow-mobile");
    if (!mobileBtn || !mobileMenu || !mobileArrow) return;

    mobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
      mobileArrow.classList.toggle("rotate-180");
    });
    mobileMenu.addEventListener("click", (e) => e.stopPropagation());
  })();

  //
  // 5) Burger-menu (mobile)
  //
  (function initBurger() {
    const burgerBtn = document.getElementById("burgerBtn");
    const overlay = document.getElementById("mobileMenuOverlay");
    const sideMenu = document.getElementById("mobileMenu");
    if (!burgerBtn || !overlay || !sideMenu) return;

    burgerBtn.addEventListener("click", () => {
      sideMenu.classList.toggle("translate-x-full");
      overlay.classList.toggle("hidden");
      document.body.classList.toggle("overflow-hidden");
    });
    overlay.addEventListener("click", () => {
      sideMenu.classList.add("translate-x-full");
      overlay.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    });
  })();

  //
  // 6) Scroll-triggered fade-in (Intersection Observer)
  //
  (function initScrollFade() {
    const animEls = document.querySelectorAll("[data-animate]");
    if (!animEls.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10");
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    animEls.forEach((el) => observer.observe(el));
  })();

  //
  // 7) Smooth scroll for anchor-links
  //
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const tgt = document.querySelector(link.getAttribute("href"));
      if (tgt) {
        e.preventDefault();
        tgt.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});


