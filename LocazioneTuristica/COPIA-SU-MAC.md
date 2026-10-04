# Backup Mac + upload Aruba

**Importante:** `api/avaibook/config.php` (token AvaiBook) **non è su GitHub** e **non va mai sovrascritto** dallo sync.

## 1) Aggiorna SEMPRE dal branch GitHub (incolla nel Terminale Mac)

```bash
setopt NULL_GLOB
DEST="/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"

rm -rf /tmp/sysmo-lt
git clone --branch cursor/locazione-turistica-sanchioli-9e06 --single-branch \
  https://github.com/fabiopulina/sysmo.git /tmp/sysmo-lt

mkdir -p "$DEST"
rsync -a --delete /tmp/sysmo-lt/LocazioneTuristica/ "$DEST/" \
  --exclude 'api/avaibook/config.php' \
  --exclude 'Foto/' \
  --exclude 'foto/' \
  --exclude 'immagini/sanchioli-11/*.jpg' \
  --exclude 'immagini/sanchioli-11/*.jpeg' \
  --exclude 'immagini/sanchioli-11/_backup*' \
  --exclude '.DS_Store'

# Se manca ancora il config AvaiBook (solo la prima volta):
# cp "$DEST/api/avaibook/config.sample.php" "$DEST/api/avaibook/config.php"
# poi apri config.php e incolla il token

test -f "$DEST/api/avaibook/config.php" \
  && echo "config.php OK (preservato)" \
  || echo "ATTENZIONE: crea config.php dal sample"

echo "Verifica:"
ls "$DEST/js/booking.js" "$DEST/en" "$DEST/de" "$DEST/fr"
open "$DEST"
```

Oppure lancia lo script:
```bash
bash "/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica/COPIA-SU-MAC.sh"
```
(dopo il primo sync: lo script è nella cartella del sito)

`--delete` allinea il Mac a GitHub, ma **esclude sempre** `config.php`, `Foto/` e le JPEG di `immagini/sanchioli-11/` (così uno sync non cancella le foto sul Mac).

## 1b) Carica le foto appartamento su GitHub (dal Mac)

La cartella `Documents/.../LocazioneTuristica` **non è** il repo git. Incolla questo:

```bash
SRC="$HOME/Documents/Progetti/Siti Web/LocazioneTuristica/immagini/sanchioli-11"
REPO="$HOME/Documents/Progetti/sysmo"

if [ ! -d "$REPO/.git" ]; then
  git clone https://github.com/fabiopulina/sysmo.git "$REPO"
fi
cd "$REPO"
git fetch origin
git checkout cursor/locazione-turistica-sanchioli-9e06
git pull origin cursor/locazione-turistica-sanchioli-9e06

mkdir -p LocazioneTuristica/immagini/sanchioli-11
cp -f "$SRC"/foto-*.jpg LocazioneTuristica/immagini/sanchioli-11/
ls LocazioneTuristica/immagini/sanchioli-11/foto-*.jpg | wc -l

git add LocazioneTuristica/immagini/sanchioli-11/foto-*.jpg
git status
git commit -m "Add Sanchioli 11 photos foto-00 to foto-20."
git push origin cursor/locazione-turistica-sanchioli-9e06
```

Atteso: 21 file (`foto-00.jpg` … `foto-20.jpg`). Non toccare `config.php`.

## 2) Poi ricarica su Aruba (FileZilla)

Cartella remota: `www.magentastay.it`

Trascina da `$DEST` (sovrascrivi):
`index.html`, `css/`, `js/` (incluso `booking.js`), `strutture/`, `en/`, `de/`, `fr/`, `contatti/`, `api/` (proxy + sample), landing, `robots.txt`, `sitemap.xml`, `.htaccess`

**Foto appartamento:** carica tutta `immagini/sanchioli-11/` (`foto-00.jpg` copertina … `foto-20.jpg`), oppure attendi il deploy FTP da GitHub dopo il push.

**Su Aruba:**
- Carica `api/avaibook/config.php` **solo se** non c’è già, oppure se hai aggiornato il token a mano.
- Non sostituirlo con il `config.sample.php` di GitHub.

## 3) Check sul sito live

- `https://www.magentastay.it/api/avaibook/proxy.php?action=ping` → `ok: true`
- Scheda Sanchioli 11 → date libere → nome/email → **Invia richiesta** → pratica nel channel AvaiBook
- Hard refresh: `Cmd+Shift+R` (o scheda privata)

## AvaiBook
Vedi `AVAIBOOK.md`. Il token sta **solo** in `api/avaibook/config.php` (Mac + Aruba), mai in chat / GitHub.
