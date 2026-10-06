import AnimatedSection from '../ui/AnimatedSection';
import ExperienceAccordion from './works/ExperienceAccordion';
import ExperienceGraph from './works/ExperienceGraph';
import { SECTION_ID } from '@/app/data/navigation';

export default function WorksSection() {
  return (
    <AnimatedSection id={SECTION_ID.works} variant="right">
      <ExperienceAccordion />
      <ExperienceGraph />
    </AnimatedSection>
  );
}
