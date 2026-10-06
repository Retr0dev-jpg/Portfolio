# Architettura

## Composizione della pagina

```
app/layout.tsx              server: font, metadata, <LazyEffects/>, Analytics
└─ app/page.tsx             server
   └─ SiteShell             client: banner, Header, VerticalSliderNav, <main>, easter egg in console
      ├─ HeroSection        server → RotatingWords, InteractiveTagline, HeroShape (client)
      ├─ AboutSection       server (statica)
      ├─ WorksSection       server → ExperienceAccordion (mobile) + ExperienceGraph (desktop)
      ├─ StackHighlightProvider
      │  ├─ SkillsSection   server → SkillsGrid (client, legge il context) → SkillCard
      │  └─ ProjectsSection client, dynamic() → ProjectCarousel (desktop) + ProjectAccordion (mobile)
      ├─ ContactSection     server → ContactInfo, ContactForm (dynamic(), client)
      └─ FooterSection      server async: stelle GitHub con fetch `revalidate: 3600`
```

La route `/` è statica con ISR di un'ora (per via del fetch del footer). `/api/contact` è dinamica. `/index.md` è un route handler statico (`force-static`) con la versione Markdown della pagina.

## Versione Markdown per gli agenti AI

Replica la funzione "Markdown for Agents" di Cloudflare: gli agenti che chiedono `Accept: text/markdown` ricevono il contenuto senza UI.

```
GET /  + Accept: text/markdown  ──rewrite beforeFiles (next.config.js)──▶ /index.md
GET /index.md                   ──▶ app/index.md/route.ts ──▶ renderSiteMarkdown() (app/lib/siteMarkdown.ts)
```

- `renderSiteMarkdown()` è una funzione pura che legge `SITE` e `app/data/*`: un solo punto per i contenuti, nessun testo duplicato.
- La risposta ha `Content-Type: text/markdown; charset=utf-8` e `x-markdown-tokens` (stima di circa 4 caratteri per token, come Cloudflare).
- Il rewrite sta in `beforeFiles` perché `/` è una pagina statica: gli `afterFiles` arrivano dopo il controllo del filesystem e non verrebbero mai applicati.
- `layout.tsx` dichiara `<link rel="alternate" type="text/markdown">` tramite `metadata.alternates.types`.

## Isole client

Ogni componente è server per default. `'use client'` va solo su:
- componenti con stato, effetti o handler (`RotatingWords`, `ExperienceGraph`, `ProjectCarousel`, ...);
- wrapper Framer Motion (`AnimatedSection`), che restano client ma accettano figli server.

Quando una sezione ha una parte interattiva, la sezione resta server e importa la parte client da `sections/<sezione>/`. Esempio: `WorksSection.tsx` (server) rende `works/ExperienceAccordion.tsx` e `works/ExperienceGraph.tsx` (client).

Effetti globali pesanti (`PointerEffects` = Lenis + `CustomCursor`, `ParticlesBackground`) sono caricati da `LazyEffects` con `dynamic(..., { ssr: false })`. Il cursore custom si monta solo se `useIsTouchDevice()` è `false`.

## Flusso dei dati

```
app/config/site.ts ─┐
app/data/*.ts ──────┼──▶ componenti (sola lettura, nessun fetch client)
next.config.js env ─┘
```

- `app/data/*` esporta array e oggetti `readonly` tipizzati (`PROJECTS`, `SKILLS`, `EXPERIENCES`, `HEADER_NAV`, `ABOUT`, `CONTACT_INTRO`, ...) e i tipi relativi (`Project`, `Skill`, `StackId`, `SectionId`, ...).
- Gli id delle sezioni vengono **solo** da `SECTION_ID` in `app/data/navigation.ts`. `SECTION_ORDER` guida sia lo slider verticale sia la sezione attiva.
- `Project.stack` è un array di `StackId`: è il collegamento progetto → card skill.

## Comunicazione tra componenti

| Meccanismo | File | Uso |
|---|---|---|
| Context diviso stato/azione | `app/context/StackHighlightContext.tsx` | `useHighlightStack()` (azione, stabile) dai progetti; `useStackHighlights()` (mappa `StackId → 'active' \| 'fading'`) nelle card skill |
| Event bus tipizzato | `app/lib/cursorEvents.ts` | `emitCursorEvent('dot-enter', {x, y})`, `'dot-leave'`, `'drag-start'`, `'drag-end'`; `onCursorEvent(name, fn)` restituisce l'unsubscribe |
| Attributo DOM | `data-cursor="hollow" \| "nav"` | Il cursore cambia aspetto sopra quell'elemento (hit-test con 16px di margine) |
| Hook condiviso | `app/hooks/useActiveSection.ts` | Indice della sezione attiva (ultima con `top ≤ innerHeight/2`), usato da Header e slider |

Non usare `window.dispatchEvent(new CustomEvent(...))`, `classList` su elementi di altri componenti, né `querySelector` su strutture interne altrui: estendi il bus o il context.

## Animazioni

- **Entrata delle sezioni**: `AnimatedSection` (`whileInView`, `once`, `amount: 0.2`, `variant: 'left' | 'right' | 'up'`).
- **Animazioni continue** (atomo `HeroShape`, cursore, particelle su canvas): un loop `requestAnimationFrame` che scrive direttamente su ref, attributi SVG o canvas, **senza setState per frame**. `HeroShape` si mette anche in pausa fuori viewport (IntersectionObserver): replica questo pattern per ogni nuova animazione costosa legata a una sezione.
- **Smooth scroll**: una sola istanza Lenis (`useLenis`), montata in `PointerEffects`.
- Keyframe e token di animazione stanno in `@theme` dentro `globals.css` (`animate-blink`, `animate-highlight-draw`, ...).

## Backend: `POST /api/contact`

```
getClientIp ─▶ isRateLimited (429) ─▶ req.json (400) ─▶ contactSchema.safeParse (400 + details)
            ─▶ verifyTurnstile (403) ─▶ env check ─▶ new Resend().emails.send ─▶ { error }? (500) ─▶ 200
```

- Moduli in `app/lib/contact/`: `limits.ts` (lunghezze massime, condivise tra client e server), `schema.ts` (zod), `rateLimit.ts` (Map in memoria con pruning, **per istanza**), `turnstile.ts`, `emailTemplate.ts` (HTML con `escapeHtml`).
- Il client Resend è creato dentro l'handler: senza `RESEND_API_KEY` la build non deve fallire.
- Turnstile: fuori produzione usa la chiave segreta di test di Cloudflare; in produzione senza `TURNSTILE_SECRET_KEY` lancia `TurnstileConfigError` (fail-closed).
- Lato client: `useContactForm` (nomi dei campi in `CONTACT_FIELD`, stati `idle | sending | success | error`, reset dopo 5s).

## Configurazione e variabili d'ambiente

- `next.config.js` dà i default a `NEXT_PUBLIC_SHOW_BANNER` (`'false'`), `NEXT_PUBLIC_CV_UPDATED_AT`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (chiave di test) e inietta i metadati del build (`NEXT_PUBLIC_BUILD_TIME`, commit Vercel).
- `app/config/site.ts` le legge **con nomi letterali** (`process.env.NEXT_PUBLIC_X`): è necessario perché Next le inlini nel bundle client.
- Variabili solo server: `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_EMAIL_TO`, `TURNSTILE_SECRET_KEY`.
- La CSP è in `next.config.js`. `'unsafe-eval'` è ammesso solo in dev. Domini ammessi: `cdn.jsdelivr.net` (icone devicon), Cloudflare Challenges e Vercel analytics.
