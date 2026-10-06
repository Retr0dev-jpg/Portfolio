'use client';

import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { useInView } from 'framer-motion';
import AnimatedSection from '../ui/AnimatedSection';
import DotDivider from '../ui/DotDivider';
import FloatingTooltip, { anchorAbove, type TooltipAnchor } from '../ui/FloatingTooltip';
import ProjectCarousel from './projects/ProjectCarousel';
import ProjectAccordion from './projects/ProjectAccordion';
import { SECTION_ID } from '@/app/data/navigation';
import { useHighlightStack } from '@/app/context/StackHighlightContext';

export default function ProjectsSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(contentRef, { once: true, amount: 0.3 });
  const highlightStack = useHighlightStack();
  const [tooltip, setTooltip] = useState<TooltipAnchor | null>(null);

  const showTooltip = useCallback((event: MouseEvent<HTMLElement>, label: string) => {
    setTooltip(anchorAbove(event.currentTarget, label));
  }, []);
  const hideTooltip = useCallback(() => setTooltip(null), []);

  return (
    <>
      <AnimatedSection id={SECTION_ID.projects} variant="left" className="max-md:min-h-fit max-md:py-10">
        <div ref={contentRef}>
          <div className="max-w-6xl mx-auto mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-center">
              <span className="text-accent">Progetti in</span>
              <br />
              <span className="relative inline-block px-2">
                <span className="relative z-0">evidenza</span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 w-full h-[110%] bg-yellow-300/50 -rotate-1 z-10 origin-left ${isVisible ? 'animate-highlight-draw' : 'opacity-0'}`}
                  style={{ animationDelay: isVisible ? '0.5s' : '0s', animationFillMode: 'forwards' }}
                />
              </span>
            </h2>
          </div>

          <ProjectCarousel onShowStack={highlightStack} onShowTooltip={showTooltip} onHideTooltip={hideTooltip} />
          <ProjectAccordion onShowStack={highlightStack} />
        </div>
      </AnimatedSection>

      <DotDivider />
      <FloatingTooltip anchor={tooltip} />
    </>
  );
}
