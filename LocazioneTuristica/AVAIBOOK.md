# Integrazione AvaiBook (Owner API)

## Cosa abbiamo già nel sito
- Proxy PHP sicuro: `/api/avaibook/proxy.php` (il token **non** va in JavaScript)
- UI prenotazione sull’annuncio: `js/booking.js` (date → disponibilità + prezzo)
- Config di esempio: `api/avaibook/config.sample.php`

## Passi per te (produzione .com)

1. Login: https://app.avaibook.com/login.php
2. Apri **Configurazione API** e clicca l’icona **Copia** sul token della chiave `owner`
   (NON incollare il token in chat / GitHub)
3. Sul Mac, nella cartella del sito:
   ```bash
   cd "/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"
   cp api/avaibook/config.sample.php api/avaibook/config.php
   ```
   Apri `config.php` e inserisci:
   - `token` = valore copiato (chiave owner)
   - `env` = `com`
   - `base_url` = `https://api.avaibook.com`
   - `default_accommodation_id` = `408300` (ID alloggio Sanchioli 11)
4. Carica su Aruba (FileZilla) la cartella `api/` (con `config.php`) + `js/booking.js` + pagine struttura aggiornate
5. Apri nel browser:
   `https://www.magentastay.it/api/avaibook/proxy.php?action=ping`  
   → deve rispondere `ok: true`
6. Controllo strutture:
   `https://www.magentastay.it/api/avaibook/proxy.php?action=accommodations`
7. Ricarica `https://www.magentastay.it/strutture/sanchioli-11/` e prova check-in/out

### Pre-produzione (.biz) — solo se AvaiBook te lo chiede per i test
Login: https://app.avaibook.biz/login.php · base: `https://api.avaibook.biz` · `env` => `biz`

## Endpoint usati
Auth header: `X-AUTH-TOKEN`

| Azione sito | API AvaiBook |
|-------------|--------------|
| Elenco case | `GET /api/owner/accommodations/` |
| Calendario occupato | `GET /api/owner/accommodations/{id}/calendar/` |
| Disponibilità range | `GET /api/owner/accommodations/{id}/availability/` |
| Prezzo | `GET /api/owner/accommodations/{id}/booking-price/` |

Docs interattive: https://api.avaibook.biz/doc/owner/api

## Produzione
Quando certificati, in `config.php`:
```php
'env' => 'com',
'base_url' => 'https://api.avaibook.com',
'token' => 'TOKEN_PRODUZIONE',
```

## Sicurezza
- `config.php` è in `.gitignore` — non committarlo su GitHub
- Non pubblicare mai il token in chat o nel frontend

## Fase 2 (dopo)
Creazione prenotazioni `POST /api/owner/bookings/` + pagamento test (.biz) e certificazione AvaiBook.
