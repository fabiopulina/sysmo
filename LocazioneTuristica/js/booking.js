(function () {
  var root = document.getElementById("avaibook-booking");
  if (!root) return;

  var listingId = document.body.getAttribute("data-listing-id") || root.getAttribute("data-listing") || "";
  var accId =
    document.body.getAttribute("data-avaibook-property-id") ||
    root.getAttribute("data-avaibook-id") ||
    "";

  if (
    (!accId || accId === "null") &&
    listingId &&
    window.MAGENTA_STAY_LISTINGS
  ) {
    var listing = window.MAGENTA_STAY_LISTINGS.find(function (l) {
      return l.id === listingId;
    });
    if (listing && listing.avaibookPropertyId) {
      accId = String(listing.avaibookPropertyId);
    }
  }

  var proxy = root.getAttribute("data-proxy") || "/api/avaibook/proxy.php";
  var lang = (document.documentElement.lang || "it").slice(0, 2);

  var i18n = {
    it: {
      title: "Verifica disponibilità",
      checkin: "Check-in",
      checkout: "Check-out",
      guests: "Ospiti",
      check: "Controlla date",
      loading: "Controllo in corso…",
      available: "Disponibile",
      notAvailable: "Non disponibile per queste date",
      partial: "Parzialmente disponibile",
      price: "Totale stimato",
      advance: "Acconto",
      offline: "Calendario AvaiBook non ancora configurato sul server (manca token o ID struttura).",
      error: "Impossibile contattare AvaiBook. Riprova più tardi.",
      needDates: "Seleziona check-in e check-out.",
      request: "Richiedi prenotazione diretta",
      directHint: "Prenotazione diretta con l’host — senza intermediazione.",
    },
    en: {
      title: "Check availability",
      checkin: "Check-in",
      checkout: "Check-out",
      guests: "Guests",
      check: "Check dates",
      loading: "Checking…",
      available: "Available",
      notAvailable: "Not available for these dates",
      partial: "Partially available",
      price: "Estimated total",
      advance: "Deposit",
      offline: "AvaiBook calendar not configured yet (missing token or property id on server).",
      error: "Could not reach AvaiBook. Please try again later.",
      needDates: "Select check-in and check-out.",
      request: "Request direct booking",
      directHint: "Direct booking with the host — no middleman.",
    },
    de: {
      title: "Verfügbarkeit prüfen",
      checkin: "Check-in",
      checkout: "Check-out",
      guests: "Gäste",
      check: "Daten prüfen",
      loading: "Wird geprüft…",
      available: "Verfügbar",
      notAvailable: "Für diese Daten nicht verfügbar",
      partial: "Teilweise verfügbar",
      price: "Geschätzter Gesamtpreis",
      advance: "Anzahlung",
      offline: "AvaiBook noch nicht konfiguriert (Token oder Unterkunfts-ID fehlt).",
      error: "AvaiBook nicht erreichbar. Bitte später erneut versuchen.",
      needDates: "Bitte Check-in und Check-out wählen.",
      request: "Direktbuchung anfragen",
      directHint: "Direktbuchung beim Host — ohne Zwischenhändler.",
    },
    fr: {
      title: "Vérifier les disponibilités",
      checkin: "Arrivée",
      checkout: "Départ",
      guests: "Voyageurs",
      check: "Vérifier",
      loading: "Vérification…",
      available: "Disponible",
      notAvailable: "Indisponible pour ces dates",
      partial: "Partiellement disponible",
      price: "Total estimé",
      advance: "Acompte",
      offline: "Calendrier AvaiBook non configuré (token ou ID manquant).",
      error: "Impossible de joindre AvaiBook. Réessayez plus tard.",
      needDates: "Sélectionnez arrivée et départ.",
      request: "Demander une réservation directe",
      directHint: "Réservation directe avec l’hôte — sans intermédiaire.",
    },
  };
  var t = i18n[lang] || i18n.it;

  root.innerHTML =
    '<div class="ab-box">' +
    "<h3 class=\"ab-box__title\">" +
    t.title +
    "</h3>" +
    '<form class="ab-form" id="ab-form">' +
    '<label>' +
    t.checkin +
    '<input type="date" name="checkin" required></label>' +
    '<label>' +
    t.checkout +
    '<input type="date" name="checkout" required></label>' +
    '<label>' +
    t.guests +
    '<input type="number" name="guests" min="1" max="8" value="2"></label>' +
    '<button type="submit" class="btn btn-primary">' +
    t.check +
    "</button>" +
    "</form>" +
    '<div class="ab-result" id="ab-result" hidden></div>' +
    '<p class="ab-hint muted" id="ab-hint"></p>' +
    "</div>";

  var form = root.querySelector("#ab-form");
  var result = root.querySelector("#ab-result");
  var hint = root.querySelector("#ab-hint");
  var checkinEl = form.querySelector('[name="checkin"]');
  var checkoutEl = form.querySelector('[name="checkout"]');

  var today = new Date();
  var iso = function (d) {
    return d.toISOString().slice(0, 10);
  };
  checkinEl.min = iso(today);
  checkoutEl.min = iso(today);

  checkinEl.addEventListener("change", function () {
    if (checkinEl.value) {
      var d = new Date(checkinEl.value + "T12:00:00");
      d.setDate(d.getDate() + 1);
      checkoutEl.min = iso(d);
      if (checkoutEl.value && checkoutEl.value <= checkinEl.value) {
        checkoutEl.value = iso(d);
      }
    }
  });

  function api(action, params) {
    var q = Object.assign({ action: action }, params || {});
    if (accId) q.accommodation = accId;
    var url = proxy + "?" + new URLSearchParams(q).toString();
    return fetch(url, { credentials: "same-origin" }).then(function (r) {
      return r.json().then(function (j) {
        return { http: r.status, body: j };
      });
    });
  }

  // Warm ping + calendar load (non-blocking)
  api("ping")
    .then(function (res) {
      if (!res.body || !res.body.ok) {
        hint.textContent = t.offline;
        return;
      }
      if (!accId && res.body.default_accommodation_id) {
        accId = String(res.body.default_accommodation_id);
      }
      if (!accId) {
        hint.textContent = t.offline;
        return;
      }
      hint.textContent = "";
      return api("calendar", {});
    })
    .then(function (res) {
      if (!res || !res.body || !res.body.ok) return;
      var periods = res.body.data || [];
      root.setAttribute("data-blocked-count", String(periods.length || 0));
    })
    .catch(function () {
      hint.textContent = t.offline;
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var cin = checkinEl.value;
    var cout = checkoutEl.value;
    var guests = form.querySelector('[name="guests"]').value || "2";
    if (!cin || !cout) {
      result.hidden = false;
      result.textContent = t.needDates;
      return;
    }
    result.hidden = false;
    result.textContent = t.loading;

    Promise.all([
      api("availability", { startDate: cin, endDate: cout }),
      api("price", {
        checkinDate: cin,
        checkoutDate: cout,
        travelers: guests,
      }),
    ])
      .then(function (both) {
        var avail = both[0];
        var price = both[1];
        if (
          avail.body &&
          (avail.body.error === "token_missing" ||
            avail.body.error === "config_missing")
        ) {
          result.textContent = t.offline;
          return;
        }
        if (!avail.body || !avail.body.ok) {
          result.textContent = t.error;
          return;
        }
        var code = avail.body.data;
        // 1 available, 0 not, 2 partial
        var statusText =
          code === 1 || code === "1"
            ? t.available
            : code === 2 || code === "2"
              ? t.partial
              : t.notAvailable;

        var html = "<p><strong>" + statusText + "</strong></p>";
        if (price.body && price.body.ok && price.body.data) {
          var rows = Array.isArray(price.body.data)
            ? price.body.data
            : [price.body.data];
          var p0 = rows[0];
          if (p0) {
            if (p0.status) {
              html +=
                "<p class=\"muted\">Status: " +
                String(p0.status) +
                (p0.restrictions && p0.restrictions.length
                  ? " (" + p0.restrictions.join(", ") + ")"
                  : "") +
                "</p>";
            }
            if (typeof p0.total === "number") {
              html +=
                "<p>" +
                t.price +
                ": <strong>€ " +
                p0.total.toFixed(2) +
                "</strong></p>";
            }
            if (typeof p0.advance === "number") {
              html +=
                "<p>" +
                t.advance +
                ": € " +
                p0.advance.toFixed(2) +
                "</p>";
            }
          }
        }
        html +=
          '<p class="muted" style="margin:.7rem 0 0">' +
          t.directHint +
          "</p>" +
          '<div class="actions" style="margin-top:.8rem">' +
          '<a class="btn btn-primary" href="/contatti/?checkin=' +
          encodeURIComponent(cin) +
          "&checkout=" +
          encodeURIComponent(cout) +
          "&guests=" +
          encodeURIComponent(guests) +
          '">' +
          t.request +
          "</a>" +
          "</div>";
        result.innerHTML = html;
      })
      .catch(function () {
        result.textContent = t.error;
      });
  });
})();
