# Retr0_ Portfolio

Portfolio web moderno e minimalista costruito con Next.js, con animazioni fluide, smooth scroll e form di contatto reale.

---

## 🛠️ Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis · Resend

---

## 📁 Struttura

```
app/
├── api/contact/route.ts     # Invio email via Resend + verifica Turnstile
├── components/
│   ├── effects/             # Cursore custom, smooth scroll, particelle
│   ├── layout/              # Header, footer, banner, slider nav
│   ├── sections/            # Hero, About, Works, Skills, Projects, Contact
│   └── ui/                  # Wrapper animati, shape interattiva
├── hooks/                   # useIsMobile, protezione estensioni
├── globals.css              # Stili globali + @theme Tailwind v4
├── layout.tsx               # Layout, font, effetti, analytics
└── page.tsx                 # Composizione delle sezioni
public/                      # CV e asset statici
```

---



## ✨ Caratteristiche

- **Responsive**: desktop con interazioni avanzate (nodi draggabili, cursore custom, atomo interattivo), mobile ottimizzato (menu hamburger, layout semplificati, meno particelle).
- **Animazioni**: transizioni on-scroll con Framer Motion e `react-intersection-observer`.
- **Smooth scroll**: powered by Lenis, con scroll direzionale sul middle-click (desktop).
- **Form contatti**: invio email server-side via Resend con validazione e protezione anti-bot Cloudflare Turnstile.

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

Build di produzione:

```bash
npm run build
npm start
```

---



## 📄 Licenza

Distribuito sotto **GNU GPL-3.0**: puoi usare, studiare, modificare e ridistribuire il codice, ma ogni lavoro derivato deve restare open source sotto la stessa licenza. Vedi `[LICENSE](./LICENSE)`.