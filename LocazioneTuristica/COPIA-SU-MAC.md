# Backup Mac + upload Aruba (da casa)

Il Cloud Agent / GitHub Actions non può caricare bene su Aruba col filtro IP.
Flusso: **GitHub → Mac (backup) → FileZilla (IP casa) → Aruba**.

## 1) Aggiorna la copia sul Mac

Apri **Terminale** e incolla tutto:

```bash
setopt NULL_GLOB
DEST="/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"

rm -rf /tmp/sysmo-lt
git clone --branch cursor/locazione-turistica-sanchioli-9e06 --single-branch \
  https://github.com/fabiopulina/sysmo.git /tmp/sysmo-lt

mkdir -p "$DEST"
# Aggiorna i file del sito; non toccare una eventuale cartella Foto di backup
rsync -a /tmp/sysmo-lt/LocazioneTuristica/ "$DEST/" \
  --exclude 'Foto/' \
  --exclude '.DS_Store'

# Se hai ancora JPG in Foto/ e vuoi riallineare immagini/sanchioli-11:
if [ -d "$DEST/Foto" ]; then
  mkdir -p "$DEST/immagini/sanchioli-11"
  i=1
  for f in "$DEST/Foto"/*; do
    [ -f "$f" ] || continue
    case "${f:l}" in
      *.jpg|*.jpeg|*.png|*.webp)
        printf -v n "%02d" "$i"
        ext="${f##*.}"; ext="${ext:l}"
        cp -f "$f" "$DEST/immagini/sanchioli-11/foto-${n}.${ext}"
        i=$((i+1))
        ;;
    esac
  done
  echo "Foto allineate: $((i-1))"
fi

echo "Backup pronto in: $DEST"
ls "$DEST"
open "$DEST"
```

## 2) Carica su Aruba (FileZilla, dalla rete di casa)

| Campo | Valore |
|--------|--------|
| Host | `ftp.magentastay.it` |
| Utente | utente FTP Aruba |
| Password | password FTP |
| Porta | `21` |
| Modalità | passiva |

Cartella remota: **`www.magentastay.it`** (non `cgi-bin`).

**A sinistra (locale):**  
`/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica`

Seleziona e trascina a destra (sovrascrivi):
- `index.html`
- `css/` `js/` `vendor/`
- `immagini/`
- `strutture/`
- `en/` `de/` `fr/`
- `contatti/`
- `fiera-rho-expo/` `malpensa/` `milano/` `parco-ticino/`
- `robots.txt` `sitemap.xml` `.htaccess`

Poi, se sul server c’è ancora `index.php`, rinominalo in `index.php.bak`.

## 3) Verifica

Apri https://www.magentastay.it  
Devi vedere **Magenta Stay**, menu **Annunci**, foto visibili, testo **15 min Rho Fiera · 20 min Malpensa**.
