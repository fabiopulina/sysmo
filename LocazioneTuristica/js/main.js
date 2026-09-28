(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Registry for multiple tourist rentals (extend as new LT pages are added)
  window.SANCHIOLI_LISTINGS = window.SANCHIOLI_LISTINGS || [
    {
      id: "sanchioli-11",
      name: "Sanchioli 11",
      city: "Magenta (MI)",
      path: "strutture/sanchioli-11/",
      guests: 2,
      highlight: "Fiera Rho · Malpensa · Milano"
    }
  ];
})();
