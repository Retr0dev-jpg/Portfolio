export type StackId =
  | 'frontend'
  | 'backend'
  | 'hosting'
  | 'cfamily'
  | 'php'
  | 'java'
  | 'databases'
  | 'python'
  | 'git'
  | 'cloud'
  | 'editor'
  | 'containers';

export type IconSlot = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';

export interface SkillIcon {
  name: string;
  src: string;
  slot?: IconSlot;
}

export interface Skill {
  id: StackId;
  name: string;
  icons: readonly SkillIcon[];
  /** Tailwind size for multi-icon cards; single-icon cards use `.skill-icon`. */
  iconSize?: 'w-7 h-7' | 'w-8 h-8' | 'w-9 h-9';
}

const devicon = (slug: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;

export const SKILLS: readonly Skill[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    iconSize: 'w-7 h-7',
    icons: [
      { name: 'React', src: devicon('react'), slot: 'top-left' },
      { name: 'Angular', src: devicon('angular'), slot: 'top-right' },
      { name: 'JavaScript', src: devicon('javascript'), slot: 'bottom-left' },
      { name: 'TypeScript', src: devicon('typescript'), slot: 'bottom-right' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    iconSize: 'w-7 h-7',
    icons: [
      { name: 'Node.js', src: devicon('nodejs'), slot: 'top-left' },
      { name: 'Go', src: devicon('go'), slot: 'top-right' },
      { name: 'Rust', src: devicon('rust'), slot: 'bottom-center' },
    ],
  },
  {
    id: 'hosting',
    name: 'Hosting',
    iconSize: 'w-7 h-7',
    icons: [
      { name: 'WordPress', src: devicon('wordpress'), slot: 'top-left' },
      { name: 'Nginx', src: devicon('nginx'), slot: 'top-right' },
      { name: 'Apache', src: devicon('apache'), slot: 'bottom-left' },
      { name: 'Hostinger', src: '/icons/hostinger.svg', slot: 'bottom-right' },
    ],
  },
  {
    id: 'cfamily',
    name: 'C Family',
    iconSize: 'w-8 h-8',
    icons: [
      { name: 'C', src: devicon('c'), slot: 'top-left' },
      { name: 'C++', src: devicon('cplusplus'), slot: 'top-right' },
      { name: 'C#', src: devicon('csharp'), slot: 'bottom-center' },
    ],
  },
  { id: 'php', name: 'PHP', icons: [{ name: 'PHP', src: devicon('php') }] },
  { id: 'java', name: 'Java', icons: [{ name: 'Java', src: devicon('java') }] },
  {
    id: 'databases',
    name: 'Databases',
    iconSize: 'w-9 h-9',
    icons: [
      { name: 'MySQL', src: devicon('mysql'), slot: 'top-left' },
      { name: 'PostgreSQL', src: devicon('postgresql'), slot: 'bottom-right' },
    ],
  },
  { id: 'python', name: 'Python', icons: [{ name: 'Python', src: devicon('python') }] },
  { id: 'git', name: 'Git', icons: [{ name: 'Git', src: devicon('git') }] },
  {
    id: 'cloud',
    name: 'Cloud',
    iconSize: 'w-9 h-9',
    icons: [
      { name: 'AWS', src: devicon('amazonwebservices', 'original-wordmark'), slot: 'top-left' },
      { name: 'Azure', src: devicon('azure'), slot: 'bottom-right' },
    ],
  },
  {
    id: 'editor',
    name: 'Editor',
    iconSize: 'w-9 h-9',
    icons: [
      { name: 'IntelliJ', src: devicon('intellij'), slot: 'top-left' },
      { name: 'Cursor', src: '/icons/cursor.svg', slot: 'bottom-right' },
    ],
  },
  {
    id: 'containers',
    name: 'Containers',
    iconSize: 'w-9 h-9',
    icons: [
      { name: 'Docker', src: devicon('docker'), slot: 'top-left' },
      { name: 'Kubernetes', src: devicon('kubernetes'), slot: 'bottom-right' },
    ],
  },
];
