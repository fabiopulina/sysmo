# Disponibilità Magenta — weekend EICMA 2026

Rilevazione: **sabato 7 novembre 2026**, ore ~16 (Europe/Rome)  
Metodo: ricerca Booking città Magenta (`dest_id=-120670`) + apertura schede competitor; Airbnb Magenta/search + listing nostro.

> Le date **già passate** (lun–ven 3–6 nov) risultano disabilitate sul calendario di **tutti** (passato), quindi **non** sono prova di affitto. Il segnale utile è la disponibilità **ancora prenotabile** per sabato 7 e domenica 8.

## Verdetto breve

Nel **sabato sera EICMA (7→8 nov)** la concorrenza appartamenti “solita” a Magenta risulta **quasi tutta non prenotabile** (assente dalla ricerca Magenta).  
**Suite Leonardo** è l’unica tra le peer abituali ancora chiaramente in vendita stasera.

La **domenica (8→9 nov)** invece diversi competitor Magenta (e anche Sanchioli 11) risultano **ancora liberi**: la domanda cala dopo il picco.

Tu (Sanchioli 11) **non compa** in ricerca Booking per sabato e su Airbnb sabato risulta non disponibile — coerente con “zero notti affittate” se il calendario era chiuso / vincolo min stay, non con un sold-out da prenotazione.

## Booking — ricerca Magenta

### Sabato 7 → domenica 8 (stasera)
Peer appartamenti tipici **assenti** dalla SERP Magenta:
- Sanchioli 11 (NOI)
- La Magnolia
- Caprotti 6
- Magenta Galleria, Casati47, Casa Pina, Les Maisons Manzoni, Appartamento Mino

**Presente e prenotabile:** Suite Leonardo (unica peer chiara; sulla scheda ha selettore camere).

In SERP restano soprattutto **hotel/motel** (Excelsior Magenta, Motel Europa, Diamante, Unico Hotel, …) e strutture fuori Magenta.

### Domenica 8 → lunedì 9
Di nuovo in SERP / prenotabili:
- **Sanchioli 11 (NOI)** — sì
- **La Magnolia** — sì
- **Caprotti 6** — sì
- **Suite Leonardo** — sì
- **Be Magenta Yellow** — sì

Ancora **assenti** (probabile ancora occupati o chiusi): Magenta Galleria, Casati47, Casa Pina, Les Maisons Manzoni, Appartamento Mino.

## Airbnb (campione)
- Magenta search sabato: poche card Magenta ancora in lista (≈4).
- Nostro listing sabato 7→8: **non disponibile**.
- Nostro listing domenica: messaggio urgenza (“restano solo N ore”), tipico di **ancora prenotabile**.

## Lettura business
1. **Sì: la concorrenza Magenta ha riempito il sabato EICMA** (peer assenti dalla ricerca), mentre hotel locali hanno ancora camere.
2. **Tu non hai preso quel riempimento** — sabato non sei in vendita / non disponibile, domenica invece sì a ~92 €.
3. Il problema non è “Magenta vuota in EICMA”: è che **il sold-out degli altri non ti ha coinvolto** (prezzo/visibilità/calendario/min stay/canali).

## File grezzi
- `/opt/cursor/artifacts/ota-prices/search-names-sabato.json`
- `/opt/cursor/artifacts/ota-prices/search-names-domenica.json`
- `/opt/cursor/artifacts/ota-prices/eicma-avail-final.json`
- screenshot `avail-*.png`, `search-*.png` in `/opt/cursor/artifacts/ota-prices/`
