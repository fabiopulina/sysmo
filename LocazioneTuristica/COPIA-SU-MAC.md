# Fix sync Mac (zsh)

Esegui **tutto questo blocco** nel Terminale (una sola volta).

```bash
setopt NULL_GLOB
cd "/Users/fabio/Documents/Progetti/Siti Web"

# 1) Dove sono le foto?
echo "=== contenuto Siti Web ==="
ls -la
echo "=== contenuto LocazioneTuristica (se c'è) ==="
ls -la LocazioneTuristica 2>/dev/null || echo "(non esiste ancora)"
echo "=== cerca cartelle Foto ==="
find . -maxdepth 3 -type d -name 'Foto' 2>/dev/null
echo "=== file immagine trovati ==="
find . -maxdepth 4 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.heic' -o -iname '*.png' -o -iname '*.webp' \) 2>/dev/null | head -40

# 2) Aggiorna il sito da GitHub
rm -rf /tmp/sysmo-lt
git clone --branch cursor/locazione-turistica-sanchioli-9e06 --single-branch \
  https://github.com/fabiopulina/sysmo.git /tmp/sysmo-lt

mkdir -p LocazioneTuristica
rsync -a /tmp/sysmo-lt/LocazioneTuristica/ LocazioneTuristica/ \
  --exclude 'immagini/sanchioli-11/' \
  --exclude 'Foto/'

# 3) Copia foto da LocazioneTuristica/Foto (se presente)
mkdir -p LocazioneTuristica/immagini/sanchioli-11
rm -f LocazioneTuristica/immagini/sanchioli-11/foto-*

FOTO_DIR=""
if [ -d "LocazioneTuristica/Foto" ]; then
  FOTO_DIR="LocazioneTuristica/Foto"
elif [ -d "Foto" ]; then
  FOTO_DIR="Foto"
fi

echo "Cartella foto usata: ${FOTO_DIR:-NON TROVATA}"
if [ -n "$FOTO_DIR" ]; then
  ls -la "$FOTO_DIR"
  i=1
  for f in "$FOTO_DIR"/*; do
    [ -f "$f" ] || continue
    case "${f:l}" in
      *.jpg|*.jpeg|*.png|*.webp|*.heic)
        printf -v n "%02d" "$i"
        ext="${f##*.}"
        ext="${ext:l}"
        # HEIC: meglio convertire in jpg sul Mac; per ora copia com'è
        cp -f "$f" "LocazioneTuristica/immagini/sanchioli-11/foto-${n}.${ext}"
        i=$((i+1))
        ;;
    esac
  done
  echo "Copiate $((i-1)) foto"
  ls -la LocazioneTuristica/immagini/sanchioli-11 | head
else
  echo "Metti le foto in:"
  echo "  /Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica/Foto"
fi

open "/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"
```

Incolla qui l’output delle sezioni `===` (soprattutto dove trova `Foto` e i file immagine).
