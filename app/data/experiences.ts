export type ExperienceId = 'metapack' | 'freelance' | 'diploma' | 'pcto';
export type ExperienceTheme = 'purple' | 'blue' | 'orange' | 'green';

export interface ExperienceLink {
  label: string;
  url: string;
  comingSoon?: boolean;
}

export interface Experience {
  id: ExperienceId;
  /** Watermark shown on the mobile card (reverse chronological count). */
  order: string;
  theme: ExperienceTheme;
  periodShort: string;
  periodLong: string;
  role: string;
  organization: string;
  description: string;
  tags: readonly string[];
  links?: readonly ExperienceLink[];
  /** Desktop graph node. */
  node: {
    period: string;
    label: readonly string[];
    detailTitle: string;
    size: 'w-32 h-32' | 'w-36 h-36' | 'w-40 h-40';
    detailWidth: 'w-80' | 'w-96';
    detailPlacement: 'above' | 'below';
    pulse: { duration: string; delay?: string };
    position: { x: number; y: number };
  };
}

export const EXPERIENCES: readonly Experience[] = [
  {
    id: 'metapack',
    order: '04',
    theme: 'purple',
    periodShort: 'Ott 2025 – Giu 2026',
    periodLong: 'Ottobre 2025 - Giugno 2026',
    role: 'Software Specialist',
    organization: 'Metapack Engineering Srl',
    description: 'Sviluppo di applicazioni HMI in ambiente .NET (C#/VB.NET), con AI a supporto dello sviluppo.',
    tags: ['Automazione', 'Serializzazione', 'VB.NET'],
    node: {
      period: 'Ott 2025 - Giu 2026',
      label: ['Software Specialist'],
      detailTitle: 'Metapack Engineering Srl',
      size: 'w-40 h-40',
      detailWidth: 'w-80',
      detailPlacement: 'below',
      pulse: { duration: '4s' },
      position: { x: 15, y: 30 },
    },
  },
  {
    id: 'freelance',
    order: '03',
    theme: 'blue',
    periodShort: 'Giu – Ott 2025',
    periodLong: 'Giugno 2025 - Ottobre 2025',
    role: 'Freelance Developer',
    organization: 'Freelancer',
    description: 'Progettazione e realizzazione di prodotti digitali su misura: dal discovery al deploy, con focus su scalabilità, manutenibilità e valore per il business.',
    tags: ['React', 'Hosting', 'Wordpress', 'Web Design'],
    links: [
      { label: 'new.molisebasket.net', url: 'https://new.molisebasket.net' },
      { label: 'www.passoetiro.com', url: 'https://www.passoetiro.com' },
      { label: 'retr0hub.dev', url: 'https://retr0hub.dev' },
      { label: 'memolee.vercel.app', url: 'https://memolee.vercel.app/' },
      { label: 'lab.retr0hub.dev', url: 'https://lab.retr0hub.dev', comingSoon: true },
    ],
    node: {
      period: 'Giu - Ott 2025',
      label: ['Freelance', 'Developer'],
      detailTitle: 'Freelancer',
      size: 'w-36 h-36',
      detailWidth: 'w-96',
      detailPlacement: 'below',
      pulse: { duration: '4.5s', delay: '0.5s' },
      position: { x: 45, y: 50 },
    },
  },
  {
    id: 'diploma',
    order: '02',
    theme: 'orange',
    periodShort: '2020 – 2025',
    periodLong: '2020 - 2025',
    role: 'Diploma IT',
    organization: 'IIS Galilei Sani, Latina',
    description: 'Indirizzo Informatica e Telecomunicazioni (sviluppo base di software, siti web, reti e sistemi informatici).',
    tags: ['Sviluppo Software', 'Siti Web', 'Reti', 'Sistemi IT'],
    node: {
      period: '2020 - 2025',
      label: ['Diploma'],
      detailTitle: 'Diploma',
      size: 'w-32 h-32',
      detailWidth: 'w-80',
      detailPlacement: 'above',
      pulse: { duration: '3.5s', delay: '0.3s' },
      position: { x: 85, y: 30 },
    },
  },
  {
    id: 'pcto',
    order: '01',
    theme: 'green',
    periodShort: 'Giu – Ago 2024',
    periodLong: 'Giugno 2024 - Agosto 2024',
    role: 'Tecnico di Lab. (PCTO)',
    organization: 'MTECH SOLUTIONS Srl',
    description: 'Setup tecnico di workstation e periferiche, diagnostica sistemistica e supporto utente in ambito IT.',
    tags: ['Configurazione HW', 'Analisi Guasti', 'Manutenzione'],
    node: {
      period: 'Giu - Ago 2024',
      label: ['Tecnico Lab', 'PCTO'],
      detailTitle: 'Apprendista Tecnico di Laboratorio',
      size: 'w-36 h-36',
      detailWidth: 'w-80',
      detailPlacement: 'above',
      pulse: { duration: '5s', delay: '1s' },
      position: { x: 50, y: 80 },
    },
  },
];

type Edge = readonly [ExperienceId, ExperienceId];

/** Connections drawn between desktop nodes, grouped by stroke style. */
export const EXPERIENCE_GRAPH = {
  solid: [
    ['pcto', 'diploma'],
    ['diploma', 'freelance'],
    ['freelance', 'metapack'],
  ] as readonly Edge[],
  dashed: [
    { edge: ['pcto', 'freelance'] as Edge, opacity: 0.35, duration: '3s' },
    { edge: ['pcto', 'metapack'] as Edge, opacity: 0.3, duration: '3.5s' },
    { edge: ['diploma', 'metapack'] as Edge, opacity: 0.35, duration: '4s' },
  ],
  faint: [
    { edge: ['metapack', 'diploma'] as Edge, duration: '5s' },
    { edge: ['freelance', 'pcto'] as Edge, duration: '4.5s' },
  ],
  pulses: [
    { edge: ['metapack', 'freelance'] as Edge, begin: '0s' },
    { edge: ['freelance', 'diploma'] as Edge, begin: '0.7s' },
    { edge: ['diploma', 'pcto'] as Edge, begin: '1.4s' },
  ],
} as const;

export const CV_NODE_POSITION = { x: 50, y: 0 } as const;
