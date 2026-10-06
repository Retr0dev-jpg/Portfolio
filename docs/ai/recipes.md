# Ricette

Procedure per le modifiche più frequenti. Ognuna termina con la [definition of done](../../AGENTS.md#definition-of-done).

## Aggiungere un progetto

1. Aggiungi una voce a `PROJECTS` in `app/data/projects.ts`. L'ordine dell'array è l'ordine di visualizzazione.
   - `description` per il carosello desktop, `descriptionShort` per l'accordion mobile.
   - `gradient` e `overlay`: classi Tailwind complete (`'from-pink-100 to-pink-200'`).
   - `icon.d`: path SVG su viewBox 20×20 (stile Heroicons solid); `evenOdd: true` se il path lo richiede.
   - `target`: `{ kind: 'external', url }`, `{ kind: 'scroll-top' }` oppure `{ kind: 'coming-soon' }`.
   - `paid: true` per i lavori su commissione.
   - `stack`: gli `StackId` delle card skill da evidenziare (devono esistere in `SKILLS`).
2. Carosello (`VISIBLE_CARDS = 4`) e accordion si adattano da soli al numero di voci: non serve toccare i componenti.
3. Se il progetto compare anche fra i link dell'esperienza freelance, aggiorna `links` della voce `freelance` in `app/data/experiences.ts`.

## Aggiungere una skill

1. Aggiungi l'id all'unione `StackId` in `app/data/skills.ts`.
2. Aggiungi la voce a `SKILLS`:
   - un'icona: `icons: [{ name, src }]`, che usa `.skill-icon`;
   - più icone: imposta `iconSize` e uno `slot` per ciascuna (`top-left`, `top-right`, `bottom-left`, `bottom-right`, `bottom-center`).
3. Icone: `devicon('slug')` o `devicon('slug', 'variante')` per jsDelivr; le icone locali vanno in `public/icons/*.svg` (`src: '/icons/nome.svg'`). Ogni altro dominio richiede di aggiornare la CSP (vedi sotto).
4. Se va evidenziata da un progetto, aggiungi l'id al `stack` di quel progetto.

## Aggiungere un'esperienza (sezione Works)

1. Aggiungi l'id all'unione `ExperienceId` e la voce a `EXPERIENCES` in `app/data/experiences.ts`. L'array è in ordine cronologico inverso.
   - `order`: la filigrana mobile (`'05'`, ...). Rinumera le altre voci se necessario.
   - `theme`: uno fra `purple | blue | orange | green`. Per un colore nuovo aggiungilo a `ExperienceTheme` **e** a `EXPERIENCE_THEME` in `sections/works/theme.ts`, con classi complete.
   - `periodShort`/`periodLong` servono all'accordion mobile e al dettaglio; `node.period` è l'etichetta del nodo desktop (usa il trattino semplice `-`).
   - `node.position` in percentuale del contenitore; `node.size`, `detailWidth` e `detailPlacement` (`above`/`below`) vanno scelti per non coprire gli altri nodi.
2. Collega il nodo in `EXPERIENCE_GRAPH`: `solid` per la linea cronologica, `dashed` e `faint` per le connessioni secondarie, `pulses` per i punti animati.
3. Verifica il grafo a 1024px e a 1440px, e l'accordion a 390px.

## Cambiare testi

| Testo | Dove |
|---|---|
| Parole rotanti e tagline del hero | `app/data/hero.ts` |
| Nome, social, CV, licenza, repository | `app/config/site.ts` |
| Voci del menu | `HEADER_NAV` in `app/data/navigation.ts` |
| About, intestazione Contact, footer | direttamente nella sezione: sono testi unici, non dati ripetuti |
| Data del CV | variabile d'ambiente `NEXT_PUBLIC_CV_UPDATED_AT` |
| PDF del CV | sostituisci il file in `public/CV/` mantenendo il nome, oppure aggiorna `SITE.cv.href` |

## Aggiungere una sezione

1. Aggiungi l'id a `SECTION_ID` e a `SECTION_ORDER` (nella posizione giusta) in `app/data/navigation.ts`; aggiungilo a `HEADER_NAV` se deve comparire nel menu. Slider verticale, sezione attiva e menu mobile si aggiornano da soli.
2. Crea `app/components/sections/NomeSection.tsx` come server component:
   ```tsx
   import AnimatedSection from '../ui/AnimatedSection';
   import { SECTION_ID } from '@/app/data/navigation';

   export default function NomeSection() {
     return (
       <AnimatedSection id={SECTION_ID.nome} variant="up">
         {/* ... */}
       </AnimatedSection>
     );
   }
   ```
   Se ha uno sfondo a tutta larghezza usa `contained={false}`. Per una sezione senza animazione d'entrata usa un `<section id={...}>` semplice (come `AboutSection`).
3. Metti le parti interattive in `sections/nome/` con `'use client'`, e i contenuti in `app/data/nome.ts`.
4. Inseriscila in `app/page.tsx` nello stesso ordine di `SECTION_ORDER`. Se è pesante e sotto la piega, caricala con `dynamic()`.
5. Ricorda che `section` riceve dal CSS base `min-height: 100dvh` e il padding verticale: sovrascrivili con utility se serve (`min-h-[550px]`).

## Aggiungere una variabile d'ambiente

1. **Pubblica** (`NEXT_PUBLIC_*`): leggila in `app/config/site.ts` con il nome letterale e convertila subito nel tipo giusto (`=== 'true'`, `?? ''`). Se serve un default, mettilo in `env` di `next.config.js`.
2. **Server-only**: leggila solo in `app/api/` o `app/lib/`, controlla che sia presente e fallisci in modo esplicito se manca.
3. Documentala in `.env.example` e nel blocco `.env.local` di `README.md`.
4. Su Vercel, le variabili `NEXT_PUBLIC_*` richiedono un nuovo build per avere effetto.

## Usare un nuovo dominio esterno

Aggiorna `contentSecurityPolicy` in `next.config.js` nella direttiva giusta (`img-src` per immagini, `script-src` per script, `connect-src` per fetch dal client, `frame-src` per iframe). I fetch eseguiti lato server (es. GitHub nel footer) non richiedono la CSP. Se la risorsa è critica per il primo render, aggiungi un `<link rel="preconnect">` in `app/layout.tsx`.

## Modificare il form contatti

Un campo vive in cinque punti, da tenere allineati:
1. `CONTACT_LIMITS` in `app/lib/contact/limits.ts` (lunghezza massima);
2. `contactSchema` in `app/lib/contact/schema.ts` (validazione server);
3. `CONTACT_FIELD` e il body della fetch in `app/hooks/useContactForm.ts`;
4. il `<FormField>` in `sections/contact/ContactForm.tsx` (con `maxLength={CONTACT_LIMITS.x}`);
5. `renderContactEmail` in `app/lib/contact/emailTemplate.ts`, passando ogni valore da `escapeHtml`.

## Far reagire il cursore custom

- Aspetto "hollow" o "nav" su un elemento: aggiungi `data-cursor="hollow"` o `data-cursor="nav"`.
- Nuovo aspetto: aggiungi la modalità all'unione `Mode` e a `CURSOR_LOOK` in `effects/CustomCursor.tsx`.
- Un widget che deve guidare il cursore (come i pallini dello slider o il drag dei nodi): aggiungi l'evento a `CursorEventMap` in `app/lib/cursorEvents.ts`, emettilo con `emitCursorEvent` e ascoltalo in `CustomCursor` con `onCursorEvent`.

## Aggiungere un'icona UI

In `app/components/ui/Icons.tsx`: `export const NomeIcon = (props: IconProps) => <StrokeIcon d="..." {...props} />;` (viewBox 24×24, stile Heroicons outline). Le icone piene seguono il modello di `StarIcon`.
