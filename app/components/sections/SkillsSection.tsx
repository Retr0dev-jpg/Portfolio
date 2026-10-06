import AnimatedSection from '../ui/AnimatedSection';
import SkillsGrid from './skills/SkillsGrid';
import { SECTION_ID } from '@/app/data/navigation';

export default function SkillsSection() {
  return (
    <AnimatedSection
      id={SECTION_ID.skills}
      variant="up"
      contained={false}
      className="bg-accent min-h-[550px] flex items-center justify-center"
    >
      <div className="max-w-6xl mx-auto">
        <SkillsGrid />
      </div>
    </AnimatedSection>
  );
}
