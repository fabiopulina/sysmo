(function () {
  var gallery = document.getElementById("gallery");
  if (!gallery) return;

  var listingId = document.body.getAttribute("data-listing-id");
  var lang = (document.documentElement.lang || "it").slice(0, 2);
  var hint = document.getElementById("gallery-hint");
  var images = [];
  var alts = [];

  var hintTpl = {
    it: "Clicca una foto per aprirla a tutto schermo · frecce per scorrere tutte le {n} immagini",
    en: "Click a photo to open fullscreen · arrows to browse all {n} images",
    de: "Foto anklicken für Vollbild · Pfeile für alle {n} Bilder",
    fr: "Cliquez une photo pour le plein écran · flèches pour les {n} images",
  };

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function uniqueKeepOrder(list) {
    var seen = {};
    var out = [];
    list.forEach(function (u) {
      if (!u || seen[u]) return;
      seen[u] = 1;
      out.push(u);
    });
    return out;
  }

  function thumbSrc(full, w) {
    w = w || 640;
    var path = (full || "").replace(/^\//, "");
    return "/api/thumb.php?src=" + encodeURIComponent(path) + "&w=" + w;
  }

  function coverFirst(list) {
    var cover = "/immagini/sanchioli-11/foto-00.jpg";
    var rest = list.filter(function (u) {
      return u.indexOf("foto-00.") === -1;
    });
    if (list.some(function (u) { return u.indexOf("foto-00.") !== -1; })) {
      return [cover].concat(rest);
    }
    return list;
  }

  function probeFolder(basePath, start, max, done) {
    var found = [];
    var n = start;
    var misses = 0;
    function tick() {
      if (n > max || misses >= 3) {
        done(found);
        return;
      }
      var url = basePath + "foto-" + pad2(n) + ".jpg";
      var img = new Image();
      var current = n;
      img.onload = function () {
        found.push(url);
        misses = 0;
        n = current + 1;
        tick();
      };
      img.onerror = function () {
        misses += 1;
        n = current + 1;
        tick();
      };
      img.src = url;
    }
    tick();
  }

  if (
    listingId &&
    window.MAGENTA_STAY_LISTINGS &&
    Array.isArray(window.MAGENTA_STAY_LISTINGS)
  ) {
    var listing = window.MAGENTA_STAY_LISTINGS.find(function (l) {
      return l.id === listingId;
    });
    if (listing && listing.images && listing.images.length) {
      images = listing.images.slice();
    }
  }

  if (!images.length) {
    Array.prototype.forEach.call(gallery.querySelectorAll("a[href]"), function (a) {
      images.push(a.getAttribute("href"));
    });
  }

  function revealTiles() {
    var tiles = gallery.querySelectorAll("a.tile-reveal");
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!tiles.length) return;
    if (!("IntersectionObserver" in window) || reduce) {
      Array.prototype.forEach.call(tiles, function (t) {
        t.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );
    Array.prototype.forEach.call(tiles, function (t) {
      io.observe(t);
    });
  }

  function renderGrid(list) {
    gallery.classList.toggle("p-hero-grid--many", list.length > 5);
    gallery.innerHTML = list
      .map(function (src, i) {
        var alt = i === 0 ? "Copertina alloggio" : "Sanchioli 11 · foto " + pad2(i);
        var extra =
          i === 0
            ? ' fetchpriority="high" decoding="async"'
            : ' loading="lazy" decoding="async"';
        return (
          '<a class="tile-reveal" href="' +
          src +
          '"><img src="' +
          thumbSrc(src, 640) +
          '" alt="' +
          alt +
          '" width="640" height="480"' +
          extra +
          ' onerror="this.onerror=null;this.src=\'' +
          src +
          '\';"></a>'
        );
      })
      .join("");
    var leftover = document.getElementById("gallery-more");
    if (leftover) leftover.remove();
    if (hint) {
      var tpl = hintTpl[lang] || hintTpl.it;
      hint.textContent = tpl.replace("{n}", String(list.length));
    }
    revealTiles();
  }

  function bindLightbox(list) {
    images = list;
    alts = list.map(function (_, i) {
      return i === 0 ? "Copertina alloggio" : "Foto " + (i + 1);
    });

    var index = 0;
    var modal = document.createElement("div");
    modal.className = "lightbox";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Photo gallery");
    modal.hidden = true;
    modal.innerHTML =
      '<div class="lightbox__backdrop" data-close="1"></div>' +
      '<div class="lightbox__panel">' +
      '<button type="button" class="lightbox__close" data-close="1" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous">&larr;</button>' +
      '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" alt="">' +
      '<figcaption class="lightbox__cap"></figcaption>' +
      "</figure>" +
      '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next">&rarr;</button>' +
      "</div>";
    document.body.appendChild(modal);

    var imgEl = modal.querySelector(".lightbox__img");
    var capEl = modal.querySelector(".lightbox__cap");
    var prevBtn = modal.querySelector(".lightbox__nav--prev");
    var nextBtn = modal.querySelector(".lightbox__nav--next");

    function show(i) {
      index = (i + images.length) % images.length;
      imgEl.src = thumbSrc(images[index], 1400);
      imgEl.onerror = function () {
        imgEl.onerror = null;
        imgEl.src = images[index];
      };
      imgEl.alt = alts[index] || "Photo " + (index + 1);
      capEl.textContent = index + 1 + " / " + images.length;
    }

    function openAt(i) {
      show(i);
      modal.hidden = false;
      document.body.classList.add("lightbox-open");
      nextBtn.focus();
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove("lightbox-open");
      imgEl.removeAttribute("src");
    }

    function indexOfHref(href) {
      var i = images.indexOf(href);
      if (i >= 0) return i;
      var file = (href || "").split("/").pop();
      for (var n = 0; n < images.length; n++) {
        if ((images[n] || "").split("/").pop() === file) return n;
      }
      return 0;
    }

    gallery.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || !gallery.contains(a)) return;
      e.preventDefault();
      e.stopPropagation();
      openAt(indexOfHref(a.getAttribute("href")));
    });

    modal.addEventListener("click", function (e) {
      if (e.target.getAttribute("data-close")) close();
    });
    prevBtn.addEventListener("click", function () {
      show(index - 1);
    });
    nextBtn.addEventListener("click", function () {
      show(index + 1);
    });

    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  function finish(all) {
    all = coverFirst(uniqueKeepOrder(all));
    if (!all.length) return;
    renderGrid(all);
    bindLightbox(all);
    if (window.MAGENTA_STAY_LISTINGS) {
      var rec = window.MAGENTA_STAY_LISTINGS.find(function (l) {
        return l.id === listingId;
      });
      if (rec) {
        rec.cover = "/immagini/sanchioli-11/foto-00.jpg";
        rec.images = all;
      }
    }
  }

  if (images.length) {
    finish(images);
  } else {
    probeFolder("/immagini/sanchioli-11/", 0, 80, function (probed) {
      finish(probed);
    });
  }
})();
