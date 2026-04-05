'use client';
import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../ui/AnimatedSection';
import { buildContactMailtoHref } from '@/app/lib/contactEmail';

interface ProjectData {
  name: string;
  description: string;
  descriptionShort: string;
  tags: string[];
  gradient: string;
  overlay: string;
  icon: ReactNode;
  url?: string;
  urlAction?: () => void;
  comingSoon?: boolean;
  stackIds?: string[];
  extraButtons?: { action?: () => void; label: ReactNode; position: string; isTag?: boolean }[];
}

const LinkIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const PROJECTS: ProjectData[] = [
  {
    name: 'Community',
    description: 'Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti pubblicati con pipeline CI/CD automatizzata.',
    descriptionShort: 'Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti.',
    tags: ['Astro', 'MDX', 'Cloudflare'],
    gradient: 'from-slate-100 to-slate-200',
    overlay: 'from-indigo-400/20 to-slate-500/20',
    icon: <path d="M4 3a1 1 0 000 2h1v10H4a1 1 0 000 2h12a1 1 0 000-2h-1V5h1a1 1 0 000-2H4zm5 2v10h2V5H9z" />,
    comingSoon: true,
    stackIds: ['frontend', 'backend', 'containers', 'databases', 'hosting', 'git'],
  },
  {
    name: 'Portfolio',
    description: 'Nuovo ecosistema personale: design system proprietario, esperimenti UI e spazio community/lab in continua evoluzione.',
    descriptionShort: 'Ecosistema personale: design system proprietario, esperimenti UI e community/lab.',
    tags: ['Next.js 15', 'Framer Motion', 'Turbopack'],
    gradient: 'from-orange-100 to-orange-200',
    overlay: 'from-orange-400/20 to-red-400/20',
    icon: <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />,
    urlAction: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    stackIds: ['frontend', 'hosting', 'git'],
  },
  {
    name: 'Passoetiro',
    description: 'Magazine digitale con redazione multi-autore, agenda eventi e ottimizzazione SEO dedicata al basket nazionale.',
    descriptionShort: 'Magazine digitale con redazione multi-autore e ottimizzazione SEO.',
    tags: ['Next.js', 'MDX', 'Tailwind'],
    gradient: 'from-blue-100 to-blue-200',
    overlay: 'from-blue-400/20 to-cyan-400/20',
    icon: <><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></>,
    url: 'https://passoetiro.com',
    stackIds: ['hosting', 'databases', 'php'],
    extraButtons: [{
      label: <span className="text-white text-xs font-bold">€</span>,
      position: 'left-12',
      isTag: true,
    }],
  },
  {
    name: 'Molisebasket',
    description: 'Restyling completo del portale ufficiale: risultati live, roster dinamici e CMS headless per la redazione.',
    descriptionShort: 'Restyling portale: risultati live, roster dinamici e CMS headless.',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    gradient: 'from-purple-100 to-purple-200',
    overlay: 'from-accent/20 to-purple-400/20',
    icon: <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />,
    url: 'https://new.molisebasket.net',
    stackIds: ['hosting', 'databases'],
    extraButtons: [{
      label: <span className="text-white text-xs font-bold">€</span>,
      position: 'left-12',
      isTag: true,
    }],
  },
  {
    name: 'Deskit',
    description: 'Suite per gestire menu, palinsesti e promo nei punti vendita con sincronizzazione cloud e player offline.',
    descriptionShort: 'Suite per gestire menu, palinsesti e promo con sync cloud.',
    tags: ['React', 'Electron', 'Firebase'],
    gradient: 'from-green-100 to-green-200',
    overlay: 'from-green-400/20 to-emerald-400/20',
    icon: <><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></>,
    comingSoon: true,
    stackIds: ['frontend', 'hosting', 'php', 'git'],
  },
];

const btnOverlay = 'w-9 h-9 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110';
const btnOverlayMobile = 'w-9 h-9 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10';

interface ProjectsProps {
  onShowStack: (stackIds: string[]) => void;
}

export default function ProjectsSection({ onShowStack }: ProjectsProps) {
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const [devTooltip, setDevTooltip] = useState<{ x: number; y: number } | null>(null);
  const [comingSoonTooltip, setComingSoonTooltip] = useState<{ x: number; y: number } | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const totalProjects = PROJECTS.length;
  const visibleProjects = 4;
  const canScrollLeft = projectIndex > 0;
  const canScrollRight = projectIndex < totalProjects - visibleProjects;

  const scrollProjects = useCallback((direction: 'left' | 'right') => {
    setProjectIndex(prev => {
      if (direction === 'left') return Math.max(0, prev - 1);
      return Math.min(totalProjects - visibleProjects, prev + 1);
    });
    isProgrammaticScroll.current = true;
  }, [totalProjects]);

  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const cardWidth = 256 + 16;
    container.scrollTo({ left: projectIndex * cardWidth, behavior: 'smooth' });

    const timeout = setTimeout(() => { isProgrammaticScroll.current = false; }, 350);
    return () => clearTimeout(timeout);
  }, [projectIndex]);

  useEffect(() => {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setIsProjectsVisible(true); }); },
      { threshold: 0.3 }
    );

    observer.observe(projectsSection);
    return () => observer.disconnect();
  }, []);

  const handleOpenUrl = (p: ProjectData) => {
    if (p.urlAction) { p.urlAction(); return; }
    if (p.url) window.open(p.url, '_blank', 'noopener,noreferrer');
  };

  const showDevTooltip = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
  };

  const showComingSoonTooltip = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setComingSoonTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
  };

  return (
    <>
      <AnimatedSection id="projects" title="Projects" variant="left" showTitle={false} className="max-md:!min-h-fit max-md:!py-10">
        <div className="max-w-6xl mx-auto mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-center">
            <span className="text-accent">Progetti in</span><br />
            <span className="relative inline-block px-2">
              <span className="relative z-0">evidenza</span>
              <span
                className={`absolute bottom-0 left-0 w-full h-[110%] bg-yellow-300/50 -rotate-1 z-10 ${isProjectsVisible ? 'animate-highlight-draw' : 'opacity-0'}`}
                style={{ animationDelay: isProjectsVisible ? '0.5s' : '0s', animationFillMode: 'forwards' }}
              ></span>
            </span>
          </h2>
        </div>

        {/* Desktop: carousel con frecce */}
        <div className="hidden md:block relative mx-auto" style={{ maxWidth: 'calc(256px * 4 + 16px * 3 + 96px)' }}>
          <button
            type="button"
            onClick={() => scrollProjects('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${canScrollLeft ? 'opacity-100 hover:bg-accent hover:text-white hover:border-accent' : 'opacity-30 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollProjects('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-200 ${canScrollRight ? 'opacity-100 hover:bg-accent hover:text-white hover:border-accent' : 'opacity-30 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            ref={projectsContainerRef}
            className="overflow-x-auto mx-12 scrollbar-hide py-4 -my-4"
            style={{ width: 'calc(256px * 4 + 16px * 3)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
              if (isProgrammaticScroll.current) return;
              const container = e.currentTarget;
              const cardWidth = 256 + 16;
              const newIndex = Math.round(container.scrollLeft / cardWidth);
              if (newIndex !== projectIndex) setProjectIndex(newIndex);
            }}
          >
            <div className="flex gap-4">
              {PROJECTS.map((p) => (
                <div key={p.name} className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
                  <div className={`relative h-36 bg-gradient-to-br ${p.gradient} overflow-hidden rounded-t-lg`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.overlay}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">{p.icon}</svg>
                      </div>
                    </div>
                    {p.comingSoon ? (
                      <button
                        className={`absolute top-2 left-2 ${btnOverlay} cursor-default`}
                        onMouseEnter={showComingSoonTooltip}
                        onMouseLeave={() => setComingSoonTooltip(null)}
                      >
                        <LinkIcon />
                      </button>
                    ) : (
                      <button onClick={() => handleOpenUrl(p)} className={`absolute top-2 left-2 ${btnOverlay}`}>
                        <LinkIcon />
                      </button>
                    )}
                    {p.extraButtons?.map((btn, i) => (
                      btn.isTag ? (
                        <div key={i} className={`absolute top-2 ${btn.position} ${btnOverlay} cursor-default pointer-events-none`}>
                          {btn.label}
                        </div>
                      ) : (
                        <button key={i} onClick={btn.action} className={`absolute top-2 ${btn.position} ${btnOverlay}`}>
                          {btn.label}
                        </button>
                      )
                    ))}
                    {p.stackIds && (
                      <button
                        onClick={() => onShowStack(p.stackIds!)}
                        onMouseEnter={showDevTooltip}
                        onMouseLeave={() => setDevTooltip(null)}
                        className={`absolute top-2 right-2 ${btnOverlay}`}
                      >
                        <CodeIcon />
                      </button>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">{p.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: mini-tile espandibili */}
        <div className="md:hidden w-full px-4 space-y-2">
          {PROJECTS.map((p) => {
            const isOpen = expandedMobile === p.name;
            return (
              <div key={p.name} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-colors duration-200 ${isOpen ? 'border-accent/40' : 'border-gray-200'}`}>
                <button
                  onClick={() => setExpandedMobile(isOpen ? null : p.name)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">{p.icon}</svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`font-semibold text-sm transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-gray-900'}`}>{p.name}</span>
                    <div className="flex gap-1 mt-0.5">
                      {p.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-[10px] rounded text-gray-500">{tag}</span>
                      ))}
                      {p.comingSoon && (
                        <span className="px-1.5 py-0.5 bg-accent/10 text-[10px] rounded text-accent font-medium">Soon</span>
                      )}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{p.descriptionShort}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {p.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          {p.comingSoon ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-xs rounded-lg text-gray-400">
                              <LinkIcon />
                              <span className="text-gray-500">Prossimamente</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenUrl(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs rounded-lg active:scale-95 transition-transform"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Visita
                            </button>
                          )}
                          {p.extraButtons?.some(btn => btn.isTag) && (
                            <span className="inline-flex items-center px-2.5 py-1.5 bg-green-50 text-xs rounded-lg text-green-700 font-medium">
                              Progetto a pagamento
                            </span>
                          )}
                          {p.stackIds && (
                            <button
                              onClick={() => onShowStack(p.stackIds!)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/80 text-white text-xs rounded-lg active:scale-95 transition-transform ml-auto"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                              Stack
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Divider decorativo */}
      <div className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-accent/50 flex-1 max-w-xs"></div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-accent/40 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="h-px bg-gradient-to-l from-transparent via-accent/30 to-accent/50 flex-1 max-w-xs"></div>
          </div>
        </div>
      </div>

      {devTooltip && (
        <div
          className="fixed z-[9999] px-2 py-1 bg-accent text-white text-[10px] rounded-md shadow-lg pointer-events-none animate-fade-in"
          style={{ left: devTooltip.x, top: devTooltip.y, transform: 'translateX(-50%)' }}
        >
          Cliccami!
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent"></span>
        </div>
      )}
      {comingSoonTooltip && (
        <div
          className="fixed z-[9999] px-2 py-1 bg-accent text-white text-[10px] rounded-md shadow-lg pointer-events-none animate-fade-in"
          style={{ left: comingSoonTooltip.x, top: comingSoonTooltip.y, transform: 'translateX(-50%)' }}
        >
          Prossimamente
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent"></span>
        </div>
      )}
    </>
  );
}
