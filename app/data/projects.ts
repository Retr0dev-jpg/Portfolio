import type { StackId } from './skills';

export type ProjectTarget =
  | { kind: 'external'; url: string }
  | { kind: 'scroll-top' }
  | { kind: 'coming-soon' };

export interface Project {
  name: string;
  description: string;
  descriptionShort: string;
  tags: readonly string[];
  gradient: string;
  overlay: string;
  /** Path data for a 20×20 viewBox. */
  icon: { d: string; evenOdd?: boolean };
  target: ProjectTarget;
  paid?: boolean;
  stack: readonly StackId[];
}

export const PROJECTS: readonly Project[] = [
  {
    name: 'Community',
    description: 'Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti pubblicati con pipeline CI/CD automatizzata.',
    descriptionShort: 'Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti.',
    tags: ['Vercel', 'Next.js', 'Tailwind'],
    gradient: 'from-slate-100 to-slate-200',
    overlay: 'from-indigo-400/20 to-slate-500/20',
    icon: { d: 'M4 3a1 1 0 000 2h1v10H4a1 1 0 000 2h12a1 1 0 000-2h-1V5h1a1 1 0 000-2H4zm5 2v10h2V5H9z' },
    target: { kind: 'coming-soon' },
    stack: ['frontend', 'backend', 'hosting', 'databases', 'git'],
  },
  {
    name: 'Memolee',
    description: 'Portfolio musicale per un giovane artista turco emergente: showcase dei brani, biografia e presenza online curata.',
    descriptionShort: 'Portfolio musicale per un giovane artista emergente: brani, bio e presenza online.',
    tags: ['React', 'Vercel', 'Portfolio'],
    gradient: 'from-pink-100 to-pink-200',
    overlay: 'from-pink-400/20 to-rose-400/20',
    icon: {
      d: 'M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z',
      evenOdd: true,
    },
    target: { kind: 'external', url: 'https://memolee.vercel.app/' },
    stack: ['frontend', 'hosting', 'git'],
  },
  {
    name: 'Portfolio',
    description: 'Nuovo ecosistema personale: design system proprietario, esperimenti UI e spazio community/lab in continua evoluzione.',
    descriptionShort: 'Ecosistema personale: design system proprietario, esperimenti UI e community/lab.',
    tags: ['Next.js', 'Vercel', 'Framer Motion'],
    gradient: 'from-orange-100 to-orange-200',
    overlay: 'from-orange-400/20 to-red-400/20',
    icon: {
      d: 'M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
      evenOdd: true,
    },
    target: { kind: 'scroll-top' },
    stack: ['frontend', 'hosting', 'git'],
  },
  {
    name: 'Passoetiro',
    description: 'Magazine digitale con redazione multi-autore, agenda eventi e ottimizzazione SEO dedicata al basket nazionale.',
    descriptionShort: 'Magazine digitale con redazione multi-autore e ottimizzazione SEO.',
    tags: ['WordPress', 'PHP', 'Hostinger'],
    gradient: 'from-blue-100 to-blue-200',
    overlay: 'from-blue-400/20 to-cyan-400/20',
    icon: {
      d: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z',
      evenOdd: true,
    },
    target: { kind: 'external', url: 'https://passoetiro.com' },
    paid: true,
    stack: ['hosting', 'php', 'databases'],
  },
  {
    name: 'Molisebasket',
    description: 'Restyling completo del portale ufficiale: risultati live, roster dinamici e CMS headless per la redazione.',
    descriptionShort: 'Restyling portale: risultati live, roster dinamici e CMS headless.',
    tags: ['Hostinger', 'Cloudflare'],
    gradient: 'from-purple-100 to-purple-200',
    overlay: 'from-accent/20 to-purple-400/20',
    icon: {
      d: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z',
    },
    target: { kind: 'external', url: 'https://new.molisebasket.net' },
    paid: true,
    stack: ['hosting', 'databases'],
  },
];
