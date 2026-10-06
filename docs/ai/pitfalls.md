# Insidie note

Problemi reali già incontrati in questo progetto. Ogni voce indica la causa e la soluzione adottata: non reintrodurre il pattern sbagliato.

## CSS e Tailwind v4

- **Il CSS fuori dai layer batte le utility.** In Tailwind v4 una regola in `globals.css` fuori da ogni `@layer` vince su qualsiasi `md:p-0`. Per questo le regole sugli elementi (`section`, `a`, `header`) stanno in `@layer base`. Se un'utility "non funziona", controlla questo prima di aggiungere `!`.
- **Eccezione voluta:** il CSS delle card skill è fuori dai layer di proposito, perché le dimensioni responsive delle icone devono battere `w-7`/`w-20`. È documentato nel commento in `globals.css`.
- **`section` ha stili base:** `min-height: 100dvh`, padding `3rem 1rem` (`5rem 1rem` da `md`), flex in colonna centrata. Una nuova sezione li eredita.
- **Classi dinamiche:** `` `text-${c}-500` `` non viene generata. Usa tabelle di classi complete (`EXPERIENCE_THEME`).
- **`animate-highlight-draw` anima `scaleX`:** l'elemento deve avere `origin-left`, altrimenti si espande dal centro.
- **Link:** ogni `a` fuori dall'header riceve la sottolineatura ondulata al hover. Per escludere un link usa utility esplicite (`bg-none`) o un `button`.

## Next.js

- **Blocco `nextjs-agent-rules` in `AGENTS.md`:** è scritto da `next dev` (Next ≥ 16.3) e rimanda alla documentazione della versione installata in `node_modules/next/dist/docs/`. Non rimuoverlo né modificarlo: viene ricreato a ogni avvio. Le regole del progetto vanno scritte sopra di esso.
- **`NEXT_PUBLIC_*` vanno letti con nomi letterali** (`process.env.NEXT_PUBLIC_SHOW_BANNER`). Accessi dinamici (`process.env[name]`) restano `undefined` nel client.
- **Niente lavoro all'import dei moduli server** che dipenda da segreti: `new Resend(key)` a livello di modulo faceva fallire `next build` senza `RESEND_API_KEY`. Crea i client dentro l'handler.
- **Default delle variabili d'ambiente in `next.config.js`**: usa `??`, mai valori forzati, altrimenti le variabili di Vercel vengono ignorate.
- **ISR della home:** il fetch delle stelle GitHub nel footer rende `/` rivalidata ogni ora. Un fetch senza `revalidate` (o con `cache: 'no-store'`) la renderebbe dinamica: evitalo.
- **`Vary` sulle pagine App Router:** il runtime delle pagine fa `res.setHeader('Vary', ...)` e sovrascrive il `Vary: Accept` dichiarato in `next.config.js`. Con `next start` l'HTML di `/` non lo espone, mentre la risposta Markdown sì. Non è un problema per la cache di Vercel, perché il rewrite su `Accept` viene valutato prima della cache e le due versioni hanno chiavi diverse (`/` e `/index.md`). Non aggirarlo riscrivendo gli header a mano.
- **Rewrite verso pagine statiche:** usa `beforeFiles`. Un rewrite restituito come array semplice (`afterFiles`) viene valutato dopo le pagine statiche e non scatta mai su `/`.
- **Immagini remote:** le icone devicon usano `next/image` con `unoptimized` (sono SVG da CDN); il dominio deve stare in `img-src` della CSP.
- **Niente `disabled` nativo guidato da stato solo client** (es. token Turnstile): al reload il browser ripristina lo stato dei controlli del form prima dell'idratazione e React segnala un mismatch. Usa `aria-disabled` con le varianti `aria-disabled:` e blocca l'azione nell'handler (vedi il bottone di `ContactForm`).
- **`suppressHydrationWarning` su `<html>` e `<body>`** serve per gli attributi iniettati dalle estensioni del browser. Non usarlo altrove per nascondere mismatch veri: usa `useIsClient()`.

## React 19 e React Compiler (lint)

- `react-hooks/set-state-in-effect`: niente `setState` sincrono nel corpo di un effetto. Per stato derivato dal browser usa `useSyncExternalStore`.
- `react-hooks/refs`: niente `ref.current` letto durante il render, nemmeno indirettamente (per esempio mappando un array di ref nel JSX). Per questo le parentesi del cursore sono due `div` scritti esplicitamente.
- **StrictMode monta, smonta e rimonta gli effetti**, ed esegue due volte gli updater di `setState`: timer e listener vanno puliti, e niente side effect dentro gli updater.
- **Dipendenze stabili:** `useActiveSection(ids)` riesegue l'effetto a ogni nuovo array. Passa costanti di modulo come `SECTION_ORDER`.

## Interazione

- **Header fisso:** copre la parte alta della viewport. `scrollToSection` centra la sezione (`block: 'center'`) proprio per questo.
- **Lenis:** c'è una sola istanza (`useLenis` in `PointerEffects`). Non crearne un'altra. Il middle-click attiva l'auto-scroll direzionale del cursore.
- **Rotazione della freccia dell'auto-scroll:** `orbitAngle` cresce senza limiti di proposito, perché normalizzarlo farebbe girare all'indietro di 360° la `transition` CSS del `transform`. Per questo `angleDelta` deve accettare angoli di qualsiasi ampiezza: con una sola correzione di ±2π, dopo un giro completo la freccia tornava indietro.
- **Dispositivi ibridi:** `useIsTouchDevice` passa a `true` al primo `touchstart`. Non dedurre il touch dalla larghezza dello schermo.
- **Blocchi voluti:** il menu contestuale e la selezione del testo sono disabilitati sui dispositivi con puntatore fine (classe `has-fine-pointer`). È una scelta del proprietario: non rimuoverla.
- **Cursore di sistema nascosto ovunque:** con `has-fine-pointer`, `globals.css` imposta `cursor: none` su ogni elemento, quindi le utility `cursor-*` di Tailwind non hanno effetto su desktop. Per dare un feedback di hover usa `data-cursor` sull'elemento che si vede davvero (se ha un `transform`, sul nodo trasformato: l'hit-test usa `getBoundingClientRect`).
- **Drag dei nodi Works:** posizioni in percentuale; un tap senza movimento apre o fissa il dettaglio. Gli elementi trascinabili sono marcati con `data-node-draggable`.
- **Evidenziazione delle skill:** tempi in `TIMING` (dissolvenza 500ms, attesa 700ms per lo scroll, sfasamento 100ms, durata 5s). Cambiandoli si desincronizza lo scroll verso `#skills`.

## Backend del form

- **Resend non lancia eccezioni**: restituisce `{ data, error }`. Controlla sempre `error`, altrimenti un invio fallito risulta riuscito.
- **Turnstile fail-closed:** in produzione senza `TURNSTILE_SECRET_KEY` il form rifiuta tutto. Non reintrodurre il fallback alla chiave di test.
- **JSON non valido → 400**, non 500: `req.json()` è nel suo `try`.
- **Rate limit in memoria e per istanza serverless:** è una difesa leggera, non globale. Per limiti reali serve uno store condiviso (es. Upstash/KV).
- **`x-real-ip`** è affidabile solo dietro Vercel o un proxy che lo sovrascrive.
- **Oggetto email:** `\r` e `\n` vengono rimossi nello schema per evitare header injection. Ogni valore inserito nell'HTML passa da `escapeHtml`.

## Dipendenze

- **TypeScript 7 convive con l'API di TypeScript 6.** In `package.json`, `@typescript/native` è TS 7 (fornisce `npx tsc`), mentre `typescript` è un alias di `@typescript/typescript6`, perché `typescript-eslint` e il type-check di `next build` richiedono l'API di TS 6. Non riportare `typescript` a `^7` finché `typescript-eslint` non supporta TS ≥ 7.1.
- **ESLint resta alla 9.x.** `eslint-plugin-react` (incluso in `eslint-config-next`) dichiara supporto solo fino a ESLint 9 e con la 10 va in crash (`context.getFilename is not a function`). Aggiorna a ESLint 10 solo quando il plugin lo supporterà.
- **Gli errori di idratazione con `data-cursor-ref`** vengono dal browser integrato di Cursor, che annota il DOM per l'automazione: non sono bug del progetto.

## Dati

- `node.period` (nodi desktop, con `-`) e `periodShort` (accordion mobile, con `–`) sono volutamente diversi: rispecchiano il design originale.
- `Project.stack` deve contenere solo `StackId` esistenti in `SKILLS`: il typecheck lo garantisce, non aggirarlo con cast.
- Il nome del file del CV contiene spazi: in `SITE.cv.href` va codificato (`%20`).
- **Email fuori dal Markdown:** `renderSiteMarkdown()` non deve includere `buildContactEmail()`. L'indirizzo è offuscato apposta per non finire nell'HTML, e `/index.md` è testo statico leggibile da qualsiasi scraper.
