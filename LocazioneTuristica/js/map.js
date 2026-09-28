(function () {
  var el = document.getElementById("map-street");
  if (!el || typeof L === "undefined") return;

  var places = [
    {
      name: "Magenta Stay",
      sub: "Via Sanchioli 11 · base",
      lat: 45.4664,
      lng: 8.8909,
      tone: "magenta"
    },
    {
      name: "Malpensa (MXP)",
      sub: "~20 min in auto",
      lat: 45.6301,
      lng: 8.7255,
      tone: "malpensa"
    },
    {
      name: "Rho Fiera / Expo",
      sub: "~15 min in auto",
      lat: 45.5203,
      lng: 9.0958,
      tone: "fiera"
    },
    {
      name: "Milano",
      sub: "Duomo · Garibaldi · Centrale",
      lat: 45.4642,
      lng: 9.1900,
      tone: "milano"
    },
    {
      name: "Parco del Ticino",
      sub: "valle · ciclovie · Navigli",
      lat: 45.4585,
      lng: 8.8120,
      tone: "ticino"
    }
  ];

  var map = L.map(el, {
    scrollWheelZoom: false,
    attributionControl: true
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  L.circle([45.455, 8.8], {
    radius: 7000,
    color: "#5fa978",
    weight: 1.5,
    fillColor: "#8dcb9b",
    fillOpacity: 0.18
  }).addTo(map);

  var bounds = [];
  places.forEach(function (p) {
    var icon = L.divIcon({
      className: "pin pin--" + p.tone,
      html:
        '<span class="pin__dot"></span><span class="pin__label">' +
        p.name +
        "</span>",
      iconSize: [120, 36],
      iconAnchor: [12, 12]
    });
    var marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
    marker.bindPopup("<strong>" + p.name + "</strong><br>" + p.sub);
    bounds.push([p.lat, p.lng]);
  });

  function fit() {
    map.invalidateSize();
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 11 });
  }

  fit();
  setTimeout(fit, 200);
  window.addEventListener("resize", function () {
    map.invalidateSize();
  });

  var reveal = el.closest(".reveal");
  if (reveal && "MutationObserver" in window) {
    var mo = new MutationObserver(function () {
      if (reveal.classList.contains("on")) {
        fit();
        mo.disconnect();
      }
    });
    mo.observe(reveal, { attributes: true, attributeFilter: ["class"] });
  }

  map.once("click", function () {
    map.scrollWheelZoom.enable();
  });
})();
