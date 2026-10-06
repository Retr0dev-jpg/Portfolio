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
  {
    name: 'VoxelPanel',
    description: 'Pannello desktop multipiattaforma per creare e gestire server Minecraft in locale: plugin, mod, proxy, modpack, RCON, TPS live e automazioni pianificate.',
    descriptionShort: 'Pannello desktop per server Minecraft locali: plugin, mod, modpack, RCON e automazioni.',
    tags: ['Flutter', 'Rust', 'Desktop'],
    gradient: 'from-emerald-100 to-emerald-200',
    overlay: 'from-emerald-400/20 to-lime-400/20',
    icon: {
      d: 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z',
    },
    target: { kind: 'external', url: 'https://github.com/Retr0dev-jpg/VoxelPanel' },
    stack: ['backend', 'git'],
  },
  {
    name: 'Markdown MkII',
    description: 'Gestore di note Markdown per Windows: archivio SQLite locale, anteprima nativa, ricerca full-text, cronologia delle versioni e note cifrate con AES-256 e Windows Hello.',
    descriptionShort: 'Note Markdown locali per Windows: ricerca full-text, versioni e note cifrate AES-256.',
    tags: ['C#', 'WinUI 3', 'SQLite'],
    gradient: 'from-teal-100 to-teal-200',
    overlay: 'from-teal-400/20 to-cyan-400/20',
    icon: {
      d: 'M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z',
    },
    target: { kind: 'external', url: 'https://github.com/Retr0dev-jpg/markdown-mkii' },
    stack: ['cfamily', 'databases', 'git'],
  },
  {
    name: 'VisualMaid',
    description: 'Editor Mermaid self-hosted senza limiti di diagrammi, pubblicità o account: cartelle con drag-and-drop, export SVG/PNG e versione desktop o web.',
    descriptionShort: 'Editor Mermaid self-hosted, senza limiti né account: desktop o web.',
    tags: ['React', 'Electron', 'Express'],
    gradient: 'from-indigo-100 to-indigo-200',
    overlay: 'from-indigo-400/20 to-sky-400/20',
    icon: {
      d: 'M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z',
    },
    target: { kind: 'external', url: 'https://github.com/Retr0dev-jpg/VisualMaid' },
    stack: ['frontend', 'backend', 'databases', 'git'],
  },
];
