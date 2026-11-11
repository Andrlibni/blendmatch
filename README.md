# Lento — vini naturali italiani e Italian Food Treasures

E-commerce di **Lento** (nome provvisorio), importatore di vini naturali italiani e prodotti dei Italian Food Treasures per il Regno Unito e il Nord Europa (DK, SE, FI, NO, NL, BE, DE, AT, IE). Serve due pubblici: **privati (B2C)** e **ristoranti, enoteche e negozi (B2B / Trade)**.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · next-intl · Auth.js v5 · Prisma · Zod. Nessuna libreria UI: tutti i componenti sono scritti a mano.

---

## 1. Avvio in locale

> Per **mettere il sito online** senza competenze tecniche segui la guida [GUIDA-ONLINE.md](./GUIDA-ONLINE.md). Questa sezione serve solo a chi vuole farlo girare sul proprio computer.

Requisiti: Node.js 20 o superiore (testato con Node 22) e un database **Postgres**: uno locale, oppure un branch "dev" gratuito su [Neon](https://neon.tech).

```bash
npm install            # installa le dipendenze e genera il client Prisma
cp .env.example .env   # poi imposta DATABASE_URL, DATABASE_URL_UNPOOLED e AUTH_SECRET
npm run setup          # crea le tabelle (migrazioni) e gli account demo
npm run dev            # http://localhost:3000
```

Altri comandi:

| Comando | Cosa fa |
| --- | --- |
| `npm run build` / `npm start` | build e avvio di produzione |
| `npm test` | test unitari (prezzi B2C/B2B, IVA, validazione partite IVA) |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |
| `npm run db:seed` | ricrea gli account demo, se mancano |
| `npm run db:migrate` | dopo una modifica a `prisma/schema.prisma`, crea una nuova migrazione |

All'ingresso compare l'**age gate 18+**. La risposta resta memorizzata in un cookie per un anno.

### Account demo (solo sviluppo)

| E-mail | Password | Ruolo |
| --- | --- | --- |
| `trade@demo.lento` | `demo-trade` | Trade approvato, Germania (reverse charge UE 0%) |
| `enoteca@demo.lento` | `demo-trade` | Trade approvato, Italia (IVA 22% / aliquote alimentari) |
| `london@demo.lento` | `demo-trade` | Trade approvato, Regno Unito (esportazione 0%) |
| `pending@demo.lento` | `demo-trade` | Trade **in attesa** di approvazione |
| `admin@lento.local` | `demo-admin` | Amministratore (pagina `/admin`) |

In sviluppo la pagina di login mostra anche questo elenco.

---

## 2. Struttura del progetto

```
app/
  [locale]/                 tutte le pagine, con prefisso lingua (/en, /it, …)
    page.tsx                Home narrativa: hero, manifesto, storie, selezione, Italian Food Treasures, produttori, Trade
    shop/                   catalogo (filtri, ordinamento, ricerca, paginazione) e scheda prodotto
    producers/  stories/    produttori e Storie (journal)
    trade/                  condizioni B2B, modulo di richiesta, login, area account
    cart/  checkout/        carrello e checkout (B2C pagamento simulato, B2B richiesta d'ordine)
    order/[id]/             conferma d'ordine / fattura pro-forma stampabile
    admin/                  approvazione account e stato degli ordini trade
    legal/[slug]/           condizioni, spedizioni, privacy, cookie
  actions/                  server action (ordini, login, richiesta account, admin)
  api/                      Auth.js e verifica partita IVA in tempo reale
components/                 componenti riutilizzabili (layout, catalogo, prodotto, carrello, trade, ui)
data/                       prodotti, produttori, storie, testi legali (file TypeScript tipizzati)
lib/
  pricing.ts                logica prezzi B2C/B2B: casse, minimi, sconto, IVA per paese
  vat/                      formati IVA per paese, checksum, client VIES e HMRC
  catalog.ts                filtri, conteggi, ordinamento e paginazione
  payments/                 interfaccia PaymentProvider (mock ora, Stripe pronto)
  config.ts                 regole commerciali e paesi configurabili
messages/                   traduzioni (en completo, it completo; de/da/sv/nl parziali con fallback in inglese)
prisma/                     schema del database e seed
public/products/ …          foto (vedi sotto)
```

---

## 3. Aggiungere prodotti e foto

### Prodotti

I prodotti sono in **`data/products.ts`**, tipizzati da `data/types.ts`. Per aggiungerne uno basta un nuovo oggetto nell'array:

```ts
{
  kind: "wine",                       // "wine" oppure "pantry"
  slug: "barbera-del-vicino",         // usato nell'URL e per la foto
  name: "Barbera del Vicino",
  producer: "podere-gelso",           // slug di data/producers.ts
  category: "red",                    // orange | white | red | sparkling (vino) — "pantry" per la dispensa
  region: "Emilia-Romagna",
  area: "Colli Piacentini",
  format: { amount: 75, unit: "cl" },
  caseSize: 6,                        // il vino è sempre 6; la dispensa ha il suo formato cassa
  retailPrice: 19.5,                  // EUR, IVA e accise incluse (prezzo B2C)
  tradePrice: 9.9,                    // EUR, IVA esclusa (prezzo B2B)
  vatRateIT: 0.22,                    // aliquota IVA italiana per i clienti trade in Italia
  isNew: true,                        // facoltativo: compare in "New"
  grapes: ["Barbera"], vintage: 2023, soil: "…", vinification: "…",
  so2Total: 30, abv: 13,
  short: "…", tastingNote: "…", story: "…", pairing: "…",
}
```

I prodotti di dispensa usano `kind: "pantry"`, `category: "pantry"`, `treasure` (nome del cibo tradizionale, se è un Italian Food Treasure), `ingredients` e `shelfLife` al posto dei campi tecnici del vino.

I filtri del catalogo (tipologia, produttore, regione, formato, Italian Food Treasures) e i relativi conteggi si generano da soli a partire dai dati.

**Passare a un CMS o a Shopify:** il resto del codice legge i prodotti solo attraverso `products`, `getProduct()` e `productsByProducer()`. Basta reimplementare queste funzioni su un'API esterna (Shopify Storefront, Sanity, …) mantenendo il tipo `Product`.

Produttori e Storie seguono lo stesso schema, in `data/producers.ts` e `data/stories.ts`.

### Foto

Le foto vanno in `public/`, chiamate con lo slug:

| Cosa | Percorso | Formato consigliato |
| --- | --- | --- |
| Prodotto | `public/products/{slug}.jpg` | 4:5, bottiglia su fondo avorio uniforme (#FBF8F2), almeno 1600×2000 px |
| Produttore | `public/producers/{slug}.jpg` | orizzontale, almeno 2400 px di lato lungo |
| Storia | `public/stories/{slug}.jpg` | orizzontale, almeno 2400 px |
| Hero della Home | `public/home/hero.jpg` | 21:9 su desktop (ritagliata 4:5 su mobile), soggetto centrale |

Sono accettati anche `.webp`, `.png` e `.avif`. Prima di `dev` e di `build` lo script `scripts/scan-images.mjs` aggiorna `data/image-manifest.json`. Se la foto c'è viene usata, altrimenti compare il placeholder neutro. Se aggiungi foto con il server già avviato, lancia `node scripts/scan-images.mjs` oppure riavvia `npm run dev`.

---

## 4. Logica B2C / B2B

| | B2C (privati) | B2B (trade approvato) |
| --- | --- | --- |
| Prezzi | `retailPrice`, IVA e accise incluse | `tradePrice` IVA esclusa, con il retail barrato accanto |
| Quantità | libere | vino in casse da 6, mixabili; dispensa secondo il suo `caseSize` |
| Minimi | — | almeno 12 bottiglie di vino per ordine |
| Sconto | — | 5% sul vino da 36 bottiglie |
| Spedizione | gratuita sopra 120 €, altrimenti 12 € | indicata in pro-forma |
| IVA | inclusa | IT 22% (alimentari con la propria aliquota) · UE reverse charge 0% con dicitura · UK e Norvegia esportazione 0% |
| Checkout | pagamento (simulato) | "Invia richiesta d'ordine": ordine in bozza e pro-forma |

Tutte le regole si configurano in `lib/config.ts` (`RETAIL_RULES`, `TRADE_RULES`). Il calcolo sta in `lib/pricing.ts` ed è condiviso da client e server: il server **ricalcola sempre** il carrello e non si fida mai dei prezzi inviati dal browser.

Quando un cliente trade è collegato, in cima al sito compare una banda discreta con azienda, partita IVA e regime IVA.

**Valuta:** tutti i prezzi sono salvati in EUR. Il selettore EUR/GBP converte con il tasso `GBP_PER_EUR` del file `.env`. Ogni ordine registra valuta e tasso usati.

### Validazione della partita IVA

Quando arriva una richiesta di account trade, `lib/vat/` esegue tre controlli:

1. **formato** per paese (regex in `lib/vat/formats.ts`);
2. **checksum**: partita IVA italiana (algoritmo di Luhn modificato) e numero d'organizzazione norvegese (modulo 11);
3. **verifica reale**: API REST **VIES** della Commissione UE per i paesi UE; API **HMRC "Check a UK VAT number" v2** per il Regno Unito, attiva se si configurano `HMRC_CLIENT_ID` e `HMRC_CLIENT_SECRET`.

Se VIES o HMRC non rispondono (timeout di 8 secondi), la richiesta viene comunque accettata con stato **"non verificata"** e una nota. L'amministratore la controlla a mano prima di approvarla. Il modulo verifica il numero anche in tempo reale, quando si esce dal campo.

---

## 5. Approvare un cliente B2B

1. Il cliente compila il modulo in **/trade**. L'account viene creato con `approved = false`: chi prova ad accedere vede il messaggio "in attesa di approvazione".
2. Accedi con un account admin (online: l'e-mail e la password impostate in `ADMIN_EMAIL` / `ADMIN_PASSWORD`; in sviluppo `admin@lento.local` / `demo-admin`) e vai su **/en/admin** (oppure clicca "Admin" nell'area Trade).
3. Ogni account mostra l'esito della verifica IVA (VIES ✓, HMRC ✓, solo formato, non verificata). Premi **Approva**. Con **Revoca** l'accesso si toglie subito, perché la sessione rilegge l'account dal database a ogni richiesta.
4. Nella stessa pagina puoi cambiare lo stato delle richieste d'ordine trade (bozza, confermato, annullato).

Per creare un nuovo amministratore: imposta `role = "admin"` e `approved = true` sul suo account, ad esempio con `npx prisma studio`.

---

## 6. Lingue

- Lingua principale **inglese**. Interfaccia completa anche in **italiano**.
- **DE, DA, SV, NL** hanno già routing e file in `messages/` con le prime chiavi tradotte. Le chiavi mancanti ricadono sull'inglese (vedi `i18n/request.ts`), quindi si può tradurre un po' alla volta.
- I contenuti editoriali (prodotti, storie, produttori) sono per ora solo in inglese. Per localizzarli basta aggiungere campi per lingua in `data/` o spostarli in un CMS.

---

## 7. Deploy su Vercel

La guida passo passo, pensata per chi non è tecnico, è in **[GUIDA-ONLINE.md](./GUIDA-ONLINE.md)**. In sintesi:

- Il database è **Postgres** (Neon, collegato dalla scheda Storage di Vercel). L'integrazione imposta da sola `DATABASE_URL` (connessione con pooling, usata dal sito) e `DATABASE_URL_UNPOOLED` (connessione diretta, usata dalle migrazioni).
- Vercel esegue `npm run vercel-build` (`scripts/vercel-build.mjs`), che aggiorna l'elenco delle foto, applica le migrazioni (`prisma migrate deploy`), crea l'amministratore e infine fa la build di Next.js. Se il database non è ancora collegato salta le migrazioni con un avviso, così il primo deploy riesce comunque.
- L'amministratore viene creato al deploy dalle variabili `ADMIN_EMAIL` e `ADMIN_PASSWORD` (almeno 10 caratteri), solo se non esiste già: cambiare la password nelle variabili in seguito **non** la aggiorna. Gli account demo non vengono mai creati su Vercel (salvo `SEED_DEMO=true`).
- Variabili da impostare a mano: `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Facoltative: `NEXT_PUBLIC_SITE_URL` (quando colleghi un dominio tuo; senza, si usa il dominio di produzione Vercel), `GBP_PER_EUR`, `HMRC_*`, `PAYMENT_PROVIDER`.
- `vercel.json` fa girare le funzioni a Francoforte (`fra1`): scegli la stessa regione per il database Neon.
- Ogni modifica unita nel branch `main` viene pubblicata automaticamente; ogni pull request riceve un'anteprima.
- Per modificare il database: cambia `prisma/schema.prisma`, lancia `npm run db:migrate` in locale e fai il commit della cartella `prisma/migrations`; al deploy successivo Vercel la applica.

Nota tecnica: Next.js 16 crea i progetti con `cacheComponents` attivo. Qui è disattivato in `next.config.ts`, perché quasi ogni pagina mostra prezzi che dipendono dai cookie (valuta, sessione trade). Il rendering dinamico classico è più semplice e prevedibile.

---

## 8. Cosa manca per andare in produzione

### Pagamenti (Stripe)
- `npm i stripe`, completa `lib/payments/stripe.ts` (il codice di Stripe Checkout è già scritto, commentato) e imposta `PAYMENT_PROVIDER="stripe"`.
- Aggiungi un webhook (`app/api/stripe/webhook/route.ts`) che su `checkout.session.completed` porti l'ordine a `paid`.
- Valuta Stripe Tax o un calcolo IVA OSS per le vendite B2C a distanza nell'UE.
- E-mail transazionali (conferma d'ordine, approvazione account, pro-forma in PDF) con Resend, Postmark o simili: oggi non parte nessuna e-mail.

### VIES e HMRC in produzione
- **VIES**: l'integrazione REST è pronta. Conviene salvare il *consultation number* (richiesta con `requesterMemberStateCode` e `requesterNumber` della partita IVA di Lento) come prova della verifica ai fini del reverse charge, e ripetere la verifica periodicamente.
- **HMRC**: registra l'applicazione sull'HMRC Developer Hub, ottieni le credenziali di produzione, imposta `HMRC_API_BASE=https://api.service.hmrc.gov.uk` e richiedi l'accesso di produzione all'API "Check a UK VAT number".
- **Norvegia**: integrare il registro Brønnøysund (Enhetsregisteret) per verificare l'iscrizione al registro MVA.
- Aggiungere un rate limiting su `/api/vat/validate` e sul login.

### Accise, EMCS e vendita di alcolici
- Le vendite B2B di vino nell'UE viaggiano in sospensione d'accisa con **e-AD su EMCS** verso destinatari autorizzati, oppure ad accisa assolta con documento semplificato. Serve l'integrazione con il sistema dell'Agenzia delle Dogane e dei Monopoli (direttamente o tramite lo spedizioniere).
- Le vendite B2C a distanza in un altro paese UE richiedono un **rappresentante fiscale** e il pagamento delle accise nel paese di destinazione. In più ci sono i monopoli di stato: Systembolaget in Svezia, Alko in Finlandia, Vinmonopolet in Norvegia, che limitano o vietano la vendita diretta ai privati. Il B2C va quindi abilitato paese per paese (oggi tutti i paesi sono selezionabili).
- **Regno Unito**: duty britannica sull'alcol (calcolata per grado alcolico dal 2023), importatore registrato (WOWGR / deposito doganale), etichettatura UK.
- I prezzi retail per paese andrebbero differenziati: il modello prevede un solo prezzo, ma accise e IVA cambiano molto tra mercati.

### Logistica e deposito fiscale
- Collegare il **deposito fiscale** e il 3PL (giacenze, prenotazione della merce sulla richiesta d'ordine, DDT, tracking).
- Gestire stock e disponibilità per prodotto (oggi tutto risulta disponibile) e tariffe di trasporto reali per paese e numero di casse.
- Fatturazione elettronica (SDI per i clienti italiani) e numerazione fiscale delle fatture definitive dopo la pro-forma.

### Altro
- Sostituire i dati aziendali segnaposto (ragione sociale, P.IVA, codice accisa) nella pro-forma e nelle pagine legali, e far rivedere le pagine legali da un legale.
- Salvare gli importi in centesimi interi o come `Decimal` invece di `Float`.
- Piano Vercel: il piano gratuito *Hobby* è per uso personale e non commerciale; un negozio che vende davvero richiede il piano *Pro*.
- Foto vere di prodotti, produttori e storie.
- Banner cookie, se in futuro si aggiungono strumenti di analisi o marketing.
