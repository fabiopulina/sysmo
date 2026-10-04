# Magenta Stay

Sito statico per `https://www.magentastay.it`.

## Menu
Solo **Annunci** (elenco strutture) e link alle schede (es. Sanchioli 11).
Le landing SEO (Fiera / Malpensa / …) restano per Google, non nel menu.

## Messaggio chiave
**15 min Rho Fiera · 20 min Malpensa** — anche in inglese (`/en/`) per ospiti esteri.

## Foto Sanchioli 11
JPEG in `immagini/sanchioli-11/` (`foto-00.jpg` copertina … `foto-20.jpg`).
Si caricano su GitHub dal Mac (comandi in `COPIA-SU-MAC.md`).
Il codice elenca tutte e 21 le foto; oltre `foto-20` la gallery le trova da sola.

## Deploy GitHub → Aruba FTP
Workflow: `.github/workflows/deploy-aruba-ftp.yml`

Aggiungi in GitHub → Settings → Secrets and variables → Actions:

| Secret | Esempio |
|--------|---------|
| `ARUBA_FTP_HOST` | `89.46.110.19` |
| `ARUBA_FTP_USER` | utente FTP Aruba |
| `ARUBA_FTP_PASSWORD` | password FTP |
| `ARUBA_FTP_REMOTE_DIR` | `/www.magentastay.it/` |

Poi: Actions → “Deploy Magenta Stay to Aruba FTP” → Run workflow  
oppure push su questo branch.

Le JPEG di Magenta/Ticino e (dopo il push dal Mac) anche Sanchioli 11 stanno nel repo.
