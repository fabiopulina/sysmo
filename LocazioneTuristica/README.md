# Magenta Stay

Sito statico per `https://www.magentastay.it`.

## Menu
Solo **Annunci** (elenco strutture) e link alle schede (es. Sanchioli 11).
Le landing SEO (Fiera / Malpensa / …) restano per Google, non nel menu.

## Messaggio chiave
**15 min Rho Fiera · 20 min Malpensa** — anche in inglese (`/en/`) per ospiti esteri.

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

Il Mac resta solo backup: non serve più caricare a mano da Finder.
