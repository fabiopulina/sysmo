# Canali & prezzi — Sanchioli 11

**CIN** `IT015130C2SMSD6MZG` · **AvaiBook** `408300`  
Verifica live: **2026-10-17** · 2 adulti · 2 notti

Campioni:
- **A** base midweek: 10–12 nov 2026 (dopo EICMA)
- **B** picco EICMA: 5–7 nov 2026 (gio–sab)

Prezzi AvaiBook di riferimento (prima dei markup OTA), da `fiere-domanda-prezzi.md`:
- Fuori fiera: **95 / 100 €** (D–G / V–S)
- EICMA: **145 / 150 €**

---

## Link inserzioni

| Canale | Link | Sync AvaiBook | Azione manuale? |
|---|---|---|---|
| Magenta Stay | https://www.magentastay.it/strutture/sanchioli-11/ | Sì (API) | No |
| Booking.com | https://www.booking.com/hotel/it/sanchioli.it.html | Sì (prezzi) | No (promo solo Extranet) |
| Airbnb | https://www.airbnb.it/rooms/1780316664494400682 | Sì (prezzi; markup +16%) | Controllare sync se sballa |
| Rentalia | https://it.rentalia.com/1043251 | Sì | No |
| HomeToGo | https://www.hometogo.it/rental/425c00291ea2ccb1 | Sì (se collegato) | Verificare a mano |
| Expedia | https://www.expedia.com/Milan-Hotels-Studio-Apartment-In-Magenta-Near-Rho-Fiera.h136647276.Hotel-Information | **No / fragile** (rosso in AvaiBook) | **Sì — aggiorna qui** |
| VRBO | https://www.vrbo.com/it-it/affitto-vacanze/p12260884 · `p12260884` / Expedia `136647276` | **No** (bot + non sync) | **Sì — aggiorna qui** |
| HousingAnywhere | https://housinganywhere.com/it/room/ut1744431/it/Magenta/via-fratelli-sanchioli | No (mensile) | Solo mid-term |

---

## Prezzi rilevati (totale 2 notti, 2 ospiti)

| Canale | A 10–12 nov | ≈/notte A | B 5–7 nov (EICMA) | ≈/notte B | Note |
|---|---|---|---|---|---|
| Magenta Stay | **190 €** | 95 € | **265 €** | 132,50 € | Diretto = AvaiBook |
| Booking | **168 €** (non rimb.) / **184 €** (free cancel) | 84–92 € | **235 €** / **256 €** | 117–128 € | Markup ~+18% vs base |
| Airbnb | **198 €** tot | ~99 € | **277 €** tot | ~138,50 € | Markup ~+16%; tot include fee guest |
| Rentalia | **199,50 €** tot (99,75 €/n) | ~100 € | **278,25 €** tot (139,12 €/n) | ~139 € | Sync OK |
| Expedia | **~$101/notte** (~254 $ tot) | ~101 $ | *(captcha)* | — | A letto; B bloccato bot |
| VRBO | *(captcha)* | — | *(captcha)* | — | **Da aggiornare a mano** |

Picco EICMA ≈ **+40%** vs midweek su tutti i canali letti.

---

## Dove aggiornare a mano (no sync)

1. **VRBO / Partner Central** — allinea calendario a AvaiBook dopo ogni modifica stagioni (soprattutto EICMA 145/150, Salone 150/150, base 95/100).
2. **Expedia** (stesso hotel `136647276`) — stesso allineamento; verifica dopo sync XML se torna rosso in AvaiBook.
3. **HousingAnywhere** — solo se usi mid-term (mensile), non le stagioni fiere.

Canali sync (Booking, Airbnb, Rentalia, Magenta Stay): dopo Salva in AvaiBook attendi sync; non serve ritoccare il sito OTA salvo promo Extranet.

---

## Checklist rapida post-stagioni AvaiBook

- [ ] Booking: apri 5–7 nov e 10–12 nov → prezzi coerenti con tabella sopra (± markup)
- [ ] Airbnb: stesso check
- [ ] Rentalia: stesso check
- [ ] **Expedia + VRBO: aggiorna manualmente** date fiere (EICMA, Salone, Host, BIT…)
- [ ] Magenta Stay: calendar widget = AvaiBook
