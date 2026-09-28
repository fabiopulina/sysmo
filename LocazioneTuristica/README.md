# LocazioneTuristica (Sanchioli)

Sito vetrina statico per locazioni turistiche a Magenta (MI), ottimizzato SEO per:

- Fiera Milano Rho / Expo
- Aeroporto Malpensa
- Milano
- Parco del Ticino

## Struttura

- `index.html` — home portale multi-struttura
- `strutture/sanchioli-11/` — prima LT (Via Sanchioli 11)
- `fiera-rho-expo/`, `malpensa/`, `milano/`, `parco-ticino/` — landing SEO
- `immagini/` — foto JPG
- `css/`, `js/`

## Pubblicazione (Register / Aruba)

1. Copia tutto il contenuto di questa cartella nella `public_html` (o cartella web) dell’hosting.
2. Punta il dominio (es. `sanchioli.it`) e aggiorna i canonical / sitemap se il dominio è diverso.
3. Invia `sitemap.xml` in Google Search Console.

## AvaiBook

Nella scheda struttura, sezione `#prenota`, sostituisci il box placeholder con il widget / booking engine AvaiBook quando hai le credenziali API.

## Aggiungere un’altra LT

1. Crea `strutture/nome-struttura/index.html` (copia da sanchioli-11).
2. Aggiungi foto in `immagini/nome-struttura/`.
3. Collega la card nella home e aggiorna `sitemap.xml` + `js/main.js` (`SANCHIOLI_LISTINGS`).

## Brand / contatti da completare

- Dominio reale (ora placeholder `www.sanchioli.it`)
- Telefono / WhatsApp / email in `contatti/` e footer
- Eventuali foto proprietarie al posto di quelle scaricate dall’annuncio Airbnb
