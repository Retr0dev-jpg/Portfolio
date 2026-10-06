'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PROJECTS, type Project } from '@/app/data/projects';
import type { StackId } from '@/app/data/skills';
import { ChevronDownIcon, CodeIcon, ExternalLinkIcon } from '../../ui/Icons';
import ProjectIcon from './ProjectIcon';
import { isComingSoon, openProject } from './projectActions';

const PREVIEW_TAGS = 2;

interface ProjectTileProps {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
  onShowStack: (stack: readonly StackId[]) => void;
}

function ProjectTile({ project, isOpen, onToggle, onShowStack }: ProjectTileProps) {
  const comingSoon = isComingSoon(project);

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-colors duration-200 ${isOpen ? 'border-accent/40' : 'border-gray-200'}`}
    >
      <button type="button" aria-expanded={isOpen} onClick={onToggle} className="w-full flex items-center gap-3 p-3 text-left">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm ${project.gradient}`}>
          <ProjectIcon icon={project.icon} className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`font-semibold text-sm transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-gray-900'}`}>
            {project.name}
          </span>
          <div className="flex gap-1 mt-0.5">
            {project.tags.slice(0, PREVIEW_TAGS).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-[10px] rounded text-gray-500">
                {tag}
              </span>
            ))}
            {comingSoon && <span className="px-1.5 py-0.5 bg-accent/10 text-[10px] rounded text-accent font-medium">Soon</span>}
          </div>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{project.descriptionShort}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {comingSoon ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs rounded-lg text-gray-400">
                    <ExternalLinkIcon className="w-4 h-4 text-white" />
                    <span className="text-gray-500">Prossimamente</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => openProject(project)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs rounded-lg active:scale-95 transition-transform"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                    Visita
                  </button>
                )}
                {project.paid && (
                  <span className="inline-flex items-center px-2.5 py-1.5 bg-green-50 text-xs rounded-lg text-green-700 font-medium">
                    Progetto a pagamento
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onShowStack(project.stack)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/80 text-white text-xs rounded-lg active:scale-95 transition-transform ml-auto"
                >
                  <CodeIcon className="w-3.5 h-3.5" />
                  Stack
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectAccordion({ onShowStack }: { onShowStack: (stack: readonly StackId[]) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="md:hidden w-full px-4 space-y-2">
      {PROJECTS.map((project) => (
        <ProjectTile
          key={project.name}
          project={project}
          isOpen={expanded === project.name}
          onToggle={() => setExpanded((current) => (current === project.name ? null : project.name))}
          onShowStack={onShowStack}
        />
      ))}
    </div>
  );
}
