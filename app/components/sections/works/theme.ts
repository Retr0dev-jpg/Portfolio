import type { ExperienceTheme } from '@/app/data/experiences';

// Full class names are spelled out so Tailwind can detect them at build time.
export const EXPERIENCE_THEME: Record<
  ExperienceTheme,
  {
    dot: string;
    watermark: string;
    accentText: string;
    divider: string;
    tag: string;
    tagStrong: string;
    header: string;
    headerSubtitle: string;
    nodeFill: string;
  }
> = {
  purple: {
    dot: 'bg-purple-500 ring-purple-100',
    watermark: 'text-purple-500',
    accentText: 'text-purple-500',
    divider: 'border-purple-50',
    tag: 'bg-purple-50 text-purple-600',
    tagStrong: 'bg-purple-100 text-purple-700',
    header: 'from-purple-500 to-purple-600',
    headerSubtitle: 'text-purple-100',
    nodeFill: 'from-purple-50',
  },
  blue: {
    dot: 'bg-blue-500 ring-blue-100',
    watermark: 'text-blue-500',
    accentText: 'text-blue-500',
    divider: 'border-blue-50',
    tag: 'bg-blue-50 text-blue-600',
    tagStrong: 'bg-blue-100 text-blue-700',
    header: 'from-blue-500 to-blue-600',
    headerSubtitle: 'text-blue-100',
    nodeFill: 'from-blue-50',
  },
  orange: {
    dot: 'bg-orange-500 ring-orange-100',
    watermark: 'text-orange-500',
    accentText: 'text-orange-500',
    divider: 'border-orange-50',
    tag: 'bg-orange-50 text-orange-600',
    tagStrong: 'bg-orange-100 text-orange-700',
    header: 'from-orange-500 to-orange-600',
    headerSubtitle: 'text-orange-100',
    nodeFill: 'from-orange-50',
  },
  green: {
    dot: 'bg-green-500 ring-green-100',
    watermark: 'text-green-500',
    accentText: 'text-green-600',
    divider: 'border-green-50',
    tag: 'bg-green-50 text-green-600',
    tagStrong: 'bg-green-100 text-green-700',
    header: 'from-green-500 to-green-600',
    headerSubtitle: 'text-green-100',
    nodeFill: 'from-green-50',
  },
};
