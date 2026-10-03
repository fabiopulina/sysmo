#!/bin/bash
# Esegui questo script sul tuo Mac (Terminale).
# Copia il sito da GitHub in Documents.
# NON sovrascrive mai api/avaibook/config.php (token AvaiBook).

set -euo pipefail

DEST="/Users/fabio/Documents/Progetti/Siti Web/LocazioneTuristica"
REPO_URL="https://github.com/fabiopulina/sysmo.git"
BRANCH="cursor/locazione-turistica-sanchioli-9e06"
TMP="/tmp/sysmo-lt"

# Sempre esclusi dallo sync GitHub → Mac
RSYNC_EXCLUDES=(
  --exclude 'api/avaibook/config.php'
  --exclude 'Foto/'
  --exclude 'foto/'
  --exclude '.DS_Store'
)

echo "Clono branch $BRANCH..."
rm -rf "$TMP"
git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$TMP"

mkdir -p "$DEST"

if [ -f "$DEST/api/avaibook/config.php" ]; then
  echo "OK: config.php locale presente — verrà preservato."
else
  echo "AVVISO: manca $DEST/api/avaibook/config.php"
  echo "         Dopo lo sync: cp api/avaibook/config.sample.php api/avaibook/config.php"
fi

echo "Allineo $DEST a GitHub (senza toccare config.php / Foto)..."
rsync -a --delete "${RSYNC_EXCLUDES[@]}" \
  "$TMP/LocazioneTuristica/" "$DEST/"

# Protezione extra: se uno sync precedente avesse creato un config.php da sample, non toccare quello esistente
if [ -f "$DEST/api/avaibook/config.php" ]; then
  echo "config.php intatto: $DEST/api/avaibook/config.php"
fi

echo ""
echo "Verifica rapida:"
ls "$DEST/js/booking.js" "$DEST/strutture/sanchioli-11/index.html" 2>/dev/null || true
test -f "$DEST/api/avaibook/config.php" && echo "config.php: PRESENTE (non sovrascritto)" || echo "config.php: ASSENTE — crealo dal sample"

echo ""
echo "Fatto. Apri: $DEST"
open "$DEST" 2>/dev/null || true
