# Copia sul Mac

Da questo Cloud Agent **non** posso scrivere in `/Users/fabio/...`.
Esegui sul **tuo Mac** (Terminale).

Le tue foto sono in: `LocazioneTuristica/Foto`

```bash
mkdir -p "/Users/fabio/Documents/Progetti/Siti Web"
cd "/Users/fabio/Documents/Progetti/Siti Web"

git clone --branch cursor/locazione-turistica-sanchioli-9e06 --single-branch \
  https://github.com/fabiopulina/sysmo.git /tmp/sysmo-lt

mkdir -p LocazioneTuristica
rsync -a /tmp/sysmo-lt/LocazioneTuristica/ LocazioneTuristica/ \
  --exclude 'immagini/sanchioli-11/' \
  --exclude 'Foto/'

# Copia le tue foto dalla cartella Foto → immagini usate dal sito
mkdir -p LocazioneTuristica/immagini/sanchioli-11
rm -f LocazioneTuristica/immagini/sanchioli-11/foto-*
i=1
for f in LocazioneTuristica/Foto/*.{jpg,JPG,jpeg,JPEG,webp,WEBP,png,PNG}; do
  [ -f "$f" ] || continue
  printf -v n "%02d" "$i"
  ext="${f##*.}"
  ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  cp -f "$f" "LocazioneTuristica/immagini/sanchioli-11/foto-${n}.${ext}"
  i=$((i+1))
done
echo "Copiate $((i-1)) foto da Foto/ a immagini/sanchioli-11/"
open "/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"
```

Oppure, dopo il clone:

```bash
bash /tmp/sysmo-lt/LocazioneTuristica/COPIA-SU-MAC.sh
```

(lo script cerca prima la cartella `Foto`).
