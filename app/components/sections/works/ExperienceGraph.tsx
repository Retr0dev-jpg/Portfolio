'use client';

import { useCallback, useRef, useState, type MouseEvent } from 'react';
import {
  CV_NODE_POSITION,
  EXPERIENCES,
  EXPERIENCE_GRAPH,
  type Experience,
  type ExperienceId,
} from '@/app/data/experiences';
import { SITE } from '@/app/config/site';
import { openInNewTab } from '@/app/lib/scroll';
import { DRAG_HANDLE_ATTR, useDraggableNodes, type Point } from '@/app/hooks/useDraggableNodes';
import { DownloadIcon } from '../../ui/Icons';
import Tag from '../../ui/Tag';
import { EXPERIENCE_THEME } from './theme';

type NodeId = ExperienceId | 'cv';

const ACCENT = '#7C3AED';
const ACCENT_SOFT = '#9d4edd';
const ACCENT_FAINT = '#c4b5fd';

const INITIAL_POSITIONS = {
  ...Object.fromEntries(EXPERIENCES.map((e) => [e.id, e.node.position])),
  cv: CV_NODE_POSITION,
} as Record<NodeId, Point>;

const pct = (value: number) => `${value}%`;
const nodeStyle = ({ x, y }: Point) => ({ left: pct(x), top: pct(y), transform: 'translate(-50%, -50%)' });

function Connections({ positions }: { positions: Record<NodeId, Point> }) {
  const line = (from: ExperienceId, to: ExperienceId) => ({
    x1: pct(positions[from].x),
    y1: pct(positions[from].y),
    x2: pct(positions[to].x),
    y2: pct(positions[to].y),
  });

  return (
    <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {EXPERIENCE_GRAPH.solid.map(([from, to]) => (
        <line key={`${from}-${to}`} {...line(from, to)} stroke={ACCENT} strokeWidth="3" opacity="0.6" filter="url(#glow)" />
      ))}
      {EXPERIENCE_GRAPH.dashed.map(({ edge: [from, to], opacity, duration }) => (
        <line key={`${from}-${to}`} {...line(from, to)} stroke={ACCENT_SOFT} strokeWidth="1.5" opacity={opacity} strokeDasharray="6,4">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur={duration} repeatCount="indefinite" />
        </line>
      ))}
      {EXPERIENCE_GRAPH.faint.map(({ edge: [from, to], duration }) => (
        <line key={`${from}-${to}`} {...line(from, to)} stroke={ACCENT_FAINT} strokeWidth="1" opacity="0.25" strokeDasharray="4,6">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur={duration} repeatCount="indefinite" />
        </line>
      ))}
      {EXPERIENCE_GRAPH.pulses.map(({ edge: [from, to], begin }) => (
        <circle
          key={`${from}-${to}`}
          cx={pct((positions[from].x + positions[to].x) / 2)}
          cy={pct((positions[from].y + positions[to].y) / 2)}
          r="4"
          fill={ACCENT}
          opacity="0.6"
        >
          <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin={begin} />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin={begin} />
        </circle>
      ))}
    </svg>
  );
}

interface ExperienceNodeProps {
  experience: Experience;
  position: Point;
  isActive: boolean;
  onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function ExperienceNode({ experience, position, isActive, onMouseDown, onMouseEnter, onMouseLeave }: ExperienceNodeProps) {
  const { node, theme: themeName } = experience;
  const theme = EXPERIENCE_THEME[themeName];
  const subtitle =
    node.detailTitle === experience.organization
      ? experience.periodLong
      : `${experience.periodLong} | ${experience.organization}`;
  const placement = node.detailPlacement === 'below' ? 'top-full mt-6' : 'bottom-full mb-6';

  return (
    <div
      className={`absolute group select-none ${isActive ? 'z-30' : 'z-10'}`}
      style={nodeStyle(position)}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-full border border-accent/20 animate-pulse ${node.size}`}
          style={{ animationDuration: node.pulse.duration, animationDelay: node.pulse.delay }}
        />
        <div
          {...{ [DRAG_HANDLE_ATTR]: true }}
          className={`relative bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500 ${node.size}`}
        >
          <div className={`absolute inset-2 rounded-full bg-gradient-to-br to-white ${theme.nodeFill}`} />
          <div className="relative text-center z-10 px-4">
            <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">{experience.node.period}</div>
            {node.label.map((line) => (
              <div key={line} className="text-sm font-bold text-gray-800 leading-tight">
                {line}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`absolute left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${placement} ${node.detailWidth} ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <div className={`bg-gradient-to-r px-6 py-3 ${theme.header}`}>
            <h3 className="text-lg font-bold text-white">{node.detailTitle}</h3>
            <p className={`text-xs ${theme.headerSubtitle}`}>{subtitle}</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{experience.description}</p>
            {experience.links && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">Progetti realizzati:</p>
                <div className="space-y-1 text-xs text-gray-600 flex flex-col items-start">
                  {experience.links.map((link) => (
                    <div key={link.url} className="flex items-center gap-1 w-fit text-sm">
                      <span className="text-gray-400">•</span>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        {link.label}
                      </a>
                      {link.comingSoon && <span className="text-gray-500">(Prossimamente)</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {experience.tags.map((tag) => (
                <Tag key={tag} className={`rounded font-medium ${theme.tagStrong}`}>
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

function CvNode({ position, onMouseDown }: { position: Point; onMouseDown: (event: MouseEvent<HTMLDivElement>) => void }) {
  return (
    <div className="absolute group z-30 select-none" style={nodeStyle(position)} onMouseDown={onMouseDown}>
      <div className="relative">
        <div className="absolute inset-0 w-48 h-20 rounded-2xl border border-accent/20 bg-white/40 blur-lg" />
        <div
          {...{ [DRAG_HANDLE_ATTR]: true }}
          className="relative w-48 h-20 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg border border-gray-200 gap-1 px-4"
        >
          <div className="flex items-center gap-2 text-accent font-semibold text-sm">
            <DownloadIcon className="w-4 h-4" />
            Scarica CV
          </div>
          <p className="text-xs text-gray-500 text-center">{SITE.cv.updatedAt} · PDF</p>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<ExperienceId | null>(null);
  const [pinned, setPinned] = useState<ExperienceId | null>(null);

  const handleTap = useCallback((id: NodeId) => {
    if (id === 'cv') openInNewTab(SITE.cv.href);
    else setPinned((current) => (current === id ? null : id));
  }, []);

  const { positions, startDrag } = useDraggableNodes<NodeId>(containerRef, INITIAL_POSITIONS, handleTap);
  const activeId = pinned ?? hovered;

  return (
    <div ref={containerRef} className="hidden md:block relative w-full max-w-7xl mx-auto pt-24 pb-16 min-h-[620px]">
      <Connections positions={positions} />

      {EXPERIENCES.map((experience) => (
        <ExperienceNode
          key={experience.id}
          experience={experience}
          position={positions[experience.id]}
          isActive={activeId === experience.id}
          onMouseDown={(event) => startDrag(experience.id, event)}
          onMouseEnter={() => {
            if (!pinned || pinned === experience.id) setHovered(experience.id);
          }}
          onMouseLeave={() => setHovered((current) => (current === experience.id ? null : current))}
        />
      ))}

      <CvNode position={positions.cv} onMouseDown={(event) => startDrag('cv', event)} />
    </div>
  );
}
