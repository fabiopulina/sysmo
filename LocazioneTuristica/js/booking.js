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
  var engineUrl =
    root.getAttribute("data-booking-engine") ||
    document.body.getAttribute("data-booking-engine") ||
    "";
  var allowDirect = true;

  if (
    !engineUrl &&
    listingId &&
    window.MAGENTA_STAY_LISTINGS
  ) {
    var listingEngine = window.MAGENTA_STAY_LISTINGS.find(function (l) {
      return l.id === listingId;
    });
    if (listingEngine && listingEngine.avaibookEmbed) {
      engineUrl = String(listingEngine.avaibookEmbed);
    }
  }

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
      request: "Invia richiesta",
      sending: "Invio al channel AvaiBook…",
      sent: "Richiesta inviata",
      sentHint: "La pratica è nel channel AvaiBook. Fabio ti risponde da lì, senza WhatsApp.",
      name: "Nome",
      email: "Email",
      phone: "Telefono",
      note: "Messaggio (facoltativo)",
      needGuest: "Inserisci nome e email.",
      notCertified: "AvaiBook deve ancora certificare le prenotazioni via API. Intanto usa il motore ufficiale o contatta Fabio.",
      rateLimit: "Troppe richieste. Riprova tra un po’.",
      bookError: "Invio non riuscito. Riprova o scrivi a Fabio.",
      directHint: "La richiesta arriva nel channel AvaiBook, senza WhatsApp.",
      engineAlt: "Apri il motore AvaiBook",
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
      request: "Send request",
      sending: "Sending to AvaiBook channel…",
      sent: "Request sent",
      sentHint: "The booking is in the AvaiBook channel. Fabio will reply there, not on WhatsApp.",
      name: "First name",
      email: "Email",
      phone: "Phone",
      note: "Message (optional)",
      needGuest: "Please enter your name and email.",
      notCertified: "AvaiBook still needs to certify API bookings. Use the official engine or contact Fabio.",
      rateLimit: "Too many requests. Please try later.",
      bookError: "Could not send. Try again or contact Fabio.",
      directHint: "The request goes to the AvaiBook channel, not WhatsApp.",
      engineAlt: "Open AvaiBook booking engine",
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
      request: "Anfrage senden",
      sending: "Wird an AvaiBook-Channel gesendet…",
      sent: "Anfrage gesendet",
      sentHint: "Die Buchung liegt im AvaiBook-Channel. Fabio antwortet dort, nicht per WhatsApp.",
      name: "Vorname",
      email: "E-Mail",
      phone: "Telefon",
      note: "Nachricht (optional)",
      needGuest: "Bitte Name und E-Mail angeben.",
      notCertified: "AvaiBook muss API-Buchungen noch zertifizieren. Nutzen Sie die Buchungsmaschine oder kontaktieren Sie Fabio.",
      rateLimit: "Zu viele Anfragen. Bitte später erneut versuchen.",
      bookError: "Senden fehlgeschlagen. Bitte erneut versuchen oder Fabio kontaktieren.",
      directHint: "Die Anfrage landet im AvaiBook-Channel, nicht bei WhatsApp.",
      engineAlt: "AvaiBook-Buchungsmaschine öffnen",
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
      request: "Envoyer la demande",
      sending: "Envoi vers le channel AvaiBook…",
      sent: "Demande envoyée",
      sentHint: "La réservation est dans le channel AvaiBook. Fabio répondra là, pas sur WhatsApp.",
      name: "Prénom",
      email: "E-mail",
      phone: "Téléphone",
      note: "Message (facultatif)",
      needGuest: "Indiquez votre nom et e-mail.",
      notCertified: "AvaiBook doit encore certifier les réservations API. Utilisez le moteur officiel ou contactez Fabio.",
      rateLimit: "Trop de demandes. Réessayez plus tard.",
      bookError: "Envoi impossible. Réessayez ou contactez Fabio.",
      directHint: "La demande arrive dans le channel AvaiBook, pas WhatsApp.",
      engineAlt: "Ouvrir le moteur AvaiBook",
    },
  };
  var t = i18n[lang] || i18n.it;

  var contactPaths = {
    it: "/contatti/",
    en: "/en/contact/",
    de: "/de/kontakt/",
    fr: "/fr/contact/",
  };
  var contactPath = contactPaths[lang] || contactPaths.it;

  function buildEngineHref(cin, cout, guests) {
    if (!engineUrl) return "";
    try {
      var u = new URL(engineUrl, window.location.origin);
      if (cin) {
        u.searchParams.set("arrival", cin);
        u.searchParams.set("checkin", cin);
        u.searchParams.set("checkinDate", cin);
      }
      if (cout) {
        u.searchParams.set("departure", cout);
        u.searchParams.set("checkout", cout);
        u.searchParams.set("checkoutDate", cout);
      }
      if (guests) {
        u.searchParams.set("occupancy", guests);
        u.searchParams.set("travelers", guests);
        u.searchParams.set("guests", guests);
      }
      return u.toString();
    } catch (err) {
      return engineUrl;
    }
  }

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

  function postBook(payload) {
    var q = { action: "book" };
    if (accId) q.accommodation = accId;
    var url = proxy + "?" + new URLSearchParams(q).toString();
    return fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (r) {
      return r.json().then(function (j) {
        return { http: r.status, body: j };
      });
    });
  }

  function engineLink(cin, cout, guests) {
    var href = buildEngineHref(cin, cout, guests);
    if (!href) return "";
    return (
      '<p style="margin:.7rem 0 0"><a class="btn btn-ghost" href="' +
      href +
      '" target="_blank" rel="noopener noreferrer">' +
      t.engineAlt +
      "</a></p>"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  api("ping")
    .then(function (res) {
      if (!res.body || !res.body.ok) {
        hint.textContent = t.offline;
        return;
      }
      if (!engineUrl && res.body.booking_engine_url) {
        engineUrl = String(res.body.booking_engine_url);
      }
      if (typeof res.body.allow_direct_booking === "boolean") {
        allowDirect = res.body.allow_direct_booking;
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
        var canBook = (code === 1 || code === "1") && allowDirect;
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
        html += '<p class="muted" style="margin:.7rem 0 0">' + t.directHint + "</p>";
        if (canBook) {
          html +=
            '<form class="ab-form ab-guest" id="ab-guest">' +
            '<label class="ab-hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
            "<label>" +
            t.name +
            ' <input type="text" name="name" required autocomplete="given-name"></label>' +
            "<label>" +
            t.email +
            ' <input type="email" name="email" required autocomplete="email"></label>' +
            "<label>" +
            t.phone +
            ' <input type="tel" name="phone" autocomplete="tel"></label>' +
            "<label>" +
            t.note +
            ' <textarea name="note" rows="3" maxlength="1500"></textarea></label>' +
            '<button type="submit" class="btn btn-primary">' +
            t.request +
            "</button>" +
            "</form>";
        }
        html += engineLink(cin, cout, guests);
        if (!canBook && !engineUrl) {
          html +=
            '<p style="margin:.7rem 0 0"><a class="btn btn-primary" href="' +
            contactPath +
            "?checkin=" +
            encodeURIComponent(cin) +
            "&checkout=" +
            encodeURIComponent(cout) +
            "&guests=" +
            encodeURIComponent(guests) +
            '">' +
            t.request +
            "</a></p>";
        }
        result.innerHTML = html;

        var guest = result.querySelector("#ab-guest");
        if (!guest) return;
        guest.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var name = (guest.querySelector('[name="name"]').value || "").trim();
          var email = (guest.querySelector('[name="email"]').value || "").trim();
          var phone = (guest.querySelector('[name="phone"]').value || "").trim();
          var note = (guest.querySelector('[name="note"]').value || "").trim();
          var website = (guest.querySelector('[name="website"]').value || "").trim();
          if (name.length < 2 || email.indexOf("@") < 1) {
            hint.textContent = t.needGuest;
            return;
          }
          hint.textContent = "";
          var btn = guest.querySelector('button[type="submit"]');
          if (btn) btn.disabled = true;
          guest.hidden = true;
          var wait = document.createElement("p");
          wait.id = "ab-wait";
          wait.textContent = t.sending;
          result.appendChild(wait);

          postBook({
            accommodation: accId,
            checkin: cin,
            checkout: cout,
            guests: Number(guests),
            name: name,
            email: email,
            phone: phone,
            note: note,
            website: website,
            language: lang,
          })
            .then(function (res) {
              wait.remove();
              guest.hidden = false;
              if (btn) btn.disabled = false;
              var err = res.body && res.body.error;
              if (res.body && res.body.ok) {
                guest.remove();
                var done = document.createElement("div");
                done.className = "ab-ok";
                done.innerHTML =
                  "<p><strong>" +
                  t.sent +
                  "</strong>" +
                  (res.body.booking_id
                    ? " · " + escapeHtml(res.body.booking_id)
                    : "") +
                  "</p><p class=\"muted\">" +
                  t.sentHint +
                  "</p>";
                result.appendChild(done);
                return;
              }
              if (err === "not_certified") {
                hint.textContent = t.notCertified;
                return;
              }
              if (err === "rate_limit") {
                hint.textContent = t.rateLimit;
                return;
              }
              if (err === "not_available") {
                hint.textContent = t.notAvailable;
                return;
              }
              hint.textContent = (res.body && res.body.message) || t.bookError;
            })
            .catch(function () {
              wait.remove();
              guest.hidden = false;
              if (btn) btn.disabled = false;
              hint.textContent = t.bookError;
            });
        });
      })
      .catch(function () {
        result.textContent = t.error;
      });
  });
})();
