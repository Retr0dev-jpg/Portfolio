import type { ReactNode } from 'react';
import { SITE } from '@/app/config/site';
import ObfuscatedEmail from '../../ui/ObfuscatedEmail';

const LINK_CLASS = 'text-accent font-medium text-base md:text-lg truncate block';

const externalLink = (url: string, label: string) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
    {label}
  </a>
);

const CHANNELS: { label: string; emoji: string; gradient: string; value: ReactNode }[] = [
  {
    label: 'Email',
    emoji: '📧',
    gradient: 'from-blue-100 to-blue-200',
    value: <ObfuscatedEmail className={LINK_CLASS} subject="Richiesta dal portfolio" />,
  },
  {
    label: 'LinkedIn',
    emoji: '💼',
    gradient: 'from-red-100 to-red-200',
    value: externalLink(SITE.socials.linkedin.url, SITE.socials.linkedin.label),
  },
  {
    label: 'GitHub',
    emoji: '🐙',
    gradient: 'from-pink-100 to-pink-200',
    value: externalLink(SITE.socials.github.url, SITE.socials.github.label),
  },
];

export default function ContactInfo() {
  return (
    <div className="space-y-4 relative z-10">
      {CHANNELS.map(({ label, emoji, gradient, value }) => (
        <div key={label} className="flex items-center gap-4 group">
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0 ${gradient}`}
          >
            <span className="text-2xl md:text-3xl">{emoji}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
