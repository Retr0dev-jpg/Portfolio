'use client';

import { useState } from 'react';
import { EXPERIENCES, type Experience, type ExperienceId } from '@/app/data/experiences';
import { SITE } from '@/app/config/site';
import { openInNewTab } from '@/app/lib/scroll';
import { ChevronDownIcon, ChevronRightIcon, DownloadIcon } from '../../ui/Icons';
import Tag from '../../ui/Tag';
import { EXPERIENCE_THEME } from './theme';

function ExperienceCard({ experience, isOpen, onToggle }: { experience: Experience; isOpen: boolean; onToggle: () => void }) {
  const theme = EXPERIENCE_THEME[experience.theme];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        aria-expanded={isOpen}
        className="w-full p-4 text-left flex items-start gap-3 relative overflow-hidden"
        onClick={onToggle}
      >
        <span
          aria-hidden="true"
          className={`absolute right-10 top-1/2 -translate-y-1/2 text-8xl font-black opacity-[0.06] select-none leading-none pointer-events-none ${theme.watermark}`}
        >
          {experience.order}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ring-4 ${theme.dot}`} />
        <div className="flex-1 min-w-0">
          <span className="text-xs text-gray-400 font-mono">{experience.periodShort}</span>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{experience.role}</h3>
          <p className={`text-sm font-medium mt-0.5 ${theme.accentText}`}>{experience.organization}</p>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-300 mt-1 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* grid-rows 0fr→1fr animates to the content's real height. */}
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className={`px-4 pb-4 border-t ${theme.divider}`}>
            <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-3">{experience.description}</p>
            {experience.links && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Progetti realizzati:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  {experience.links.map((link) => (
                    <div key={link.url} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-all">
                        {link.label}
                      </a>
                      {link.comingSoon && <span className="text-gray-400 text-xs shrink-0">(Prossimamente)</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {experience.tags.map((tag) => (
                <Tag key={tag} className={`rounded-md font-medium ${theme.tag}`}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceAccordion() {
  const [expanded, setExpanded] = useState<ExperienceId | null>(EXPERIENCES[0].id);

  return (
    <div className="md:hidden w-full space-y-3">
      {EXPERIENCES.map((experience) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          isOpen={expanded === experience.id}
          onToggle={() => setExpanded((current) => (current === experience.id ? null : experience.id))}
        />
      ))}

      <button
        type="button"
        onClick={() => openInNewTab(SITE.cv.href)}
        className="w-full mt-1 rounded-2xl bg-gradient-to-r from-accent to-violet-400 p-4 flex items-center gap-3 shadow-lg shadow-accent/20 active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <DownloadIcon className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <p className="font-bold text-white text-sm">Scarica CV</p>
          <p className="text-xs text-white/70">{SITE.cv.updatedAt} · PDF</p>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-white/50 ml-auto shrink-0" />
      </button>
    </div>
  );
}
