# Controllo coerenza canali — Sanchioli 11 (Magenta Stay)

**CIN** `IT015130C2SMSD6MZG` · **CIR** `015130-LNI-00583` · **AvaiBook** `408300` / unit `493004`  
Aggiornato: **2026-10-09**

## Come usarlo

AvaiBook è la **guida prezzi**. Gli altri siti devono avere tariffe coerenti e commissioni note, così sai il netto reale.

1. Compila la colonna **Comm. % (tuo contratto)** dalle extranet / fatture (i % di riferimento sono tipici di mercato).
2. Nella tabella **Check prezzi per date** confronta i totali OTA con AvaiBook a parità di date.
3. Nella tabella **Sconti / promo** elenca ogni offerta e indica dove deve esistere.

### Regole sconti (riepilogo)

| Dove | Come si gestiscono |
|---|---|
| Airbnb | Solo Last minute / Early booking / Long stay → **Set di regole** AvaiBook. Non duplicare su Airbnb. |
| Booking.com | Promozioni **solo** in extranet Booking (non sync da AvaiBook). |
| VRBO / Expedia | Promo (~10%: early, LM, mobile, iscritti, nuova struttura) **solo su VRBO**. Non cumulabili. |
| Rentalia + sito Magenta Stay | Offerte create in **AvaiBook**. |
| HousingAnywhere | Mid-term separato; promo gestite su HA. |

### Prenotazione immediata

| Canale | Dove si imposta | Note |
|---|---|---|
| AvaiBook (motore/sito) | Alloggio → Opzioni di prenotazione → Accettazione immediata | **Impostata** (non più “su richiesta”). |
| VRBO | Area proprietario → Norme e politiche → Tipo di prenotazione | **Impostata** Prenotazione Immediata (non la variante “solo richieste anticipate”). |
| Booking.com | Extranet → Struttura → Politiche → *Come ricevi le prenotazioni* | **Non sync da AvaiBook**. Verificare: “Tutti gli ospiti possono prenotare subito”. |
| Airbnb | Annuncio → Impostazioni prenotazione | Attivare Prenotazione immediata. |
| Rentalia / HomeToGo / VRBO XML | Connessione canale in AvaiBook | Modalità impostabile in connessione AvaiBook. |
| HousingAnywhere | Pannello HA | Flusso mid-term diverso. |

---

## Link annunci

| Canale | Link | ID |
|---|---|---|
| AvaiBook / sito | [Magenta Stay – Sanchioli 11](https://www.magentastay.it/strutture/sanchioli-11/) · app AvaiBook alloggio 408300 | `408300` |
| Rentalia | https://it.rentalia.com/1043251 | `1043251` |
| Booking.com | https://www.booking.com/hotel/it/sanchioli.it.html | `hotel/it/sanchioli.it` |
| Airbnb | https://www.airbnb.it/rooms/1780316664494400682 | `1780316664494400682` |
| HomeToGo | https://www.hometogo.it/rental/425c00291ea2ccb1 | `425c00291ea2ccb1` |
| VRBO / Expedia | *(incolla link annuncio)* | — |
| HousingAnywhere | https://housinganywhere.com/it/room/ut1744431/it/Magenta/via-fratelli-sanchioli | `ut1744431` |

---

## Canali — prezzi vs AvaiBook

Guida AvaiBook campione: **€87,96 / notte** (10–12 nov 2026, 2 ospiti → tot €175,92).

| Canale | Tipo | Prezzo sul canale | Unità | Delta vs AvaiBook | Stato |
|---|---|---|---|---|---|
| AvaiBook | Hub / PMS + motore | ~87,96 (campione 10–12 nov) | €/notte | — (riferimento) | RIFERIMENTO |
| Magenta Stay | Diretto / API Owner | Stesso prezzo via proxy | €/notte | 0 | OK a campione |
| Rentalia | OTA short-term | da 83 €/notte (senza date) | €/notte (da) | ≈ −5 € (verificare a date uguali) | DA VERIFICARE |
| Booking.com | OTA short-term | *(compilare)* | €/notte o totale | DA COMPILARE | DA COMPILARE |
| Airbnb | OTA short-term | *(compilare con stesse date)* | €/notte | DA COMPILARE | DA COMPILARE |
| HomeToGo | Meta / OTA | *(aprire a mano)* | €/notte | DA COMPILARE | DA COMPILARE |
| VRBO / Expedia | OTA (Expedia Group) | *(compilare)* | €/notte | DA COMPILARE | DA COMPILARE |
| HousingAnywhere | Mid-term / mensile | 2.000 €/mese (+ promo −15% vista) | €/mese | Non 1:1 vs short-term (~66 €/notte se /30) | DA ALLINEARE |

---

## Canali — commissioni e netto

| Canale | Comm. % riferimento | Comm. % (tuo contratto) | Fee pagamento extra | Netto stimato su 100 € lordo |
|---|---|---|---|---|
| AvaiBook | Piano: spesso 1% + IVA; gateway 2–4%+IVA | | 2%+IVA SEPA · 4%+IVA non-SEPA/AMEX | ≈100 meno fee AvaiBook |
| Magenta Stay | 0% OTA (+ fee AvaiBook se usi i loro pagamenti) | | Come AvaiBook se online | ≈90–100 |
| Rentalia | 10% + IVA | | Anticipo AvaiBook / TPV | ≈90 @10% |
| Booking.com | Base ~15%; Preferred ~18%; Pref+ ~23% — vedi contratto | | Payments by Booking ~1–3% | ≈85 @15% |
| Airbnb | Host-only tipico ~15,5% | | Di solito inclusa host-only | ≈84,5 @15,5% |
| HomeToGo | 15% + IVA (host-only tipico) | | Secondo modello HTG | ≈85 @15% |
| VRBO / Expedia | Secondo contratto (verificare) | | Secondo modello pagamento | DA COMPILARE |
| HousingAnywhere | 8% TCV + IVA (standard) | | Tenant fee a inquilino | ≈92% TCV |

> Compila **Comm. % (tuo contratto)** da Agreement / payout / fatture: i valori di riferimento non sono il tuo contratto.

---

## Canali — sconti, cancellazione, sync

| Canale | Sconti / promo | Dove gestisci gli sconti | Cancellazione | Sync AvaiBook | Note |
|---|---|---|---|---|---|
| AvaiBook | Offerte LM / early / long stay | AvaiBook → Offerte | Policy alloggio | Origine prezzi | Fonte unica |
| Magenta Stay | Solo se create in AvaiBook | AvaiBook / sito | Come pratica AvaiBook | Sì (API) | Canale più conveniente |
| Rentalia | Offerte AvaiBook auto | AvaiBook → Offerte | Da annuncio/AvaiBook | Sì | Inserzionista “michela” da verificare |
| Booking.com | Genius / promo solo su Booking | Extranet Booking | Policy su Booking | Prezzi sì; promo **no** | Compilare % Agreement |
| Airbnb | Solo LM/Early/Long via set regole | AvaiBook → Airbnb → Set di regole | Policy Airbnb | Prezzi sì; offerte via set regole | Non duplicare promo su Airbnb |
| HomeToGo | Verificare sync | AvaiBook se collegato | Da annuncio | Dipende da CM | Confermare prezzo = AvaiBook |
| VRBO / Expedia | Promo ~10% (early, LM, mobile, iscritti, nuova struttura) — non cumulabili | Solo VRBO | Federica: valutare 5 giorni flessibile | Via AvaiBook XML se collegato | Instant Booking impostata; rispondere a Federica cosa attivato |
| HousingAnywhere | Promo −15% su HA | Solo HA | Rigida (&lt;24h / dopo no rimborso) | No | Strategia mid-term vs turistico da decidere |

---

## Check prezzi per date

Compilare i totali OTA **a parità di date** con AvaiBook (2 ospiti).

| Check-in | Check-out | Ospiti | AvaiBook tot € | AvaiBook €/notte | Rentalia | Booking | Airbnb | HomeToGo | VRBO | Allineati? | Note | Verificato il |
|---|---|---:|---:|---:|---|---|---|---|---|---|---|---|
| 2026-10-20 | 2026-10-22 | 2 | 175,92 | 87,96 | | | | | | | Compilare OTA | |
| 2026-11-10 | 2026-11-12 | 2 | 175,92 | 87,96 | | | | | | | Compilare OTA | |
| 2026-12-05 | 2026-12-07 | 2 | 259,26 | 129,63 | | | | | | | Compilare OTA | |
| | | | | | | | | | | | | |

Rilevazioni automatiche parziali (2026-10-09, date 10–12 nov): Booking ~€156–170; Airbnb ~€205; Rentalia/HomeToGo/VRBO spesso bloccati da bot.

---

## Sconti / promo per periodo

Spunta dove l’offerta deve esserci (S/N).

| Nome offerta | Tipo | Canali | Parametro | % | Da | A | AvaiBook | Airbnb set regole | Booking | VRBO | HA | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| (es.) Early booking VRBO | Early | VRBO | secondo VRBO | 10% | | | N | N | N | S | N | Da mail Federica — non cumulabile |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |

---

## Campioni AvaiBook già rilevati

| Periodo | Ospiti | Totale | €/notte |
|---|---:|---:|---:|
| 10–12 nov 2026 | 2 | 175,92 € | 87,96 € |
| 5–7 dic 2026 | 2 | 259,26 € | 129,63 € |

- Rentalia pubblica “da 83 €/notte” (senza date).
- HousingAnywhere: 2.000 €/mese (~66 €/notte se /30) + promo −15%.

---

## Attenzione HousingAnywhere

È affitto **mid-term/mensile**, non short-term turistico.  
Se vuoi coerenza col prezzo turistico: ricalcola il mensile da AvaiBook (es. 87,96 × 30 ≈ **2.639 €**) oppure documenta una strategia prezzo diversa.

---

*Report Magenta Stay / Sanchioli 11 — formato Markdown (leggibile in Cursor). Sostituisce il foglio Excel multi-colonna come vista principale.*
