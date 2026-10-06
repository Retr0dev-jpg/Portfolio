'use client';

import { SKILLS } from '@/app/data/skills';
import { useStackHighlights } from '@/app/context/StackHighlightContext';
import SkillCard from './SkillCard';

export default function SkillsGrid() {
  const highlights = useStackHighlights();

  return (
    <div className="skills-grid">
      {SKILLS.map((skill) => (
        <SkillCard key={skill.id} skill={skill} highlight={highlights[skill.id]} />
      ))}
    </div>
  );
}
