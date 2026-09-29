# Backup Mac + upload Aruba

**Importante:** su Aruba e sul Mac potresti avere ancora una copia **vecchia**.
Su GitHub ci sono già: **IT / EN / DE / FR** in header + **lightbox** con frecce ◀ ▶.

## 1) Aggiorna SEMPRE dal branch GitHub (incolla nel Terminale Mac)

```bash
setopt NULL_GLOB
DEST="/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"

rm -rf /tmp/sysmo-lt
git clone --branch cursor/locazione-turistica-sanchioli-9e06 --single-branch \
  https://github.com/fabiopulina/sysmo.git /tmp/sysmo-lt

mkdir -p "$DEST"
rsync -a --delete /tmp/sysmo-lt/LocazioneTuristica/ "$DEST/" \
  --exclude 'Foto/' \
  --exclude '.DS_Store'

echo "Verifica lingue + lightbox:"
ls "$DEST/en" "$DEST/de" "$DEST/fr"
ls "$DEST/js/lightbox.js"
rg -n "lang--nav|lightbox.js" "$DEST/index.html" "$DEST/strutture/sanchioli-11/index.html" | head

open "$DEST"
```

`--delete` allinea il Mac a GitHub (non tocca `Foto/`).

## 2) Poi ricarica TUTTO su Aruba (FileZilla)

Cartella remota: `www.magentastay.it`

Trascina da `$DEST` (sovrascrivi):
`index.html`, `css/`, `js/` (**incluso lightbox.js**), `immagini/`, `strutture/`, `en/`, `de/`, `fr/`, `contatti/`, `vendor/`, landing, `robots.txt`, `sitemap.xml`, `.htaccess`

## 3) Check sul sito live

- In alto a destra: **IT EN DE FR**
- Su Sanchioli 11: click foto → overlay con **frecce** per scorrere
- Hard refresh: `Cmd+Shift+R`

## Attenzione cartella EN
Su Aruba la home `/en/` era ancora una **landing vecchia** (diversa da IT/DE/FR).
Dopo lo sync Mac, in FileZilla **cancella** sul server la cartella `en` e ricaricala intera da Mac, oppure sovrascrivi per forza `en/index.html`.
Verifica che in https://www.magentastay.it/en/ ci siano le sezioni Mappa, Why Magenta, Gamba de Legn, Ticino, Listings (non solo una pagina corta “Why Magenta beats downtown…”).


## AvaiBook (dopo sync)
Carica anche `api/` su Aruba, ma **crea `config.php` solo in locale/Mac** (non da GitHub):
```bash
cp api/avaibook/config.sample.php api/avaibook/config.php
# edita token + accommodation id
```
Vedi `AVAIBOOK.md`.
