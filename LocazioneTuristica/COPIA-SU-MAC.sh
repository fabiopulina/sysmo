#!/bin/bash
# Esegui questo script sul tuo Mac (Terminale).
# Copia il sito da GitHub in Documents e riusa le foto già salvate in una sottocartella.

set -euo pipefail

DEST="/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"
REPO_URL="https://github.com/fabiopulina/sysmo.git"
BRANCH="cursor/locazione-turistica-sanchioli-9e06"

mkdir -p "$(dirname "$DEST")"

if [ -d "$DEST/.git" ]; then
  echo "Aggiorno repo esistente..."
  git -C "$DEST" fetch origin
  git -C "$DEST" checkout "$BRANCH"
  git -C "$DEST" pull origin "$BRANCH"
elif [ -d "$DEST" ]; then
  echo "Cartella già presente senza git: clono in cartella temporanea e unisco i file (le tue foto restano)."
  TMP=$(mktemp -d)
  git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$TMP/sysmo"
  # Backup foto locali se presenti
  if [ -d "$DEST" ]; then
    find "$DEST" -type d \( -iname 'foto*' -o -iname 'immagini*' -o -iname 'photos*' -o -iname 'img*' \) 2>/dev/null | head -20
  fi
  rsync -a --ignore-existing "$TMP/sysmo/LocazioneTuristica/" "$DEST/"
  rsync -a "$TMP/sysmo/LocazioneTuristica/" "$DEST/" --exclude 'immagini/'
  # Se esistono già immagini utente, non sovrascrivere ovunque: copia struttura sito e poi foto
  rsync -a "$TMP/sysmo/LocazioneTuristica/css" "$TMP/sysmo/LocazioneTuristica/js" "$TMP/sysmo/LocazioneTuristica/strutture" \
    "$TMP/sysmo/LocazioneTuristica/fiera-rho-expo" "$TMP/sysmo/LocazioneTuristica/malpensa" \
    "$TMP/sysmo/LocazioneTuristica/milano" "$TMP/sysmo/LocazioneTuristica/parco-ticino" \
    "$TMP/sysmo/LocazioneTuristica/contatti" "$DEST/" 2>/dev/null || true
  cp -f "$TMP/sysmo/LocazioneTuristica/"*.html "$TMP/sysmo/LocazioneTuristica/"*.xml "$TMP/sysmo/LocazioneTuristica/"*.txt "$TMP/sysmo/LocazioneTuristica/".htaccess "$TMP/sysmo/LocazioneTuristica/"README.md "$DEST/" 2>/dev/null || true
  rm -rf "$TMP"
else
  echo "Clono il sito..."
  TMP=$(mktemp -d)
  git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$TMP/sysmo"
  mkdir -p "$DEST"
  rsync -a "$TMP/sysmo/LocazioneTuristica/" "$DEST/"
  rm -rf "$TMP"
fi

echo ""
echo "Cerco sottocartelle foto in: $DEST"
# Preferisci esplicitamente la cartella "Foto" (nome usato sul Mac di Fabio)
mkdir -p "$DEST/immagini/sanchioli-11"

SRC=""
if [ -d "$DEST/Foto" ]; then
  SRC="$DEST/Foto"
elif [ -d "$DEST/foto" ]; then
  SRC="$DEST/foto"
else
  PHOTO_DIRS=$(find "$DEST" -maxdepth 2 -type d \( -iname 'foto' -o -iname 'fotos' -o -iname 'photo' -o -iname 'photos' -o -iname 'img' -o -iname 'images' -o -iname 'originali' \) 2>/dev/null || true)
  if [ -n "${PHOTO_DIRS}" ]; then
    echo "Trovate cartelle foto:"
    echo "$PHOTO_DIRS"
    SRC=$(echo "$PHOTO_DIRS" | head -1)
  fi
fi

if [ -n "${SRC}" ]; then
  echo "Uso le foto da: $SRC"
  i=1
  # Preferisci jpg/jpeg/webp
  while IFS= read -r f; do
    printf -v n "%02d" "$i"
    ext="${f##*.}"
    ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    cp -f "$f" "$DEST/immagini/sanchioli-11/foto-${n}.${ext}"
    i=$((i+1))
  done < <(find "$SRC" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.png' \) | sort)
  echo "Copiate $((i-1)) foto in immagini/sanchioli-11/"
else
  echo "Nessuna cartella Foto trovata in: $DEST"
  echo "Metti le JPG in \"$DEST/Foto\" e rilancia lo script."
fi

echo ""
echo "Fatto. Apri: $DEST"
open "$DEST" 2>/dev/null || true
