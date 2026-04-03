'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import AnimatedSection from '../ui/AnimatedSection';

interface ProjectsProps {
  onShowStack: (stackIds: string[]) => void;
}

export default function ProjectsSection({ onShowStack }: ProjectsProps) {
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const [devTooltip, setDevTooltip] = useState<{ x: number; y: number } | null>(null);

  const totalProjects = 5;
  const visibleProjects = 4;
  const canScrollLeft = projectIndex > 0;
  const canScrollRight = projectIndex < totalProjects - visibleProjects;

  const scrollProjects = useCallback((direction: 'left' | 'right') => {
    setProjectIndex(prev => {
      if (direction === 'left') return Math.max(0, prev - 1);
      return Math.min(totalProjects - visibleProjects, prev + 1);
    });
    isProgrammaticScroll.current = true;
  }, [totalProjects, visibleProjects]);

  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const cardWidth = 256 + 16;
    container.scrollTo({
      left: projectIndex * cardWidth,
      behavior: 'smooth'
    });

    const timeout = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 350);

    return () => clearTimeout(timeout);
  }, [projectIndex]);

  useEffect(() => {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsProjectsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(projectsSection);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AnimatedSection id="projects" title="Projects" variant="left" showTitle={false}>
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
              if (newIndex !== projectIndex) {
                setProjectIndex(newIndex);
              }
            }}
          >
            <div className="flex gap-4">
              {/* Project 1 - Community */}
              <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
                <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-slate-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a1 1 0 000 2h1v10H4a1 1 0 000 2h12a1 1 0 000-2h-1V5h1a1 1 0 000-2H4zm5 2v10h2V5H9z" />
                      </svg>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://lab.retr0hub.dev', '_blank', 'noopener,noreferrer')}
                    className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all durataion-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onShowStack(['frontend', 'backend', 'containers', 'databases', 'hosting', 'git'])}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                    }}
                    onMouseLeave={() => setDevTooltip(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Community</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti pubblicati con pipeline CI/CD automatizzata.</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Astro</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Cloudflare</span>
                  </div>
                </div>
              </div>

              {/* Project 2 - Portfolio */}
              <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
                <div className="relative h-36 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onShowStack(['frontend', 'hosting', 'git'])}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                    }}
                    onMouseLeave={() => setDevTooltip(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Portfolio</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">Nuovo ecosistema personale: design system proprietario, esperimenti UI e spazio community/lab in continua evoluzione.</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Next.js 15</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Framer Motion</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Turbopack</span>
                  </div>
                </div>
              </div>

              {/* Project 3 - Passoetiro */}
              <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
                <div className="relative h-36 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://passoetiro.com', '_blank', 'noopener,noreferrer')}
                    className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => window.open('mailto:info@retr0.dev?subject=Richiesta%20informazioni%20progetto%20Passoetiro', '_blank')}
                    className="absolute top-2 left-10 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <span className="text-white text-xs font-bold">€</span>
                  </button>
                  <button 
                    onClick={() => onShowStack(['hosting', 'databases', 'php'])}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                    }}
                    onMouseLeave={() => setDevTooltip(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Passoetiro</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">Magazine digitale con redazione multi-autore, agenda eventi e ottimizzazione SEO dedicata al basket nazionale.</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
                  </div>
                </div>
              </div>

              {/* Project 4 - Molisebasket */}
              <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
                <div className="relative h-36 bg-gradient-to-br from-purple-100 to-purple-200 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-400/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://new.molisebasket.net', '_blank', 'noopener,noreferrer')}
                    className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onShowStack(['hosting', 'databases'])}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                    }}
                    onMouseLeave={() => setDevTooltip(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Molisebasket</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">Restyling completo del portale ufficiale: risultati live, roster dinamici e CMS headless per la redazione.</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Supabase</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
                  </div>
                </div>
              </div>

              {/* Project 5 - Deskit */}
              <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-accent transition-all duration-300 hover:-translate-y-1 w-64 flex-shrink-0 snap-start">
                <div className="relative h-36 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://deskit.svago.online', '_blank', 'noopener,noreferrer')}
                    className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onShowStack(['frontend', 'hosting', 'php', 'git'])}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDevTooltip({ x: rect.left + rect.width / 2, y: rect.top - 32 });
                    }}
                    onMouseLeave={() => setDevTooltip(null)}
                    className="absolute top-2 right-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-900/60 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors text-base">Deskit</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">Suite per gestire menu, palinsesti e promo nei punti vendita con sincronizzazione cloud e player offline.</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">React</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Electron</span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">Firebase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: scroll orizzontale con swipe */}
        <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-4 px-4" style={{ width: 'max-content' }}>
            {/* Project 1 - Community */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-slate-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a1 1 0 000 2h1v10H4a1 1 0 000 2h12a1 1 0 000-2h-1V5h1a1 1 0 000-2H4zm5 2v10h2V5H9z" />
                    </svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://lab.retr0hub.dev', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Community</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Playground sperimentale per componenti UI, articoli tecnici e micro-esperimenti.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Astro</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Cloudflare</span>
                </div>
              </div>
            </div>

            {/* Project 2 - Portfolio */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
                  </div>
                </div>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Portfolio</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Ecosistema personale: design system proprietario, esperimenti UI e community/lab.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Next.js 15</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Framer Motion</span>
                </div>
              </div>
            </div>

            {/* Project 3 - Passoetiro */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://passoetiro.com', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Passoetiro</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Magazine digitale con redazione multi-autore e ottimizzazione SEO.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">MDX</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
                </div>
              </div>
            </div>

            {/* Project 4 - Molisebasket */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-purple-100 to-purple-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://new.molisebasket.net', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Molisebasket</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Restyling portale: risultati live, roster dinamici e CMS headless.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Next.js</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Supabase</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Tailwind</span>
                </div>
              </div>
            </div>

            {/* Project 5 - Deskit */}
            <div className="group bg-white border border-gray-200 rounded-lg shadow-sm w-[280px] flex-shrink-0 snap-center">
              <div className="relative h-32 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>
                  </div>
                </div>
                <button onClick={() => window.open('https://deskit.svago.online', '_blank', 'noopener,noreferrer')} className="absolute top-2 left-2 w-7 h-7 bg-gray-900/40 backdrop-blur-sm rounded-md flex items-center justify-center z-10">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-base">Deskit</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">Suite per gestire menu, palinsesti e promo con sync cloud.</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">React</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Electron</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-700">Firebase</span>
                </div>
              </div>
            </div>
          </div>
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

      {/* Tooltip overlay per DEV badge */}
      {devTooltip && (
        <div 
          className="fixed z-[9999] px-2 py-1 bg-accent text-white text-[10px] rounded-md shadow-lg pointer-events-none animate-fade-in"
          style={{ 
            left: devTooltip.x, 
            top: devTooltip.y,
            transform: 'translateX(-50%)'
          }}
        >
          Cliccami!
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent"></span>
        </div>
      )}
    </>
  );
}
