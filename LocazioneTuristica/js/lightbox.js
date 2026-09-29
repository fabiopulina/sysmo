(function () {
  var gallery = document.getElementById("gallery");
  if (!gallery) return;

  var listingId = document.body.getAttribute("data-listing-id");
  var images = [];
  var alts = [];

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
      var img = a.querySelector("img");
      alts.push(img ? img.getAttribute("alt") || "" : "");
    });
  } else {
    Array.prototype.forEach.call(gallery.querySelectorAll("a[href] img"), function (img) {
      alts.push(img.getAttribute("alt") || "");
    });
  }

  if (!images.length) return;

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
})();
