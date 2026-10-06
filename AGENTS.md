# AGENTS.md — Retr0_ Portfolio

Entrypoint per agenti AI (Cursor, Claude Code, Codex, Copilot, ...). Leggi questo file per intero prima di modificare il codice, poi apri solo la guida che serve al task.

## Il progetto in breve

Portfolio single-page di Marco Simone Cannizzaro, online su https://retr0hub.dev e deployato su Vercel.
Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS v4, Framer Motion, Lenis, Resend, zod e Cloudflare Turnstile.

Una sola pagina (`app/page.tsx`) compone sezioni ancorate (`#home`, `#about`, `#works`, `#skills`, `#projects`, `#contact`). L'unico endpoint è `POST /api/contact`.

## Comandi

```bash
npm run dev     # sviluppo (Turbopack)
npm run lint    # ESLint (eslint-config-next + regole React Compiler)
npx tsc --noEmit # TypeScript 7 (vedi "Dipendenze" nelle insidie)
npm run build   # build di produzione: deve passare prima di dire "fatto"
```

Non esistono test automatici: la verifica è fatta da lint, typecheck, build e un controllo visivo su desktop e mobile.

## Mappa del codice

| Cartella | Contenuto | Quando toccarla |
|---|---|---|
| `app/config/site.ts` | `SITE` (brand, URL, social, CV), `FEATURES` (flag), `BUILD_INFO`, `TURNSTILE_SITE_KEY` | Dati globali o un nuovo flag |
| `app/data/` | Contenuti tipizzati: `navigation`, `hero`, `experiences`, `skills`, `projects` | Testi, progetti, skill, esperienze |
| `app/components/sections/` | Una sezione per file, con una sottocartella per i suoi pezzi (`works/`, `skills/`, ...) | UI di una sezione |
| `app/components/layout/` | `SiteShell`, `Header`, `MobileMenu`, `VerticalSliderNav`, `ConstructionBanner`, `FooterSection` | Struttura della pagina |
| `app/components/effects/` | Cursore custom, Lenis, particelle (solo client, caricati in lazy) | Effetti globali |
| `app/components/ui/` | Primitive riusabili: `Icons`, `Tag`, `FloatingTooltip`, `DotDivider`, `AnimatedSection`, `HeroShape` | Pezzi condivisi |
| `app/hooks/` | Logica riusabile (`useActiveSection`, `useLenis`, `useDraggableNodes`, `useContactForm`, ...) | Stato o effetti non visivi |
| `app/context/` | `StackHighlightContext` (un progetto evidenzia le skill del suo stack) | Comunicazione tra sezioni |
| `app/lib/` | Funzioni pure e helper (`math`, `scroll`, `time`, `cursorEvents`, `contact/*`) | Logica senza React |
| `app/api/contact/route.ts` | Rate limit → JSON → zod → Turnstile → Resend | Backend del form |
| `app/globals.css` | `@theme` (token), `@layer base`, CSS dei componenti complessi | Token e stili globali |
| `next.config.js` | Default delle variabili d'ambiente, header di sicurezza, CSP | Nuovi domini esterni, variabili d'ambiente |

## Regole d'oro

1. **I contenuti stanno in `app/data/` e `app/config/`**, mai hardcodati nei componenti. Un nuovo progetto, skill o esperienza si aggiunge con una voce in un array tipizzato.
2. **Server component di default.** Usa `'use client'` solo sul componente foglia che ha stato, effetti o eventi (vedi "isole client" in [architettura](docs/ai/architecture.md)).
3. **UI e comportamento devono restare identici** salvo richiesta esplicita: il layout è verificato al pixel. Prima di toccare uno stile, leggi le [insidie](docs/ai/pitfalls.md).
4. **Responsive sempre**: mobile-first, breakpoint principale `md:` (768px). Le interazioni desktop (drag, cursore, carosello) hanno un equivalente mobile dedicato.
5. **Correggi la causa, non il sintomo.** Niente `!important`, timeout magici o selettori DOM fragili per aggirare un problema.
6. **Coerenza:** se una modifica tocca dati, variabili d'ambiente, CSP o struttura, aggiorna anche `README.md`, `.env.example` e queste guide.
7. **Lingue:** il testo della UI e i messaggi d'errore per l'utente sono in italiano; identificatori e commenti nel codice sono in inglese.
8. **Commenti brevi**, solo per vincoli che il codice non mostra da solo. Mai commenti che raccontano la modifica o il prossimo statement.

## Guide dedicate

- [docs/ai/architecture.md](docs/ai/architecture.md): rendering server/client, flussi di dati, comunicazione tra componenti, API, configurazione.
- [docs/ai/conventions.md](docs/ai/conventions.md): stile del codice, naming, import, pattern React, Tailwind, accessibilità.
- [docs/ai/recipes.md](docs/ai/recipes.md): procedure passo-passo (aggiungere progetto, skill, esperienza, sezione, variabile d'ambiente, dominio esterno, ...).
- [docs/ai/pitfalls.md](docs/ai/pitfalls.md): trappole note e bug già risolti da non reintrodurre.

## Definition of done

- [ ] `npm run lint`, `npx tsc --noEmit` e `npm run build` passano senza errori né warning.
- [ ] Il layout è verificato a 390px e a ≥1024px, senza overflow orizzontale.
- [ ] Nessun nuovo `!important`, `any`, `eslint-disable` o `setState` dentro un effetto.
- [ ] Documentazione (`README.md`, `.env.example`, `docs/ai/`) allineata alla modifica.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
