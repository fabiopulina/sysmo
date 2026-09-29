# Integrazione AvaiBook (Owner API)

## Cosa abbiamo già nel sito
- Proxy PHP sicuro: `/api/avaibook/proxy.php` (il token **non** va in JavaScript)
- UI prenotazione sull’annuncio: `js/booking.js` (date → disponibilità + prezzo)
- Config di esempio: `api/avaibook/config.sample.php`

## Passi per te (pre-produzione .biz)

1. Controlla l’email AvaiBook: password per `fabio.pulina@outlook.com`
2. Login: https://app.avaibook.biz/login.php
3. Apri il token: https://app.avaibook.biz/herramientas_api_rest_datos.php  
   Copia l’**API Key / X-AUTH-TOKEN**
4. Sul Mac, nella cartella del sito:
   ```bash
   cd "/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"
   cp api/avaibook/config.sample.php api/avaibook/config.php
   ```
   Apri `config.php` e inserisci:
   - `token` = API Key
   - `base_url` = `https://api.avaibook.biz`
   - `default_accommodation_id` = (lo trovi al passo 5)
5. Carica su Aruba (FileZilla) la cartella `api/` (con `config.php`) + `js/booking.js` + pagine struttura aggiornate
6. Apri nel browser:
   `https://www.magentastay.it/api/avaibook/proxy.php?action=ping`  
   → deve rispondere `ok: true`
7. Elenco strutture AvaiBook:
   `https://www.magentastay.it/api/avaibook/proxy.php?action=accommodations`  
   → copia l’`id` numerico di Sanchioli 11
8. Metti quell’id in:
   - `api/avaibook/config.php` → `default_accommodation_id`
   - e/o `js/listings.js` → `avaibookPropertyId`
   - e/o `data-avaibook-property-id` / `data-avaibook-id` nella pagina struttura
9. Ricarica `https://www.magentastay.it/strutture/sanchioli-11/` e prova check-in/out

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
