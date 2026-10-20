# Come mettere online Lento — guida passo passo

Questa guida è per chi non è tecnico. Non devi installare nulla né scrivere codice: si fa tutto dal browser, in circa **30 minuti**.

Userai tre servizi:

- **GitHub** — dove è custodito il codice del sito (ce l'hai già);
- **Vercel** — il servizio che pubblica il sito su internet;
- **Neon** — il database dove si salvano ordini e clienti trade. Lo crei da dentro Vercel, senza un account separato.

> I nomi dei pulsanti potrebbero cambiare leggermente nel tempo. Se non trovi esattamente una scritta, cerca quella più simile. Nel dubbio, fermati e chiedimi.

---

## Parte 1 — Unire il codice su GitHub (5 minuti)

Il sito è pronto in una "pull request", cioè una proposta di modifica. Va approvata e unita al ramo principale (`main`).

1. Apri il link della pull request che ti ho dato e accedi a GitHub, se te lo chiede.
2. Scorri in fondo alla pagina e clicca il pulsante verde **Merge pull request**.
3. Clicca **Confirm merge**. Compare la scritta viola *Merged*.
4. In alto nella pagina del repository clicca la scheda **Settings** (icona a ingranaggio).
5. Nella sezione **Default branch** clicca l'icona con le due frecce ⇄ accanto al nome del ramo.
6. Nel menu scegli **main** e clicca **Update**.
7. Conferma con **I understand, update the default branch**.

Da adesso `main` è la versione ufficiale del sito: ogni volta che cambia, Vercel aggiornerà il sito da solo.

---

## Parte 2 — Preparare tre valori (2 minuti)

Apri un blocco note e scrivici questi tre valori. Ti serviranno tra poco.

| Nome | Cosa scrivere |
| --- | --- |
| `AUTH_SECRET` | Una chiave segreta. Apri **https://generate-secret.vercel.app/32**: compare una stringa casuale, copiala. |
| `ADMIN_EMAIL` | La tua e-mail. Servirà per entrare nella pagina di amministrazione. |
| `ADMIN_PASSWORD` | Una password di **almeno 10 caratteri**, solo per te. |

> Non condividere `AUTH_SECRET` e `ADMIN_PASSWORD` con nessuno: sono le chiavi del sito.

---

## Parte 3 — Creare l'account Vercel (3 minuti)

1. Vai su **https://vercel.com** e clicca **Sign Up**.
2. Scegli il piano **Hobby** (gratuito) e scrivi il tuo nome.
3. Clicca **Continue with GitHub**, poi **Authorize Vercel** per collegare il tuo account GitHub.

> **Importante:** il piano Hobby è gratuito ma pensato per progetti personali. Va benissimo per provare e mostrare il sito. Quando il negozio inizierà a vendere davvero, Vercel richiede il piano **Pro**, a pagamento: basta cambiarlo dalle impostazioni, senza rifare nulla.

---

## Parte 4 — Pubblicare il sito (5 minuti)

1. Nella dashboard di Vercel clicca **Add New…** (in alto a destra), poi **Project**.
2. Nell'elenco "Import Git Repository" trova **blendmatch** e clicca **Import**.
   - *Non lo vedi?* Clicca **Adjust GitHub App Permissions** (o **Configure GitHub App**), scegli il repository **blendmatch**, clicca **Save** e torna alla pagina.
3. Si apre la pagina **Configure Project**. Alla voce **Framework Preset** deve esserci **Next.js**: non toccare le altre impostazioni.
4. Apri la sezione **Environment Variables** e aggiungi i tre valori della Parte 2, uno alla volta:
   - in **Key** scrivi il nome (per esempio `AUTH_SECRET`);
   - in **Value** incolla il valore;
   - clicca **Add**.

   Alla fine devono esserci tre righe: `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Attento alle maiuscole e a non lasciare spazi.
5. Clicca **Deploy**. Aspetta 2–3 minuti: quando vedi i coriandoli, il sito è online.
6. Clicca **Continue to Dashboard**.

Il sito ora è visibile, ma carrello, checkout e area Trade **non funzionano ancora**: manca il database. Lo colleghiamo adesso.

---

## Parte 5 — Collegare il database (5 minuti)

1. Nella pagina del progetto clicca la scheda **Storage** in alto.
2. Clicca **Create Database** (o **Connect Database**).
3. Scegli **Neon** (Serverless Postgres) e clicca **Continue**.
4. Se te lo chiede, accetta le condizioni di Neon.
5. Nelle opzioni:
   - **Region**: scegli **Frankfurt** (Germania, `eu-central-1`). È vicina ai tuoi clienti europei e al sito.
   - **Plan**: **Free**.
   - **Database name**: per esempio `lento-db`.

   Poi clicca **Create** (o **Continue**).
6. Nella finestra **Connect to project**:
   - lascia spuntati tutti gli ambienti (*Development*, *Preview*, *Production*);
   - lascia **vuoto** il campo *Custom Prefix* (se c'è);
   - clicca **Connect**.

Vercel ha ricevuto da solo l'indirizzo del database: non devi copiare niente.

---

## Parte 6 — Ripubblicare con il database (3 minuti)

Bisogna ripubblicare il sito perché "veda" il database. Durante questa operazione il sito crea le tabelle e il tuo account di amministratore.

1. Clicca la scheda **Deployments**.
2. Sulla prima riga dell'elenco clicca i tre puntini **⋯** a destra.
3. Scegli **Redeploy**, poi conferma con **Redeploy**.
4. Aspetta 2–3 minuti, finché lo stato diventa **Ready** (pallino verde).

---

## Parte 7 — Provare il sito (5 minuti)

1. Clicca la scheda **Overview**, poi **Visit** (o l'anteprima del sito). Si apre un indirizzo simile a `blendmatch-xxxx.vercel.app`: è il tuo sito.
2. Conferma di avere 18 anni, metti un vino nel carrello e completa il checkout. Il pagamento è simulato: nessuna carta viene addebitata.
3. Entra come amministratore: aggiungi `/it/trade/login` in fondo all'indirizzo (per esempio `blendmatch-xxxx.vercel.app/it/trade/login`), accedi con `ADMIN_EMAIL` e `ADMIN_PASSWORD`, poi vai su `/it/admin`.
4. Da un'altra finestra in navigazione privata compila il modulo "Richiedi un account trade" in `/it/trade`. La richiesta comparirà nella pagina admin, pronta da approvare.

Fatto: il sito è online. 🎉

---

## Dopo: cose utili

**Il tuo dominio (es. `lento.wine`)**
1. Nel progetto Vercel: **Settings** → **Domains** → scrivi il dominio → **Add**.
2. Vercel ti mostra uno o due valori da copiare nel pannello del sito dove hai comprato il dominio (Aruba, Register.it, GoDaddy…).
3. Quando il dominio funziona: **Settings** → **Environment Variables** → aggiungi `NEXT_PUBLIC_SITE_URL` con valore `https://lento.wine` (il tuo dominio) → poi **Redeploy** come nella Parte 6.

**Aggiornamenti futuri**
Quando ti preparo una modifica, la trovi come nuova pull request su GitHub. Approvarla con **Merge** (Parte 1, punti 2–3) basta: Vercel pubblica la nuova versione da solo in pochi minuti. Ogni pull request ha anche un link di **anteprima** per vedere la modifica prima di approvarla.

**Cambiare la password di amministratore**
La password viene usata solo per creare l'account la prima volta. Cambiarla in Vercel non aggiorna l'account già creato: chiedimi e ti preparo il modo per cambiarla.

---

## Se qualcosa va storto

- **Il deploy è rosso ("Error" / "Failed")**: clicca sul deploy, poi su **Build Logs**. Copia le ultime righe e mandamele.
- **Non riesco a entrare come amministratore**: controlla in **Settings** → **Environment Variables** che `ADMIN_EMAIL` e `ADMIN_PASSWORD` siano scritti esattamente così, poi rifai la Parte 6. La password deve avere almeno 10 caratteri.
- **Il carrello o l'area Trade danno errore**: probabilmente il database non è collegato. Controlla la scheda **Storage** (Parte 5) e rifai la Parte 6.
- **Una scritta della guida non corrisponde a quella che vedi**: fammi uno screenshot e ti dico dove cliccare.
