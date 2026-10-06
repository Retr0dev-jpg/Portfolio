# Convenzioni di codice

Lo scopo è che ogni file sembri scritto dalla stessa persona. Prima di creare qualcosa, apri un file simile già esistente e imitalo.

## File e naming

| Cosa | Convenzione | Esempio |
|---|---|---|
| Componenti | `PascalCase.tsx`, un default export per file | `ProjectCarousel.tsx` |
| Pezzi di una sezione | sottocartella in minuscolo col nome della sezione | `sections/works/ExperienceGraph.tsx` |
| Hook | `useCamelCase.ts`, named export | `export function useActiveSection(...)` |
| Helper e dati | `camelCase.ts`, named export | `lib/scroll.ts`, `data/projects.ts` |
| Costanti di modulo | `SCREAMING_SNAKE_CASE` | `SECTION_ID`, `CURSOR_LOOK`, `TIMING` |
| Tipi | `PascalCase`, `interface` per oggetti estendibili, `type` per unioni e mappe | `ProjectTarget`, `HighlightState` |
| Id semantici | stringhe letterali in unione | `StackId = 'frontend' \| 'backend' \| ...` |

## Import

- Da altre aree di `app/`: alias assoluto `@/app/...` (`@/app/data/navigation`, `@/app/lib/scroll`).
- Tra file vicini nello stesso albero `components/`: percorso relativo (`../ui/AnimatedSection`, `./works/theme`).
- Per i soli tipi usa `import type { ... }`.
- Ordine: librerie esterne, poi alias `@/app`, poi relativi.

## TypeScript

- `strict` è attivo. Niente `any`, niente `as` per zittire il compilatore; `as const` va bene su dati statici.
- I dati sono `readonly` (`readonly Project[]`, `readonly string[]`).
- Per le varianti usa unioni discriminate, non booleani multipli. Esempio: `target: { kind: 'external'; url } | { kind: 'scroll-top' } | { kind: 'coming-soon' }`.
- Le tabelle `Record<Unione, ...>` (`SLOT_CLASS`, `HIGHLIGHT_CLASS`, `EXPERIENCE_THEME`) sono preferite a `switch` e ternari annidati: aggiungere un membro all'unione fa fallire il typecheck finché la tabella non è completa.

## Pattern React

- **Server prima.** `'use client'` solo dove serve (vedi [architettura](architecture.md)).
- **Niente setState sincrono dentro `useEffect`** (la regola React Compiler `set-state-in-effect` lo segnala). Per valori del browser usa `useSyncExternalStore`: vedi `useIsClient`, `useIsTouchDevice` e l'orologio di `ConstructionBanner`.
- **Niente lettura o scrittura di `ref.current` durante il render** (regola `react-hooks/refs`). Leggi i ref negli handler o negli effetti. Se un ref deve rispecchiare uno stato, sincronizzalo in un effetto (vedi `highlightsRef` in `StackHighlightContext`).
- **Niente side effect dentro gli updater di `setState`**: in StrictMode vengono eseguiti due volte.
- **Animazioni per frame** su ref e `requestAnimationFrame`, mai `setState` a 60fps.
- **Cleanup obbligatorio**: ogni `setTimeout`, listener, `requestAnimationFrame` e observer va rilasciato nel return dell'effetto. Usa `{ passive: true }` per `scroll` e `touch`.
- Gli array passati come dipendenze agli hook (es. `useActiveSection(ids)`) devono essere costanti di modulo.
- Per comunicare tra componenti usa context o `cursorEvents`, mai il DOM altrui.
- Callback passati in profondità: `useCallback`; i context espongono azioni stabili, separate dallo stato.

## Tailwind e CSS

- Le classi vanno scritte **intere e letterali**: Tailwind le rileva staticamente. Per varianti usa una tabella (`EXPERIENCE_THEME`, `SLOT_CLASS`), mai `` `bg-${color}-500` ``.
- Mobile-first: la classe base vale per mobile, `md:` e `lg:` per schermi più grandi. Breakpoint principale `md` (768px).
- Colori del brand dai token `@theme`: `accent` (`#7C3AED`), `accent-soft`, `primary`, `secondary`. Font: `font-sans` (Inter), `font-mono` (Roboto Mono).
- Niente `!important` nuovi. Le regole sugli elementi (`section`, `a`, header) stanno in `@layer base`, così le utility le battono senza forzature.
- Il CSS custom in `globals.css` è solo per ciò che le utility non esprimono bene (keyframe, card delle skill, parole del hero). Raggruppalo sotto un commento di sezione `/* ---------- Nome ---------- */`.
- Le classi stringa ripetute diventano costanti locali (`FOOTER_LINK`, `EMOJI_SHADOW`, `BRACKET_CLASS`).
- Le icone SVG vanno in `ui/Icons.tsx` (`StrokeIcon` + export `XxxIcon`), non inline nei componenti.

## Responsive

- Se desktop e mobile hanno interazioni diverse, crea **due componenti** e mostra l'uno o l'altro con `hidden md:block` / `md:hidden`, come `ExperienceGraph`/`ExperienceAccordion` e `ProjectCarousel`/`ProjectAccordion`. Non riempire un componente di condizioni `isMobile`.
- Per capacità del dispositivo (non per larghezza) usa `useIsTouchDevice`.
- Ogni modifica va verificata a 390px e a ≥1024px, senza overflow orizzontale.

## Accessibilità

- Bottoni con solo icona: `aria-label` in italiano (es. `"Mostra lo stack di Memolee"`).
- Accordion: `aria-expanded`. Elementi decorativi (emoji, filigrane): `aria-hidden="true"`.
- Navigazione: `aria-current` sull'elemento attivo; `<nav aria-label="...">`.
- Link esterni: `target="_blank" rel="noopener noreferrer"`, oppure `openInNewTab()` da `lib/scroll.ts`.

## Testi e commenti

- La UI è in italiano. Gli apostrofi nel JSX si scrivono `&apos;` (regola `react/no-unescaped-entities`).
- I messaggi d'errore dell'API sono in italiano (sono mostrati all'utente); log e commenti in inglese.
- I commenti spiegano solo vincoli non ovvi, in una riga. Esempi esistenti:
  - `// Full class names are spelled out so Tailwind can detect them at build time.`
  - `// The SDK reports API failures in the result instead of throwing.`
- Niente commenti che descrivono la riga successiva, la storia della modifica o "fix per X".
