# Integrazione AvaiBook (Owner API)

Docs: https://api.avaibook.com/doc/owner/ · Swagger: https://api.avaibook.com/doc/owner/api/

## Cosa fa il sito
- Proxy PHP: `/api/avaibook/proxy.php` (il token **non** va in JavaScript)
- UI sull’annuncio: `js/booking.js`
  1. Date → disponibilità + prezzo (GET)
  2. Nome/email → crea la pratica in AvaiBook (`POST /api/owner/bookings/`)
  3. Messaggio nel **channel** di quella prenotazione (`POST /api/owner/messages/`)

Senza una prenotazione non esiste una chat: il sito crea la pratica, poi scrive nel thread.

## Config (Mac + Aruba, mai su GitHub)

```bash
cd "/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"
cp api/avaibook/config.sample.php api/avaibook/config.php   # solo la prima volta
```

In `config.php`:
- `token` = chiave **owner** (icona Copia in Configurazione API)
- `env` = `com` · `base_url` = `https://api.avaibook.com`
- `default_accommodation_id` = `408300`
- `allow_direct_booking` = `true`
- `booking_status` = `PENDING_PAYMENT` (tu confermi nel channel) oppure `CONFIRMED`
- `default_unit_id` = vuoto (rilevato in automatico) oppure ID unità AvaiBook
- `booking_engine_url` = opzionale, link “Pubblicare sul mio sito”

Non sovrascrivere `config.php` dallo sync GitHub.

## Check
- `https://www.magentastay.it/api/avaibook/proxy.php?action=ping` → `ok: true`
- `?action=accommodations` → elenco case + `units[].id`
- Scheda Sanchioli 11 → date libere → nome/email → **Invia richiesta**
- In AvaiBook: nuova pratica origine `API_OWNER` e messaggio nel channel

## Certificazione
`POST /bookings/` e `POST /messages/` su `.com` funzionano dopo il form AvaiBook + test su `.biz`.  
Se il sito risponde `not_certified`, completa la certificazione; calendario e prezzo restano comunque attivi.

Pre-produzione: login https://app.avaibook.biz/login.php · `base_url` `https://api.avaibook.biz` · `env` => `biz`

## Endpoint

| Azione sito | API AvaiBook |
|-------------|--------------|
| Elenco case | `GET /api/owner/accommodations/` |
| Calendario | `GET /api/owner/accommodations/{id}/calendar/` |
| Disponibilità | `GET /api/owner/accommodations/{id}/availability/` |
| Prezzo | `GET /api/owner/accommodations/{id}/booking-price/` |
| Crea pratica | `POST /api/owner/bookings/` |
| Messaggio channel | `POST /api/owner/messages/` `{ booking_id, message }` |
| Leggi chat | `GET /api/owner/messages/booking/{booking}` |

Auth: `X-AUTH-TOKEN`. Limite AvaiBook: 100 richieste/minuto. Il proxy limita 6 prenotazioni/ora per IP.

## Sicurezza
- `config.php` è in `.gitignore`
- Il totale lo ricalcola il server da AvaiBook (il browser non lo decide)
- Date ricontrollate prima di creare la pratica
- Non pubblicare il token in chat o nel frontend

## FileZilla
`api/avaibook/proxy.php`, `api/avaibook/config.php` (solo se manca), `js/booking.js`, `css/main.css`, pagine `strutture/sanchioli-11/`
