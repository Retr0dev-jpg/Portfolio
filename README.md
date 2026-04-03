# Retr0_ Portfolio

Un portfolio web moderno, minimalista e **tecnicamente avanzato**. Progettato per offrire un'esperienza utente fluida, animazioni accattivanti e una struttura del codice pulita e scalabile.

---

## ⚠️ Note & Limitazioni

> **🚨 Versione Mobile**: La versione responsive per dispositivi mobili è ancora instabile. Il portfolio è attualmente ottimizzato per desktop e tablet in orientamento landscape.

---

## 📁 Struttura del Progetto

```
Portfolio/
│
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts             # API Route Next.js per invio email via Resend
│   ├── components/
│   │   ├── AnimatedSection.tsx      # Wrapper animato per sezioni, con varianti direzionali
│   │   ├── Header.tsx               # Header fixed con hamburger menu mobile e overlay full-screen
│   │   ├── HeroShape.tsx            # Animazione atomo interattivo con transizione a buco nero
│   │   ├── MouseEffect.tsx          # Cursore custom (desktop), Lenis smooth scroll, touch detection
│   │   ├── VerticalSliderNav.tsx    # Slider verticale con pallini animati (nascosto su mobile)
│   │   └── ParticlesBackground.tsx  # Canvas animato di particelle (ottimizzato per mobile)
│   ├── hooks/
│   │   └── useIsMobile.ts          # Hook per rilevamento mobile (breakpoint) e touch device
│   ├── globals.css                  # Stili globali, @theme Tailwind v4, media queries responsive
│   ├── layout.tsx                   # Layout globale, font Google, MouseEffect, ParticlesBackground,
│   │                                  Vercel Analytics e Speed Insights
│   └── page.tsx                     # Pagina principale — tutte le sezioni con layout condizionale
│                                      desktop/mobile
│
├── public/
│   ├── CV/
│   │   └── CV_Marco_Simone_Cannizzaro.pdf
│   └── hostinger-icon.svg
│
├── .env.local                       # Variabili d'ambiente (non in git)
├── postcss.config.js                # Plugin @tailwindcss/postcss per Tailwind v4
├── next.config.js                   # Configurazione Next.js
├── tsconfig.json                    # Configurazione TypeScript
├── package.json                     # Dipendenze e script
└── README.md                        # (Questo file)
```

---

## ✨ Componenti Principali

### `Header.tsx`

- Header `fixed` con navigazione a pagina singola.
- Evidenziazione della sezione attiva tramite animazione con `framer-motion`.
- Scroll fluido alle sezioni con `scrollIntoView`.
- Prop `bannerVisible` per scendere automaticamente sotto il banner "in costruzione".
- Mobile: hamburger menu animato con overlay full-screen e navigazione con link animati via Framer Motion. Il body viene bloccato (`overflow: hidden`) quando il menu è aperto.

### `MouseEffect.tsx`

- Desktop: cursore custom con animazione fluida e posizione "burrosa".
- Sistema di Scroll Personalizzato: tenendo premuto il middle mouse button appare una freccia SVG che orbita intorno al cursore e indica la direzione; lo scroll automatico fluido (powered by **Lenis**) segue la direzione della freccia.
- Parentesi tonde laterali animate che seguono il mouse sopra i pallini dello slider.
- Parentesi quadre animate che abbracciano i link dell'header al hover (hitbox aumentata via JS).
- Effetto cerchio e blending dinamico.
- Disabilitazione del comportamento predefinito del middle mouse button.
- Mobile/Touch: il cursore custom è completamente disabilitato. Viene renderizzato solo un `LenisProvider` per lo smooth scroll, senza alcun elemento visivo aggiuntivo. Il rilevamento touch avviene tramite `ontouchstart` e `navigator.maxTouchPoints`.

### `VerticalSliderNav.tsx`

- Slider verticale a destra, sempre visibile e centrato.
- 6 pallini per le sezioni principali (Home, About, Works, Skills, Projects, Contact).
- `mix-blend-difference` per contrasto automatico su qualsiasi sfondo.
- Area di tolleranza cliccabile espansa (48×48px).
- Effetto magnetico e feedback visivo avanzato al hover.
- Mobile: nascosto con `hidden md:flex` — la navigazione avviene tramite l'hamburger menu.

### `AnimatedSection.tsx`

- Wrapper per sezioni con animazioni di entrata (slide da sinistra, destra o alto).
- Trigger on-scroll tramite `react-intersection-observer`.
- Prop `showTitle` e `className` per personalizzazione completa.
- Cubic bezier `[0.22, 1, 0.36, 1]` per transizioni fluide (Framer Motion 12).

### `ParticlesBackground.tsx`

- Canvas animato con particelle interattive e linee di collegamento.
- Mobile: numero di particelle ridotto (max 30 vs 100 su desktop) per ottimizzare le performance tramite rilevamento `window.innerWidth < 768`.

### `HeroShape.tsx`

- Animazione Atomo Interattivo: nucleo cliccabile e orbite ellittiche animate.
- Transizione Esplosione → Buco Nero: click sul nucleo attiva esplosione delle particelle seguita da formazione di buco nero con effetto risucchio.
- Doppio sistema anti-click multiplo: `pointer-events: none` + stato `isAnimating`.
- Timing preciso: esplosione (1.2s), ingresso particelle (300ms + 200ms/particella).
- Fix SVG transform-origin per compatibilità con Framer Motion v12+: ogni elemento animato con `scale` utilizza `transformBox: 'fill-box'` e `transformOrigin: 'center'` per garantire che la scalatura avvenga dal centro dell'elemento.
- Mobile: nascosto tramite `hidden md:block` sul wrapper — l'atomo è visibile solo su desktop.

### `useIsMobile.ts` (Hook)

- `useIsMobile()`: rileva se la viewport è inferiore a 768px tramite `matchMedia`, con listener per i cambiamenti dinamici.
- `useIsTouchDevice()`: rileva la capacità touch tramite `ontouchstart` e `navigator.maxTouchPoints`.
- Entrambi gli hook sono client-side (`'use client'`) e restituiscono `false` inizialmente per evitare mismatch SSR/client.

### `app/api/contact/route.ts`

- API Route server-side per l'invio delle email dal form di contatto.
- Usa **Resend** — zero credenziali SMTP esposte al frontend.
- Valida tutti i campi, imposta `replyTo` sull'email del mittente.
- Restituisce JSON con `{ success: true }` o `{ error: "..." }`.

---

## 📱 Design Responsive

Il portfolio implementa un design responsive completo con approcci diversi per desktop e mobile:

| Area | Desktop | Mobile |
| --- | --- | --- |
| **Navigazione** | Header con link inline | Hamburger menu + overlay full-screen |
| **Cursore** | Cursore custom animato + middle-click scroll | Cursore di sistema, smooth scroll via Lenis |
| **Hero** | Testo + atomo interattivo a destra | Testo centrato, atomo nascosto |
| **About** | Emoji decorative animate ai lati | Emoji nascoste, padding ridotto |
| **Works** | Nodi draggabili con hover | Timeline verticale statica con card |
| **Skills** | Card 160×160px, griglia ampia | Card scalate (140px / 105px), griglia adattiva |
| **Projects** | Carousel con frecce, larghezza fissa | Scroll orizzontale snap con card 280px |
| **Contact** | Emoji decorative, form ampio | Emoji nascoste, form adattivo con link troncati |
| **Slider nav** | Pallini verticali a destra | Nascosto |
| **Particelle** | Fino a 100 particelle | Max 30 particelle |

### Strategie adottate

- **CSS Media Queries**: `@media (hover: hover) and (pointer: fine)` per isolare features desktop-only (cursore custom, `user-select: none`).
- **Conditional Rendering**: sezioni come Works e Projects renderizzano layout completamente diversi tramite `useIsMobile()`.
- **Tailwind Responsive**: classi `hidden md:block`, `md:flex`, `text-lg md:text-2xl` ecc. per adattamento fluido.
- **Performance**: particelle ridotte e shape SVG nascoste su schermi piccoli.

---

## 🧩 Sezioni della Pagina

- **Home**: Hero con presentazione, claim animato e shape interattiva (desktop). Su mobile il testo è centrato con skills container wrappabile.
- **About**: Descrizione personale con emoji animate (desktop) o layout pulito senza decorazioni (mobile).
- **Works**: Timeline con esperienze lavorative e formazione — nodi draggable su desktop, card verticali statiche su mobile.
- **Skills**: Griglia di skill card con icone combinate e animazioni hover. Card ridimensionate su schermi piccoli.
- **Projects**: Showcase dei progetti con carousel navigabile (desktop) o scroll orizzontale snap-to (mobile).
- **Contact**: Info di contatto + form con invio reale via Resend (stati: invio, successo, errore). Layout adattivo con link troncati su mobile.

---

## ⚙️ Setup & Avvio

### Prerequisiti

- Node.js 18+
- Account [Resend](https://resend.com) per il form di contatto (gratuito, 100 email/mese)

### Installazione

1. **Clona il repository**
  ```bash
   git clone https://github.com/Retr0dev-jpg/Portfolio.git
   cd Portfolio
  ```
2. **Installa le dipendenze**
  ```bash
   npm install
  ```
3. **Configura le variabili d'ambiente**
  Crea il file `.env.local` nella root:
  ```env
  RESEND_API_KEY=re_...
  NEXT_PUBLIC_ENABLE_ANALYTICS=true
  NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=true
  ```
4. **Avvia il server di sviluppo**
  ```bash
   npm run dev
  ```
   Vai su [http://localhost:3000](http://localhost:3000)
  > Se Turbopack dà problemi su Windows, usa `next dev --no-turbopack` come flag alternativo.
5. **Build produzione**
  ```bash
   npm run build
   npm start
  ```

---

## 📦 Dipendenze


| Pacchetto                     | Versione | Ruolo                                 |
| ----------------------------- | -------- | ------------------------------------- |
| `next`                        | ^16      | Framework React full-stack            |
| `react` / `react-dom`         | ^19      | UI library                            |
| `framer-motion`               | ^12      | Animazioni dichiarative               |
| `lenis`                       | ^1.3     | Smooth scroll                         |
| `react-intersection-observer` | ^10      | Trigger animazioni on-scroll          |
| `resend`                      | ^6       | Invio email server-side               |
| `tailwindcss`                 | ^4       | Utility CSS framework                 |
| `typescript`                  | ^5.9     | Type safety                           |
| `@vercel/analytics`           | ^2       | Vercel Web Analytics                  |
| `@vercel/speed-insights`      | ^2       | Vercel Speed Insights (Core Web Vitals) |
