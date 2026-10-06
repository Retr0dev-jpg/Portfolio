# Retr0_ Portfolio

Portfolio web moderno e minimalista costruito con Next.js, con animazioni fluide, smooth scroll e form di contatto reale.

---

## 🛠️ Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis · Resend

---

## 📁 Struttura

```
app/
├── api/contact/route.ts     # Endpoint del form: rate limit → zod → Turnstile → Resend
├── config/site.ts           # Brand, URL, social, CV, feature flag (unica fonte)
├── data/                    # Contenuti: navigazione, hero, esperienze, skill, progetti
├── context/                 # StackHighlightContext (progetto → skill evidenziate)
├── hooks/                   # Sezione attiva, Lenis, drag dei nodi, form contatti, ...
├── lib/
│   ├── contact/             # Schema, limiti, rate limit, Turnstile, template email
│   └── ...                  # math, scroll, time, cursorEvents, email offuscata
├── components/
│   ├── effects/             # Cursore custom, smooth scroll, particelle (solo client)
│   ├── layout/              # SiteShell, Header, MobileMenu, slider nav, banner, footer
│   ├── sections/            # Una sezione per file + sottocartella con i suoi componenti
│   └── ui/                  # Primitive riusabili: icone, tag, tooltip, AnimatedSection, atomo
├── globals.css              # @theme Tailwind v4, stili base, animazioni
├── layout.tsx               # Metadata, font, analytics
└── page.tsx                 # Composizione delle sezioni (server component)
public/                      # CV e asset statici
docs/ai/                     # Guide per agenti AI (architettura, convenzioni, ricette, insidie)
AGENTS.md                    # Entrypoint per agenti AI (CLAUDE.md lo importa)
```

Per modificare i contenuti basta toccare `app/data/` e `app/config/site.ts`: i componenti li leggono da lì.

---



## ✨ Caratteristiche

- **Responsive**: desktop con interazioni avanzate (nodi draggabili, cursore custom, atomo interattivo), mobile ottimizzato (menu hamburger, layout semplificati, meno particelle).
- **Animazioni**: transizioni on-scroll con Framer Motion (`whileInView` / `useInView`); le animazioni continue usano `requestAnimationFrame` sui ref, senza re-render, e si fermano fuori viewport.
- **Smooth scroll**: powered by Lenis, con scroll direzionale sul middle-click (desktop).
- **Form contatti**: invio email server-side via Resend con validazione zod, rate limit per IP e protezione anti-bot Cloudflare Turnstile.
- **Footer**: le stelle GitHub sono lette lato server e rivalidate ogni ora (ISR).

---



## ⚙️ Setup

**Prerequisiti:** Node.js 20+ e un account [Resend](https://resend.com) per il form.

```bash
git clone https://github.com/Retr0dev-jpg/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Crea un file `.env.local` nella root:

```env
# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM=onboarding@resend.dev
CONTACT_EMAIL_TO=tua@email.com

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# Opzionali
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=true
NEXT_PUBLIC_SHOW_BANNER=false
NEXT_PUBLIC_CV_UPDATED_AT=06/07/2026
```

In sviluppo Turnstile usa automaticamente le chiavi di test di Cloudflare. In produzione `TURNSTILE_SECRET_KEY` è obbligatoria: se manca, il form rifiuta gli invii invece di accettarli senza verifica.

Build di produzione:

```bash
npm run build
npm start
```

---



## 📄 Licenza

Distribuito sotto **GNU GPL-3.0**: puoi usare, studiare, modificare e ridistribuire il codice, ma ogni lavoro derivato deve restare open source sotto la stessa licenza. Vedi [LICENSE](./LICENSE).