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

## Certificazione (cosa fare tu)

Senza questo, calendario e prezzo funzionano; **Invia richiesta** può rispondere `not_certified`.
Serve piano **Pro o Elite**. Risposta AvaiBook: 24–72 ore (`api.support@avaibook.com`).

1. **Form**  
   Nel conto AvaiBook: **Integrazioni → API → Form**  
   (è lo stesso modulo Microsoft che hai aperto).  
   Scrivi in sintesi: sito proprio `https://www.magentastay.it`, alloggio Sanchioli 11 (`408300`), il sito deve **creare prenotazioni** e **inviare messaggi nel channel** (Owner API `POST /bookings/` e `POST /messages/`). Sviluppatore: tu / Magenta Stay. Email con cui vuoi l’ambiente di test.
2. **Attendi l’email** con accesso a **pre-produzione** `.biz` (password + API key di test). Login: https://app.avaibook.biz/login.php
3. **Test** (solo sul Mac, non sul sito live): in `config.php` temporaneamente  
   `env` = `biz` · `base_url` = `https://api.avaibook.biz` · `token` = chiave **.biz**  
   Poi dalla scheda annuncio: date libere → nome/email → Invia richiesta. In AvaiBook `.biz` deve comparire la pratica e il messaggio nel channel.
4. **Scrivi ad AvaiBook** (`api.support@avaibook.com`): test ok, chiedi la certificazione e l’attivazione sul conto **reale** `.com`.
5. **Produzione:** rimetti `config.php` su  
   `env` = `com` · `base_url` = `https://api.avaibook.com` · `token` = chiave **owner** del conto vero.  
   Non caricare su Aruba il token `.biz`. Non sovrascrivere il `config.php` già presente su Aruba.

Docs: https://api.avaibook.com/doc/owner/ · prova chiamate: https://api.avaibook.com/doc/owner/api/

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
