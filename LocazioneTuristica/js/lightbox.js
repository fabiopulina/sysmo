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

  function renderGrid(list) {
    var show = list.slice(0, Math.min(9, list.length));
    gallery.classList.toggle("p-hero-grid--many", show.length > 5);
    gallery.innerHTML = show
      .map(function (src, i) {
        var alt = i === 0 ? "Copertina alloggio" : "Foto " + (i + 1);
        var extra = i === 0 ? ' fetchpriority="high"' : ' loading="lazy"';
        return (
          '<a href="' +
          src +
          '"><img src="' +
          src +
          '" alt="' +
          alt +
          '" width="1200" height="900"' +
          extra +
          "></a>"
        );
      })
      .join("");
    if (hint) {
      var tpl = hintTpl[lang] || hintTpl.it;
      hint.textContent = tpl.replace("{n}", String(list.length));
    }
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
      imgEl.src = images[index];
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

  probeFolder("/immagini/sanchioli-11/", 0, 80, function (probed) {
    var all = coverFirst(uniqueKeepOrder(probed.length ? probed : images));
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
  });
})();
