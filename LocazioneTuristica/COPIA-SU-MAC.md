# Copia sul Mac

Da questo Cloud Agent **non** posso scrivere in `/Users/fabio/...`.
Esegui sul **tuo Mac** (Terminale):

```bash
mkdir -p "/Users/fabio/Documents/Progetti/Siti Web"
cd "/Users/fabio/Documents/Progetti/Siti Web"

# Se la cartella LocazioneTuristica esiste già (con le tue foto), NON cancellarla.
# Clona il repo in una cartella temporanea e copia i file del sito:

git clone --branch cursor/locazione-turistica-sanchioli-9e06 --single-branch \
  https://github.com/fabiopulina/sysmo.git /tmp/sysmo-lt

mkdir -p LocazioneTuristica
rsync -a /tmp/sysmo-lt/LocazioneTuristica/ LocazioneTuristica/ \
  --exclude 'immagini/sanchioli-11/'

# Poi copia le TUE foto dalla sottocartella dove le hai salvate:
# (sostituisci NOME_SOTTOCARTELLA, es. Foto oppure foto oppure Originali)

mkdir -p LocazioneTuristica/immagini/sanchioli-11
cp LocazioneTuristica/NOME_SOTTOCARTELLA/*.{jpg,JPG,jpeg,JPEG,webp,WEBP} \
  LocazioneTuristica/immagini/sanchioli-11/ 2>/dev/null || true

# Oppure lancia lo script automatico (cerca cartelle foto/Foto/photos):
# bash /tmp/sysmo-lt/LocazioneTuristica/COPIA-SU-MAC.sh
```

Se mi dici il **nome esatto** della sottocartella delle foto (es. `Foto`, `IMG_Sanchioli`), preparo il comando preciso.
