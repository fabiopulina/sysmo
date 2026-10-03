(function () {
  var btn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  // On the listing page, IT/EN/DE/FR must stay on Sanchioli 11 (not home).
  (function () {
    var path = (location.pathname || "").replace(/\/+$/, "") + "/";
    if (path.indexOf("sanchioli-11") === -1) return;
    var map = {
      it: "/strutture/sanchioli-11/",
      en: "/en/strutture/sanchioli-11/",
      de: "/de/strutture/sanchioli-11/",
      fr: "/fr/strutture/sanchioli-11/",
    };
    document.querySelectorAll(".lang a[hreflang]").forEach(function (a) {
      var code = (a.getAttribute("hreflang") || "").slice(0, 2);
      if (map[code]) a.setAttribute("href", map[code]);
    });
  })();
  var barHost = document.createElement("div");
  barHost.className = "scroll-progress";
  barHost.setAttribute("aria-hidden", "true");
  barHost.innerHTML = '<div class="scroll-progress__bar"></div>';
  document.body.prepend(barHost);
  var bar = barHost.querySelector(".scroll-progress__bar");

  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var p = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = p + "%";
  }

  // Section reveals
  var nodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  } else {
    nodes.forEach(function (n) {
      n.classList.add("on");
    });
  }

  // Parallax on hero + frames while scrolling
  var heroImg = document.querySelector(".hero__media img");
  var frames = Array.prototype.slice.call(document.querySelectorAll(".frame:not(.frame--train) img"));
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    updateProgress();
    if (reduce) return;
    var y = window.scrollY || 0;
    if (heroImg) {
      heroImg.style.transform = "scale(1.08) translate3d(0," + y * 0.18 + "px,0)";
    }
    frames.forEach(function (img) {
      var rect = img.getBoundingClientRect();
      var mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      var shift = Math.max(-28, Math.min(28, mid * -0.06));
      img.style.transform = "translate3d(0," + shift + "px,0) scale(1.04)";
    });
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();
})();
