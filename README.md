# Retr0_ Portfolio

Un portfolio web moderno, minimalista e **tecnicamente avanzato**. Progettato per offrire un'esperienza utente fluida, animazioni accattivanti e una struttura del codice pulita e scalabile.

---

## ⚠️ Note & Limitazioni

> **🚨 Versione Mobile**: La versione responsive per dispositivi mobili non è ancora disponibile. Il portfolio è attualmente ottimizzato per desktop e tablet in orientamento landscape.

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
│   │   ├── Header.tsx               # Header fixed con navigazione animata, smooth scroll e supporto banner
│   │   ├── HeroShape.tsx            # Animazione atomo interattivo con transizione a buco nero
│   │   ├── MouseEffect.tsx          # Cursore custom, parentesi animate e overlay slider
│   │   ├── VerticalSliderNav.tsx    # Slider verticale con pallini animati e contrasto automatico
│   │   └── ParticlesBackground.tsx  # Canvas animato di particelle per il background
│   ├── globals.css                  # Stili globali, @theme Tailwind v4 e animazioni custom
│   ├── layout.tsx                   # Layout globale, font Google, MouseEffect e ParticlesBackground
│   └── page.tsx                     # Pagina principale — tutte le sezioni del portfolio
│
├── public/
│   ├── CV/
│   │   └── CV Marco Simone Cannizzaro.pdf   # CV scaricabile dal portfolio
│   └── hostinger-icon.svg
│
├── CV/                              # Copia locale del CV (master)
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

### `MouseEffect.tsx`

- Cursore custom con animazione fluida e posizione "burrosa".
- **Sistema di Scroll Personalizzato**: tenendo premuto il middle mouse button appare una freccia SVG che orbita intorno al cursore e indica la direzione; lo scroll automatico fluido (powered by **Lenis**) segue la direzione della freccia.
- Parentesi tonde laterali animate che seguono il mouse sopra i pallini dello slider.
- Parentesi quadre animate che abbracciano i link dell'header al hover (hitbox aumentata via JS).
- Effetto cerchio e blending dinamico.
- Disabilitazione del comportamento predefinito del middle mouse button.

### `VerticalSliderNav.tsx`

- Slider verticale a destra, sempre visibile e centrato.
- 6 pallini per le sezioni principali (Home, About, Works, Skills, Projects, Contact).
- `mix-blend-difference` per contrasto automatico su qualsiasi sfondo.
- Area di tolleranza cliccabile espansa (48×48px).
- Effetto magnetico e feedback visivo avanzato al hover.

### `AnimatedSection.tsx`

- Wrapper per sezioni con animazioni di entrata (slide da sinistra, destra o alto).
- Trigger on-scroll tramite `react-intersection-observer`.
- Prop `showTitle` e `className` per personalizzazione completa.
- Cubic bezier `[0.22, 1, 0.36, 1]` per transizioni fluide (Framer Motion 12).

### `ParticlesBackground.tsx`

- Canvas animato con particelle interattive e linee di collegamento.
- Performance ottimizzata, nessun impatto sull'interazione.

### `HeroShape.tsx`

- **Animazione Atomo Interattivo**: nucleo cliccabile e orbite ellittiche animate.
- **Transizione Esplosione → Buco Nero**: click sul nucleo attiva esplosione delle particelle seguita da formazione di buco nero con effetto risucchio.
- Doppio sistema anti-click multiplo: `pointer-events: none` + stato `isAnimating`.
- Timing preciso: esplosione (1.2s), ingresso particelle (300ms + 200ms/particella).

### `app/api/contact/route.ts`

- API Route server-side per l'invio delle email dal form di contatto.
- Usa **Resend** — zero credenziali SMTP esposte al frontend.
- Valida tutti i campi, imposta `replyTo` sull'email del mittente.
- Restituisce JSON con `{ success: true }` o `{ error: "..." }`.

---

## 🧩 Sezioni della Pagina

- **Home**: Hero con presentazione, claim animato e shape interattiva.
- **About**: Descrizione personale con emoji animate.
- **Works**: Timeline con esperienze lavorative e formazione (nodi draggable).
- **Skills**: Griglia di skill card con icone combinate e animazioni hover.
- **Projects**: Showcase dei progetti con card animate (visibili all'entrata nella viewport).
- **Contact**: Info di contatto + form con invio reale via Resend (stati: invio, successo, errore).

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


| Pacchetto                     | Versione | Ruolo                        |
| ----------------------------- | -------- | ---------------------------- |
| `next`                        | ^16      | Framework React full-stack   |
| `react` / `react-dom`         | ^19      | UI library                   |
| `framer-motion`               | ^12      | Animazioni dichiarative      |
| `lenis`                       | ^1.3     | Smooth scroll                |
| `react-intersection-observer` | ^10      | Trigger animazioni on-scroll |
| `resend`                      | ^6       | Invio email server-side      |
| `tailwindcss`                 | ^4       | Utility CSS framework        |
| `typescript`                  | ^5.9     | Type safety                  |


