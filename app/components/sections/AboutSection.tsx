import { SITE } from '@/app/config/site';
import { ABOUT } from '@/app/data/about';
import { SECTION_ID } from '@/app/data/navigation';

const EMOJI_SHADOW = 'drop-shadow-[0_10px_10px_rgba(0,0,0,0.25)]';

const FLOATING_EMOJIS = [
  { emoji: '💻', className: 'left-4 md:left-20 top-1/4 text-3xl md:text-7xl rotate-[-15deg] opacity-30 md:opacity-70 emoji-up-down-1' },
  { emoji: '📱', className: 'hidden md:block left-40 bottom-1/4 text-6xl rotate-[10deg] opacity-60 emoji-up-down-2' },
  { emoji: '⚙️', className: 'hidden md:block left-10 bottom-1/3 text-5xl rotate-[-5deg] opacity-50 emoji-down-up-1' },
  { emoji: '🎨', className: 'right-4 md:right-20 top-1/3 text-3xl md:text-7xl rotate-[15deg] opacity-30 md:opacity-70 emoji-up-down-3' },
  { emoji: '✨', className: 'hidden md:block right-40 top-1/4 text-6xl rotate-[-8deg] opacity-60 emoji-down-up-2' },
  { emoji: '🚀', className: 'right-6 md:right-10 bottom-1/4 text-3xl md:text-5xl rotate-[5deg] opacity-25 md:opacity-50 emoji-up-down-4' },
];

export default function AboutSection() {
  return (
    <section
      id={SECTION_ID.about}
      className="bg-accent min-h-[280px] md:min-h-[550px] flex items-center justify-center relative overflow-hidden"
    >
      {FLOATING_EMOJIS.map(({ emoji, className }) => (
        <div key={emoji} aria-hidden="true" className={`absolute ${EMOJI_SHADOW} ${className}`}>
          {emoji}
        </div>
      ))}

      <div className="flex flex-col items-center text-center z-10 px-6 max-w-lg mx-auto gap-5">
        <h2 className="text-white font-mono text-3xl md:text-4xl font-bold tracking-tight leading-snug">{SITE.owner}</h2>
        <div className="w-10 h-px bg-white/25" />
        <div className="flex flex-col gap-3">
          {ABOUT.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-white/70 text-sm md:text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="text-white text-sm md:text-base italic font-normal">{ABOUT.motto}</p>
      </div>
    </section>
  );
}
