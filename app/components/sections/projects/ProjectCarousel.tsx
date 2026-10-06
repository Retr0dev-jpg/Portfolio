'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { PROJECTS, type Project } from '@/app/data/projects';
import type { StackId } from '@/app/data/skills';
import { ChevronLeftIcon, ChevronRightIcon, CodeIcon, ExternalLinkIcon } from '../../ui/Icons';
import Tag from '../../ui/Tag';
import ProjectIcon from './ProjectIcon';
import { isComingSoon, openProject } from './projectActions';

const CARD_WIDTH = 256;
const CARD_GAP = 16;
const VISIBLE_CARDS = 4;
const ARROW_GUTTER = 96;
const STEP = CARD_WIDTH + CARD_GAP;
const VIEWPORT_WIDTH = CARD_WIDTH * VISIBLE_CARDS + CARD_GAP * (VISIBLE_CARDS - 1);
const MAX_INDEX = Math.max(0, PROJECTS.length - VISIBLE_CARDS);
/** Ignore scroll events fired by our own smooth `scrollTo`. */
const PROGRAMMATIC_SCROLL_MS = 350;

const OVERLAY_BUTTON =
  'absolute top-2 w-9 h-9 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10';
const OVERLAY_BUTTON_INTERACTIVE = `${OVERLAY_BUTTON} hover:bg-gray-900/60 hover:scale-110`;

type ShowTooltip = (event: MouseEvent<HTMLElement>, label: string) => void;

interface ProjectCardProps {
  project: Project;
  onShowStack: (stack: readonly StackId[]) => void;
  onShowTooltip: ShowTooltip;
  onHideTooltip: () => void;
}

function ProjectCard({ project, onShowStack, onShowTooltip, onHideTooltip }: ProjectCardProps) {
  const comingSoon = isComingSoon(project);

  return (
    <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
      <div className={`relative h-36 bg-gradient-to-br overflow-hidden rounded-t-lg ${project.gradient}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${project.overlay}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
            <ProjectIcon icon={project.icon} className="w-7 h-7 text-accent" />
          </div>
        </div>

        {comingSoon ? (
          <button
            type="button"
            aria-label="Prossimamente"
            className={`left-2 cursor-default ${OVERLAY_BUTTON_INTERACTIVE}`}
            onMouseEnter={(event) => onShowTooltip(event, 'Prossimamente')}
            onMouseLeave={onHideTooltip}
          >
            <ExternalLinkIcon className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Apri ${project.name}`}
            onClick={() => openProject(project)}
            className={`left-2 ${OVERLAY_BUTTON_INTERACTIVE}`}
          >
            <ExternalLinkIcon className="w-4 h-4 text-white" />
          </button>
        )}

        {project.paid && (
          <div className={`left-12 cursor-default pointer-events-none ${OVERLAY_BUTTON_INTERACTIVE}`} aria-label="Progetto a pagamento">
            <span className="text-white text-xs font-bold">€</span>
          </div>
        )}

        <button
          type="button"
          aria-label={`Mostra lo stack di ${project.name}`}
          onClick={() => onShowStack(project.stack)}
          onMouseEnter={(event) => onShowTooltip(event, 'Cliccami!')}
          onMouseLeave={onHideTooltip}
          className={`right-2 ${OVERLAY_BUTTON_INTERACTIVE}`}
        >
          <CodeIcon className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">{project.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.map((tag) => (
            <Tag key={tag} className="bg-gray-100 rounded text-gray-700">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProjectCarouselProps {
  onShowStack: (stack: readonly StackId[]) => void;
  onShowTooltip: ShowTooltip;
  onHideTooltip: () => void;
}

export default function ProjectCarousel({ onShowStack, onShowTooltip, onHideTooltip }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    viewportRef.current?.scrollTo({ left: index * STEP, behavior: 'smooth' });
    const timeout = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, PROGRAMMATIC_SCROLL_MS);
    return () => clearTimeout(timeout);
  }, [index]);

  const step = (direction: -1 | 1) => {
    isProgrammaticScroll.current = true;
    setIndex((current) => Math.min(MAX_INDEX, Math.max(0, current + direction)));
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (isProgrammaticScroll.current || !viewport) return;
    setIndex(Math.round(viewport.scrollLeft / STEP));
  };

  return (
    <div className="hidden md:block relative mx-auto" style={{ maxWidth: VIEWPORT_WIDTH + ARROW_GUTTER }}>
      <CarouselArrow direction="left" disabled={index === 0} onClick={() => step(-1)} />
      <CarouselArrow direction="right" disabled={index >= MAX_INDEX} onClick={() => step(1)} />

      <div
        ref={viewportRef}
        className="overflow-x-auto mx-12 py-4 -my-4 [scrollbar-width:none]"
        style={{ width: VIEWPORT_WIDTH }}
        onScroll={handleScroll}
      >
        <div className="flex gap-4">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              onShowStack={onShowStack}
              onShowTooltip={onShowTooltip}
              onHideTooltip={onHideTooltip}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselArrow({ direction, disabled, onClick }: { direction: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  const Icon = direction === 'left' ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Progetti precedenti' : 'Progetti successivi'}
      onClick={onClick}
      disabled={disabled}
      className={`absolute ${direction === 'left' ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-accent hover:text-white hover:border-accent'}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
