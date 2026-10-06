import Image from 'next/image';
import type { IconSlot, Skill } from '@/app/data/skills';
import type { HighlightState } from '@/app/context/StackHighlightContext';

// `icon-*` hooks are styled in globals.css (hover scale + responsive sizes).
const SLOT_CLASS: Record<IconSlot, string> = {
  'top-left': 'top-1 left-1 icon-top-left',
  'top-right': 'top-1 right-1 icon-top-right',
  'bottom-left': 'bottom-1 left-1 icon-bottom-left',
  'bottom-right': 'bottom-1 right-1 icon-bottom-right',
  'bottom-center': 'bottom-1 left-1/2 -translate-x-1/2 z-10 icon-bottom-center',
};

const HIGHLIGHT_CLASS: Record<HighlightState, string> = {
  active: 'shaking',
  fading: 'fading-out',
};

const ICON_PX = 48;

export default function SkillCard({ skill, highlight }: { skill: Skill; highlight?: HighlightState }) {
  const [primary] = skill.icons;
  const isSingle = skill.icons.length === 1;

  return (
    <div className={`skill-card ${highlight ? HIGHLIGHT_CLASS[highlight] : ''}`}>
      <div className="skill-card-content">
        {isSingle ? (
          <Image src={primary.src} alt={primary.name} width={ICON_PX} height={ICON_PX} unoptimized draggable={false} className="skill-icon" />
        ) : (
          <div className="relative w-20 h-20 mt-auto skill-icon-container">
            {skill.icons.map((icon) => (
              <Image
                key={icon.name}
                src={icon.src}
                alt={icon.name}
                width={ICON_PX}
                height={ICON_PX}
                unoptimized
                draggable={false}
                className={`absolute transition-all duration-300 ${skill.iconSize} ${SLOT_CLASS[icon.slot ?? 'top-left']}`}
              />
            ))}
          </div>
        )}
        <span className="skill-name">{skill.name}</span>
      </div>
    </div>
  );
}
